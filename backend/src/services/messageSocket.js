const { query } = require('../config/database');

module.exports = (socket, io) => {
  // Handle sending a message
  socket.on('send_message', async (data) => {
    try {
      const { groupId, senderId, content, messageType = 'text', priority = 'normal', latitude, longitude } = data;

      // Validate required fields
      if (!groupId || !senderId || !content) {
        socket.emit('message_error', { message: 'Missing required message data' });
        return;
      }

      // Store message in database
      const messageResult = await query(
        `INSERT INTO messages (group_id, sender_id, message_type, content, latitude, longitude, priority)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, sent_at`,
        [groupId, senderId, messageType, content, latitude, longitude, priority]
      );

      const messageId = messageResult.rows[0].id;
      const sentAt = messageResult.rows[0].sent_at;

      // Get sender info
      const senderInfo = await query(
        'SELECT username, full_name FROM users WHERE id = $1',
        [senderId]
      );

      const messageData = {
        id: messageId,
        groupId,
        senderId,
        senderUsername: senderInfo.rows[0].username,
        senderFullName: senderInfo.rows[0].full_name,
        messageType,
        content,
        latitude,
        longitude,
        priority,
        sentAt
      };

      // Broadcast message to all group members
      io.to(`group_${groupId}`).emit('new_message', messageData);
      
      socket.emit('message_sent', { messageId, sentAt });

      console.log(`💬 Message sent in group ${groupId} by ${senderInfo.rows[0].username}`);

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('message_error', { message: 'Failed to send message' });
    }
  });

  // Handle message read receipt
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId, userId } = data;

      await query(
        `INSERT INTO message_reads (message_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT (message_id, user_id) DO NOTHING`,
        [messageId, userId]
      );

      socket.emit('message_read_confirmed', { messageId });

    } catch (error) {
      console.error('Mark message read error:', error);
    }
  });
};