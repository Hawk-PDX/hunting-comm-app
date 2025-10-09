import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission',
          'This app needs location access for hunting safety features.',
          [{ text: 'OK' }]
        );
        return;
      }

      setHasPermission(true);
      getCurrentLocation();
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setErrorMsg('Failed to request location permission');
    }
  };

  const getCurrentLocation = async () => {
    try {
      if (!hasPermission) {
        setErrorMsg('Location permission not granted');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      setErrorMsg('Failed to get current location');
      return null;
    }
  };

  const startLocationTracking = async () => {
    if (!hasPermission) {
      await requestLocationPermission();
      return;
    }

    setIsTracking(true);
    // Implementation for background location tracking would go here
    // This is a placeholder for the full implementation
  };

  const stopLocationTracking = () => {
    setIsTracking(false);
    // Stop background location tracking
  };

  const value = {
    location,
    hasPermission,
    isTracking,
    errorMsg,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    requestLocationPermission,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};