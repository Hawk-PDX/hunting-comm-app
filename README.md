# Hunting Communication App

A React Native and Node.js application designed for hunters to communicate their locations, send messages, and manage emergency situations while in remote hunting areas with limited cellular connectivity.

## 🎯 Features

### Core Features
- **Real-time Location Sharing**: Share GPS coordinates with hunting group members
- **Emergency Alerts**: Send distress signals with location to all group members
- **Group Messaging**: Text communication between hunting party members
- **Low-connectivity Optimized**: Designed to work with minimal cellular data
- **Offline-first Architecture**: Store data locally and sync when connection available
- **Battery Optimization**: Minimal battery drain for extended hunting trips

### Safety Features
- **Emergency Contact Integration**: Store emergency contact information
- **Geofencing**: Set up safety zones with entry/exit alerts
- **Check-in System**: Regular status updates with minimal data usage
- **Location History**: Track member movements over time

## 🏗 Tech Stack

### Mobile App (React Native/Expo)
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation between screens
- **Socket.io Client**: Real-time communication
- **Expo Location**: GPS and location services
- **AsyncStorage**: Local data persistence

### Backend (Node.js)
- **Express.js**: Web framework
- **Socket.io**: Real-time bidirectional communication
- **PostgreSQL**: Database for storing user data and locations
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Helmet**: Security middleware

### Database
- **PostgreSQL**: Primary database for users, groups, messages, and location data
- Optimized for real-time location updates and message history

## 📁 Project Structure

```
hunting-comm-app/
├── mobile-app/                 # React Native Expo app
│   ├── src/
│   │   ├── screens/            # App screens (Auth, Map, Messages, etc.)
│   │   ├── context/            # React contexts (Auth, Location, Socket)
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API and utility services
│   │   └── utils/              # Helper functions
│   ├── App.js                  # Main app component
│   └── package.json
├── backend/                    # Node.js Express server
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Socket.io event handlers
│   │   ├── config/             # Database and app configuration
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # Data models
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Utility functions
│   ├── server.js               # Main server file
│   └── package.json
├── docs/                       # Documentation files
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Expo CLI**: `npm install -g expo-cli`
- **iOS Simulator** (for iOS development) or **Android Studio** (for Android development)

### Database Setup

1. Install PostgreSQL and create a new database:
```sql
CREATE DATABASE hunting_comm;
```

2. Run the database schema:
```bash
cd backend
psql -U postgres -d hunting_comm -f src/config/schema.sql
```

3. Create a `.env` file in the backend directory:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hunting_comm
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key_here

# Client
CLIENT_URL=http://localhost:3000
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update package.json scripts:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Mobile App Setup

1. Navigate to the mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure app.json for location permissions:
```json
{
  "expo": {
    "name": "Hunting Comm",
    "slug": "hunting-comm-app",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app uses location to share your position with your hunting group for safety purposes.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "This app uses background location to keep your hunting group updated on your position for safety."
      }
    },
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}
```

4. Start the Expo development server:
```bash
npx expo start
```

## 📱 Running the App

### Development Mode

1. Start the backend server:
```bash
cd backend && npm run dev
```

2. Start the mobile app:
```bash
cd mobile-app && npx expo start
```

3. Use the Expo Go app on your phone or simulator to scan the QR code

### Testing

- Use the registration form to create a test account
- Grant location permissions when prompted
- Test location sharing and emergency features
- Verify real-time communication between multiple devices

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hunting_comm
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

**Mobile App**
Update the API URLs in the context files:
- `src/context/SocketContext.js` - Set SOCKET_URL
- `src/screens/AuthScreen.js` - Set API_URL

### Database Schema

The database includes tables for:
- **users**: User accounts and profiles
- **hunting_groups**: Hunting party management
- **group_members**: Group membership relationships
- **location_updates**: Real-time GPS coordinates
- **messages**: Group communication
- **emergency_alerts**: Distress signals and alerts
- **geofences**: Safety zone definitions

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all user inputs
- **CORS Protection**: Configure allowed origins
- **Helmet.js**: Security headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Real-time Events (Socket.io)
- `location_update` - Share location with group
- `send_message` - Send message to group
- `send_emergency_alert` - Send emergency alert
- `join_group` - Join group room
- `leave_group` - Leave group room

## 🎯 Usage

### User Registration
1. Open the app and tap "Register"
2. Fill in required fields including emergency contact
3. Create secure credentials

### Joining a Hunting Group
1. Get invite code from group admin
2. Join group through group management screen
3. Start receiving location updates from other members

### Sharing Location
1. Ensure GPS permissions are granted
2. Tap "Share My Location" on the map screen
3. Location is broadcast to all group members

### Emergency Alerts
1. Go to Emergency tab
2. Select emergency type (Lost, Injured, Weapon Issue, Other)
3. Confirm to send alert with GPS coordinates to all group members

## 🔮 Future Enhancements

### Planned Features
- **Offline Maps**: Pre-download hunting area maps
- **Weather Integration**: Current weather conditions
- **Hunting Log**: Track game sightings and activities
- **Voice Messages**: Audio communication for stealth
- **Photo Sharing**: Share hunting photos with location tags
- **Trail Cameras**: Integration with remote cameras
- **Ballistics Calculator**: Shot planning tools

### Technical Improvements
- **Push Notifications**: Native app notifications
- **Background Location**: Continuous tracking
- **Data Compression**: Optimize for low bandwidth
- **Encryption**: End-to-end message encryption
- **Offline Sync**: Better offline capabilities
- **Multi-platform**: Desktop companion app

## 🐛 Troubleshooting

### Common Issues

**Location not working:**
- Ensure location permissions are granted
- Check GPS is enabled on device
- Verify network connectivity

**Connection issues:**
- Check backend server is running
- Verify API URLs in mobile app
- Check firewall settings

**Database errors:**
- Ensure PostgreSQL is running
- Verify database credentials
- Check database schema is applied

### Debug Mode

Enable debug logging by setting NODE_ENV=development in backend and using __DEV__ checks in mobile app.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with description

## 📄 License

This project is for educational and personal use. Commercial use requires permission.

## ⚠️ Disclaimer

This app is designed to enhance hunting safety but should not be relied upon as the sole safety measure. Always follow proper hunting safety protocols and inform others of your hunting plans.

---

**Happy and Safe Hunting! 🦌🏹**