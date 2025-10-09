import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function MapScreen() {
  const [currentGroupId] = useState('demo-group-id'); // This would come from group context
  const { location, getCurrentLocation, hasPermission } = useLocation();
  const { sendLocationUpdate, connected } = useSocket();
  const { user } = useAuth();

  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (hasPermission) {
      getCurrentLocation();
    }
  }, [hasPermission]);

  const handleShareLocation = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Location permission is required to share your location.');
      return;
    }

    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation && connected) {
        sendLocationUpdate({
          groupId: currentGroupId,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          altitude: currentLocation.coords.altitude,
          heading: currentLocation.coords.heading,
          speed: currentLocation.coords.speed,
        });
        
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
        Alert.alert('Success', 'Location shared with your hunting group!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share location. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Location Map</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: connected ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {connected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={60} color="#9E9E9E" />
        <Text style={styles.mapText}>Map View Coming Soon</Text>
        <Text style={styles.mapSubtext}>
          This will display real-time locations of all hunting group members
        </Text>
      </View>

      <View style={styles.infoContainer}>
        {location ? (
          <View>
            <Text style={styles.infoTitle}>Your Current Location</Text>
            <Text style={styles.infoText}>
              Lat: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Lng: {location.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Accuracy: {location.coords.accuracy?.toFixed(0)}m
            </Text>
          </View>
        ) : (
          <Text style={styles.infoText}>Location not available</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isSharing && styles.buttonSharing]}
          onPress={handleShareLocation}
          disabled={!connected || isSharing}
        >
          <Ionicons 
            name={isSharing ? "checkmark-circle" : "share"} 
            size={20} 
            color="#fff" 
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isSharing ? 'Location Shared!' : 'Share My Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={getCurrentLocation}>
          <Ionicons name="refresh" size={20} color="#2E7D32" style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    margin: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginTop: 10,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonSharing: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});