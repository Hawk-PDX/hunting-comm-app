import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getApiConfig } from '../config/api';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      initializeSocket().catch(console.error);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, token]);

  const initializeSocket = async () => {
    const { SOCKET_URL } = await getApiConfig();
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
        userId: user.id
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);
  };

  // Socket event helpers
  const joinGroup = (groupId) => {
    if (socket && user) {
      socket.emit('join_group', { groupId, userId: user.id });
    }
  };

  const leaveGroup = (groupId) => {
    if (socket && user) {
      socket.emit('leave_group', { groupId, userId: user.id });
    }
  };

  const sendLocationUpdate = (locationData) => {
    if (socket && user) {
      socket.emit('location_update', {
        userId: user.id,
        ...locationData
      });
    }
  };

  const sendMessage = (messageData) => {
    if (socket && user) {
      socket.emit('send_message', {
        senderId: user.id,
        ...messageData
      });
    }
  };

  const sendEmergencyAlert = (emergencyData) => {
    if (socket && user) {
      socket.emit('send_emergency_alert', {
        userId: user.id,
        ...emergencyData
      });
    }
  };

  const value = {
    socket,
    connected,
    joinGroup,
    leaveGroup,
    sendLocationUpdate,
    sendMessage,
    sendEmergencyAlert,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};