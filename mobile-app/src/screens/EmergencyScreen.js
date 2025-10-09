import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import { useSocket } from '../context/SocketContext';

export default function EmergencyScreen() {
  const [sendingAlert, setSendingAlert] = useState(false);
  const { location, getCurrentLocation } = useLocation();
  const { sendEmergencyAlert, connected } = useSocket();
  const [currentGroupId] = useState('demo-group-id'); // This would come from group context

  const emergencyTypes = [
    { type: 'lost', title: 'Lost/Disoriented', icon: 'compass', color: '#FF9800' },
    { type: 'injured', title: 'Injured', icon: 'medical', color: '#F44336' },
    { type: 'weapon_malfunction', title: 'Weapon Issue', icon: 'warning', color: '#FF5722' },
    { type: 'other', title: 'Other Emergency', icon: 'alert-circle', color: '#9C27B0' },
  ];

  const handleEmergencyAlert = async (alertType) => {
    if (!connected) {
      Alert.alert('No Connection', 'Cannot send emergency alert. Please check your connection.');
      return;
    }

    Alert.alert(
      'Send Emergency Alert',
      `Are you sure you want to send a ${alertType.title.toLowerCase()} alert to your hunting group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Alert', style: 'destructive', onPress: () => sendAlert(alertType) }
      ]
    );
  };

  const sendAlert = async (alertType) => {
    setSendingAlert(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) {
        Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
        return;
      }

      sendEmergencyAlert({
        groupId: currentGroupId,
        alertType: alertType.type,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        description: `Emergency alert: ${alertType.title}`,
      });

      Alert.alert(
        'Emergency Alert Sent',
        'Your emergency alert has been sent to all group members with your current location.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert('Error', 'Failed to send emergency alert. Please try again.');
    } finally {
      setSendingAlert(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="warning" size={40} color="#F44336" />
        <Text style={styles.title}>Emergency Alerts</Text>
        <Text style={styles.subtitle}>
          Send immediate alerts to your hunting group
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Ionicons 
            name={connected ? "wifi" : "wifi-off"} 
            size={20} 
            color={connected ? "#4CAF50" : "#F44336"} 
          />
          <Text style={[styles.statusText, { color: connected ? "#4CAF50" : "#F44336" }]}>
            {connected ? "Connected to group" : "Disconnected"}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Ionicons 
            name={location ? "location" : "location-off"} 
            size={20} 
            color={location ? "#4CAF50" : "#F44336"} 
          />
          <Text style={[styles.statusText, { color: location ? "#4CAF50" : "#F44336" }]}>
            {location ? "GPS location available" : "GPS location unavailable"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Emergency Types</Text>

      <View style={styles.emergencyContainer}>
        {emergencyTypes.map((emergency, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.emergencyButton, { borderColor: emergency.color }]}
            onPress={() => handleEmergencyAlert(emergency)}
            disabled={!connected || sendingAlert}
          >
            <View style={[styles.emergencyIcon, { backgroundColor: emergency.color }]}>
              <Ionicons name={emergency.icon} size={30} color="#fff" />
            </View>
            <Text style={styles.emergencyTitle}>{emergency.title}</Text>
            <Text style={styles.emergencyDescription}>
              Tap to send alert with your location
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle" size={24} color="#2196F3" />
        <Text style={styles.infoText}>
          Emergency alerts will immediately notify all group members and include your GPS coordinates. 
          Only use in genuine emergency situations.
        </Text>
      </View>

      {sendingAlert && (
        <View style={styles.sendingContainer}>
          <Text style={styles.sendingText}>Sending emergency alert...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  emergencyContainer: {
    paddingHorizontal: 20,
  },
  emergencyButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  emergencyDescription: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  sendingContainer: {
    backgroundColor: '#FF9800',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});