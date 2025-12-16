import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GroupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Ionicons name="people" size={60} color="#9E9E9E" />
        <Text style={styles.placeholderText}>Hunting Group</Text>
        <Text style={styles.placeholderSubtext}>
          Group management and member list coming soon
        </Text>
        <Button
          title="+ Add group member"
          onPress={addToGroup}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginTop: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 10,
  },
});