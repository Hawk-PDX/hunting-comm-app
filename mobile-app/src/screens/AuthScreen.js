import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getApiConfig } from '../config/api';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { API_URL } = await getApiConfig();
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.user, data.token);
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateRegisterForm = () => {
    const { username, email, password, confirmPassword, fullName } = registerForm;

    if (!username || !email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateRegisterForm()) return;

    setLoading(true);
    try {
      const { API_URL } = await getApiConfig();
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.user, data.token);
      } else {
        Alert.alert('Registration Failed', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="location" size={60} color="#fff" />
          <Text style={styles.title}>PDXplore</Text>
          <Text style={styles.subtitle}>Stay Safe, Stay Connected. Never Stop Exploring</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.activeTab]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.activeTab]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {isLogin ? (
            // Login Form
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={loginForm.email}
                onChangeText={(text) =>
                  setLoginForm({ ...loginForm, email: text.toLowerCase() })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={loginForm.password}
                onChangeText={(text) =>
                  setLoginForm({ ...loginForm, password: text })
                }
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Registration Form
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Username *"
                value={registerForm.username}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, username: text })
                }
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={registerForm.fullName}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, fullName: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Email *"
                value={registerForm.email}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, email: text.toLowerCase() })
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password *"
                value={registerForm.password}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, password: text })
                }
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                value={registerForm.confirmPassword}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, confirmPassword: text })
                }
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={registerForm.phoneNumber}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, phoneNumber: text })
                }
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact Name"
                value={registerForm.emergencyContactName}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, emergencyContactName: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact Phone"
                value={registerForm.emergencyContactPhone}
                onChangeText={(text) =>
                  setRegisterForm({ ...registerForm, emergencyContactPhone: text })
                }
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Registering...' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#A5D6A7',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  activeTab: {
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});