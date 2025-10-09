# Hunting Comm Mobile App

A React Native Expo application designed to enhance hunting safety through real-time location sharing, emergency alerts, and group communication in remote areas with limited connectivity.

## 🎯 Overview

This mobile application provides hunters with essential safety and communication features when venturing into remote hunting areas. The app focuses on minimal battery drain and low-bandwidth operation while maintaining critical safety functionality.

## ✨ Current Features

### ✅ Implemented Features
- **User Authentication**: Complete registration and login system with emergency contact collection
- **Real-time Location Services**: GPS coordinate sharing with hunting group members
- **Emergency Alert System**: Four emergency types (Lost, Injured, Weapon Issue, Other) with GPS location broadcast
- **Socket.io Real-time Communication**: Live connection status and data transmission
- **Context-based State Management**: Organized authentication, location, and socket state management
- **Cross-platform Compatibility**: iOS and Android support with platform-specific optimizations

### 🚧 In Development
- **Interactive Map View**: Visual representation of group member locations (currently shows placeholder)
- **Group Messaging**: Text communication between hunting party members (UI placeholder ready)
- **Group Management**: Member list and group administration features (UI placeholder ready)

## 🏗 Technical Architecture

### Tech Stack
- **React Native + Expo SDK 54**: Cross-platform mobile development with managed workflow
- **React Navigation 7**: Bottom tab navigation with themed interface
- **Socket.io Client 4.8**: Real-time bidirectional communication
- **Expo Location**: High-accuracy GPS positioning services
- **AsyncStorage**: Persistent local data storage
- **Context API**: Centralized state management for auth, location, and socket connections

### Project Structure
```
src/
├── screens/
│   ├── AuthScreen.js         # Login/Registration with emergency contacts
│   ├── MapScreen.js          # Location sharing and GPS coordinate display
│   ├── MessagesScreen.js     # Group messaging (placeholder)
│   ├── GroupScreen.js        # Group management (placeholder)
│   └── EmergencyScreen.js    # Emergency alert broadcasting system
├── context/
│   ├── AuthContext.js        # Authentication and user state management
│   ├── LocationContext.js    # GPS permissions and location services
│   └── SocketContext.js      # Real-time communication management
└── App.js                    # Main app navigation and provider wrapper
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator or Android device/emulator
- Backend server running (see parent README)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API endpoint** (in development):
   - Update `SOCKET_URL` in `src/context/SocketContext.js`
   - Update `API_URL` in `src/screens/AuthScreen.js`

3. **Start development server:**
   ```bash
   npx expo start
   ```

4. **Run on device:**
   - iOS: Press `i` in terminal or use Expo Go app
   - Android: Press `a` in terminal or use Expo Go app

## 📱 Key Features Deep Dive

### Authentication System
- **Comprehensive registration** with emergency contact collection
- **Secure JWT token management** with AsyncStorage persistence
- **Automatic session restoration** on app restart
- **Form validation** with proper error handling

### Location Services
- **High-accuracy GPS** with `BestForNavigation` setting
- **Permission management** with user-friendly prompts
- **Real-time location updates** with coordinate precision to 6 decimal places
- **Location sharing** with group members via Socket.io

### Emergency Alert System
- **Four alert types**: Lost/Disoriented, Injured, Weapon Issue, Other Emergency
- **GPS coordinate inclusion** in all emergency alerts
- **Visual feedback** with color-coded emergency types
- **Confirmation dialogs** to prevent accidental alerts
- **Group-wide broadcasting** via real-time sockets

### Real-time Communication
- **Socket.io implementation** with authentication
- **Connection status monitoring** with visual indicators
- **Automatic reconnection** handling
- **Event-based architecture** for scalable real-time features

## 🎨 User Interface

### Design System
- **Consistent color scheme**: Primary green (#2E7D32) with safety-focused red accents
- **Native UI components**: Platform-specific design following iOS/Android guidelines
- **Accessibility considerations**: Clear icons, readable text, and touch-friendly buttons
- **Status indicators**: Real-time connection and GPS status display

### Navigation Structure
- **Bottom tab navigation** with four main sections
- **Contextual headers** with appropriate styling
- **Icon system** using Expo Vector Icons (Ionicons)

## 🔧 Configuration

### Environment Setup
The app automatically detects development vs. production mode using `__DEV__`:
- **Development**: Uses local IP addresses for backend connection
- **Production**: Requires production URL configuration

### Permissions
- **iOS**: Location permissions configured in `app.json` with usage descriptions
- **Android**: Fine and coarse location permissions with background location support

## 🧪 Testing Features

### Current Testing Capabilities
1. **User Registration/Login**: Create accounts with emergency contact info
2. **Location Permissions**: Grant GPS access and verify coordinate accuracy
3. **Location Sharing**: Test real-time coordinate broadcasting
4. **Emergency Alerts**: Send test alerts and verify group delivery
5. **Connection Status**: Monitor real-time connection stability

## 🔜 Roadmap

### Next Development Phase
1. **Interactive Map Integration**: Replace placeholder with actual map component
2. **Message History**: Implement persistent group messaging
3. **Group Management**: Add/remove members, group settings
4. **Push Notifications**: Native alert system integration

### Future Enhancements
- **Offline map caching** for remote area usage
- **Battery optimization** for extended hunting trips
- **Voice messages** for stealth communication
- **Photo sharing** with location tagging

## 📊 Performance Considerations

- **Minimal battery drain**: Efficient location updates and socket management
- **Low bandwidth operation**: Optimized for poor cellular connectivity
- **Local data persistence**: Critical data stored offline-first
- **Connection resilience**: Automatic reconnection and error handling

## 🛠 Development Notes

### Code Quality
- **Clean architecture**: Separation of concerns with context providers
- **Error handling**: Comprehensive try-catch blocks and user feedback
- **Type safety considerations**: Consistent prop handling and validation
- **Performance optimization**: Efficient state management and re-rendering

### Debugging
- **Development logging**: Console output for connection and location events
- **Error boundaries**: Graceful error handling throughout the app
- **Network monitoring**: Real-time connection status display

---

**Built for hunters, by hunters. Safety first, always. 🦌🏹**

*This app is designed to enhance hunting safety but should not be relied upon as the sole safety measure. Always follow proper hunting safety protocols and inform others of your hunting plans.*