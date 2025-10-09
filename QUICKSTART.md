# Quick Start Guide

Get the Hunting Communication App running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js (v18+): `node --version`
- ✅ PostgreSQL running: `psql --version`
- ✅ Expo CLI: `npm list -g @expo/cli` or install with `npm install -g @expo/cli`

## 1. Database Setup (2 minutes)

```bash
# Create database
createdb hunting_comm

# Run schema (from project root)
cd backend
psql -d hunting_comm -f src/config/schema.sql
```

## 2. Backend Setup (1 minute)

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your PostgreSQL password
# Update DB_PASSWORD=your_actual_password

# Install dependencies and start
npm install
npm run dev
```

Backend should now be running on http://localhost:5000

## 3. Mobile App Setup (1 minute)

```bash
# Navigate to mobile app (from project root)
cd mobile-app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

## 4. Test the App (1 minute)

1. Scan QR code with Expo Go app on your phone
2. Or press 'i' for iOS simulator / 'a' for Android emulator
3. Register a new account
4. Grant location permissions
5. Test location sharing on the Map tab

## 🎉 You're Ready!

### Next Steps:
- Create multiple accounts to test group features
- Try the emergency alert system
- Explore the Socket.io real-time communication

### Troubleshooting:
- **Database connection error**: Check PostgreSQL is running and .env is configured
- **Location not working**: Ensure permissions are granted in device settings
- **Can't connect to backend**: Verify backend is running on port 5000

### Development Tips:
- Use `npm run dev` in backend for auto-restart on changes
- Check browser console and Expo logs for debugging
- Backend logs show real-time socket connections

Happy hunting! 🦌