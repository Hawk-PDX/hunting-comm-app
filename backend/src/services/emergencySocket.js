const { query } = require('../config/database');

module.exports = (socket, io) => {
  // Handle emergency alert
  socket.on('send_emergency_alert', async (data) => {
    try {
      const { userId, groupId, alertType, latitude, longitude, description } = data;

      // Validate required fields
      if (!userId || !groupId || !alertType || !latitude || !longitude) {
        socket.emit('emergency_error', { message: 'Missing required emergency data' });
        return;
      }

      // Store emergency alert in database
      const alertResult = await query(
        `INSERT INTO emergency_alerts (user_id, group_id, alert_type, latitude, longitude, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, created_at`,
        [userId, groupId, alertType, latitude, longitude, description]
      );

      const alertId = alertResult.rows[0].id;
      const createdAt = alertResult.rows[0].created_at;

      // Get user info
      const userInfo = await query(
        'SELECT username, full_name, phone_number, emergency_contact_name, emergency_contact_phone FROM users WHERE id = $1',
        [userId]
      );

      const user = userInfo.rows[0];

      const emergencyData = {
        id: alertId,
        userId,
        groupId,
        username: user.username,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        emergencyContact: {
          name: user.emergency_contact_name,
          phone: user.emergency_contact_phone
        },
        alertType,
        latitude,
        longitude,
        description,
        status: 'active',
        createdAt
      };

      // Broadcast emergency alert to all group members with high priority
      io.to(`group_${groupId}`).emit('emergency_alert', emergencyData);
      
      socket.emit('emergency_alert_sent', { alertId, createdAt });

      console.log(`🚨 EMERGENCY ALERT: ${alertType} from ${user.username} in group ${groupId}`);

    } catch (error) {
      console.error('Emergency alert error:', error);
      socket.emit('emergency_error', { message: 'Failed to send emergency alert' });
    }
  });

  // Handle emergency resolution
  socket.on('resolve_emergency', async (data) => {
    try {
      const { alertId, resolvedBy } = data;

      await query(
        'UPDATE emergency_alerts SET status = $1, resolved_by = $2, resolved_at = CURRENT_TIMESTAMP WHERE id = $3',
        ['resolved', resolvedBy, alertId]
      );

      // Get alert details for broadcast
      const alertInfo = await query(
        `SELECT ea.*, u.username, u.full_name 
         FROM emergency_alerts ea
         JOIN users u ON ea.user_id = u.id
         WHERE ea.id = $1`,
        [alertId]
      );

      const alert = alertInfo.rows[0];

      // Broadcast resolution to group
      io.to(`group_${alert.group_id}`).emit('emergency_resolved', {
        alertId,
        resolvedBy,
        resolvedAt: new Date(),
        originalAlert: alert
      });

      console.log(`✅ Emergency resolved: Alert ${alertId} by user ${resolvedBy}`);

    } catch (error) {
      console.error('Emergency resolution error:', error);
      socket.emit('emergency_error', { message: 'Failed to resolve emergency' });
    }
  });
};