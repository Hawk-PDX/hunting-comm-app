const { query } = require('../config/database');

module.exports = (socket, io) => {
  // Handle location update from client
  socket.on('location_update', async (data) => {
    try {
      const { 
        userId, 
        groupId, 
        latitude, 
        longitude, 
        accuracy, 
        altitude, 
        heading, 
        speed, 
        batteryLevel,
        isEmergency = false,
        notes 
      } = data;

      // Validate required fields
      if (!userId || !groupId || !latitude || !longitude) {
        socket.emit('location_error', { message: 'Missing required location data' });
        return;
      }

      // Validate that user is member of the group
      const memberCheck = await query(
        'SELECT id FROM group_members WHERE user_id = $1 AND group_id = $2',
        [userId, groupId]
      );

      if (memberCheck.rows.length === 0) {
        socket.emit('location_error', { message: 'User is not a member of this group' });
        return;
      }

      // Store location update in database
      const locationUpdate = await query(
        `INSERT INTO location_updates 
         (user_id, group_id, latitude, longitude, accuracy, altitude, heading, speed, battery_level, is_emergency, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, timestamp`,
        [userId, groupId, latitude, longitude, accuracy, altitude, heading, speed, batteryLevel, isEmergency, notes]
      );

      const locationId = locationUpdate.rows[0].id;
      const timestamp = locationUpdate.rows[0].timestamp;

      // Get user info for broadcast
      const userInfo = await query(
        'SELECT username, full_name FROM users WHERE id = $1',
        [userId]
      );

      const user = userInfo.rows[0];

      // Prepare location data for broadcast
      const locationData = {
        id: locationId,
        userId,
        groupId,
        username: user.username,
        fullName: user.full_name,
        latitude,
        longitude,
        accuracy,
        altitude,
        heading,
        speed,
        batteryLevel,
        isEmergency,
        notes,
        timestamp
      };

      // Broadcast to all group members
      socket.to(`group_${groupId}`).emit('location_updated', locationData);
      
      // Also send back to sender for confirmation
      socket.emit('location_update_success', { 
        id: locationId, 
        timestamp,
        message: 'Location updated successfully' 
      });

      // If this is an emergency location, send special alert
      if (isEmergency) {
        io.to(`group_${groupId}`).emit('emergency_location', {
          userId,
          username: user.username,
          fullName: user.full_name,
          latitude,
          longitude,
          timestamp,
          notes
        });
      }

      console.log(`Location updated: ${user.username} in group ${groupId}`);

    } catch (error) {
      console.error('Location update error:', error);
      socket.emit('location_error', { message: 'Failed to update location' });
    }
  });

  // Handle request for group locations
  socket.on('get_group_locations', async (data) => {
    try {
      const { groupId, userId } = data;

      // Validate that user is member of the group
      const memberCheck = await query(
        'SELECT id FROM group_members WHERE user_id = $1 AND group_id = $2',
        [userId, groupId]
      );

      if (memberCheck.rows.length === 0) {
        socket.emit('location_error', { message: 'User is not a member of this group' });
        return;
      }

      // Get latest location for each group member
      const locations = await query(
        `SELECT DISTINCT ON (lu.user_id) 
           lu.id, lu.user_id, lu.latitude, lu.longitude, lu.accuracy, 
           lu.altitude, lu.heading, lu.speed, lu.battery_level, 
           lu.is_emergency, lu.notes, lu.timestamp,
           u.username, u.full_name
         FROM location_updates lu
         INNER JOIN users u ON lu.user_id = u.id
         INNER JOIN group_members gm ON gm.user_id = u.id
         WHERE lu.group_id = $1 AND gm.group_id = $1
         ORDER BY lu.user_id, lu.timestamp DESC`,
        [groupId]
      );

      socket.emit('group_locations', {
        groupId,
        locations: locations.rows,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Get group locations error:', error);
      socket.emit('location_error', { message: 'Failed to get group locations' });
    }
  });

  // Handle joining a group room for location updates
  socket.on('join_group', async (data) => {
    try {
      const { groupId, userId } = data;

      // Validate that user is member of the group
      const memberCheck = await query(
        'SELECT id FROM group_members WHERE user_id = $1 AND group_id = $2',
        [userId, groupId]
      );

      if (memberCheck.rows.length === 0) {
        socket.emit('location_error', { message: 'User is not a member of this group' });
        return;
      }

      // Join the socket room for this group
      socket.join(`group_${groupId}`);
      
      // Update user session
      await query(
        `INSERT INTO user_sessions (user_id, socket_id, is_active)
         VALUES ($1, $2, true)
         ON CONFLICT (user_id) 
         DO UPDATE SET socket_id = $2, is_active = true, last_ping = CURRENT_TIMESTAMP`,
        [userId, socket.id]
      );

      socket.emit('group_joined', { 
        groupId,
        message: `Joined group ${groupId} successfully` 
      });

      console.log(`User ${userId} joined group ${groupId}`);

    } catch (error) {
      console.error('Join group error:', error);
      socket.emit('location_error', { message: 'Failed to join group' });
    }
  });

  // Handle leaving a group room
  socket.on('leave_group', async (data) => {
    try {
      const { groupId, userId } = data;

      // Leave the socket room
      socket.leave(`group_${groupId}`);

      // Update user session as inactive
      await query(
        'UPDATE user_sessions SET is_active = false WHERE user_id = $1 AND socket_id = $2',
        [userId, socket.id]
      );

      socket.emit('group_left', { 
        groupId,
        message: `Left group ${groupId}` 
      });

      console.log(`User ${userId} left group ${groupId}`);

    } catch (error) {
      console.error('Leave group error:', error);
      socket.emit('location_error', { message: 'Failed to leave group' });
    }
  });
};