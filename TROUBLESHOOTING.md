# Troubleshooting Guide

## ✅ **Issue Resolved**: Bundle Loading Errors

The original console errors you encountered:
```
index.bundle:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Refused to execute script from 'http://localhost:8081/index.bundle?platform=web...
```

### **Root Cause**
1. **Web platform incompatibility**: `react-native-maps` doesn't work on Expo's web platform
2. **Cache issues**: Old bundles and cache were causing conflicts
3. **Node.js version warnings**: Your Node v20.19.0 vs required v20.19.4 (minor issue)

### **Solution Applied**
1. ✅ Removed `react-native-maps` dependency (will add proper maps later)
2. ✅ Disabled web platform in `app.json` - set `"platforms": ["ios", "android"]`  
3. ✅ Cleared all caches and rebuilt clean
4. ✅ Use Expo Go mode for development

### **How to Start the App Now**
```bash
cd mobile-app
npx expo start --go --clear
```

## 🔧 Common Issues & Solutions

### **1. Bundle/Metro Issues**
**Symptoms**: Bundle fails to load, 500 errors, MIME type errors
**Solutions**:
```bash
# Clear all caches
rm -rf .expo node_modules/.cache .metro-cache
npm install

# Start with fresh cache
npx expo start --clear --go
```

### **2. Node.js Version Warnings**
**Symptoms**: `npm warn EBADENGINE` messages
**Current**: You have Node v20.19.0 (vs required v20.19.4)
**Impact**: Warnings only, app still works
**Solution**: Update Node.js when convenient:
```bash
# Using nvm (recommended)
nvm install 20.19.4
nvm use 20.19.4

# Or update via Node.js website
# https://nodejs.org/
```

### **3. Web Platform Issues**
**Symptoms**: Web-related bundle errors
**Solution**: Disable web platform in `app.json`:
```json
{
  "expo": {
    "platforms": ["ios", "android"]
  }
}
```

### **4. Dependency Conflicts**
**Symptoms**: Build failures, unexpected errors
**Solutions**:
```bash
# Check for outdated packages
npx expo install --fix

# Verify Expo compatibility
npx expo doctor
```

### **5. Location Permission Issues**
**Symptoms**: Location not working in app
**iOS**: Check `app.json` has location permissions
**Android**: Grant permissions in device settings
**Solution**: Already configured in your `app.json`

### **6. Socket.io Connection Issues**
**Symptoms**: Real-time features not working
**Check**:
- Backend server is running on port 5000
- Mobile app is on same network as backend
- Update socket URL in `SocketContext.js` if needed

## 🚀 Development Workflow

### **Starting Development**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Mobile App  
cd mobile-app
npx expo start --go

# Scan QR code with Expo Go app
```

### **Testing on Different Platforms**
```bash
# iOS Simulator
npx expo start --go
# Then press 'i'

# Android Emulator/Device
npx expo start --go  
# Then press 'a'

# Don't use web (disabled)
```

### **Cache Management**
```bash
# Light cache clear
npx expo start --clear

# Heavy cache clear
rm -rf .expo node_modules/.cache .metro-cache && npm install
```

## 🔍 Debugging Tips

### **Checking Logs**
- Metro bundler logs appear in terminal
- Device logs in Expo Go app
- Browser dev tools (only for web, which is disabled)

### **Network Issues**
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check Metro bundler
curl http://localhost:8082
```

### **Version Information**
```bash
# Check versions
node --version          # Should be v20.19.0+
npm --version           # Should be 10.9.2+
npx expo --version      # Should be latest

# Check Expo project status
npx expo doctor
```

## 📱 Next Steps

Your app is now running correctly! You can:

1. **Test the Authentication**: Register a new user
2. **Grant Location Permissions**: When prompted in the app
3. **Test Location Sharing**: On the Map tab
4. **Try Emergency Alerts**: On the Emergency tab
5. **Setup Backend**: Follow the QUICKSTART.md guide

## 🆘 Still Having Issues?

1. **Check your Node.js version**: Consider updating to v20.19.4+
2. **Restart everything**: Kill all processes and restart
3. **Check network**: Ensure mobile device and computer are on same WiFi
4. **Try different device**: Test on iOS simulator or Android emulator

Your hunting communication app is ready for development! 🦌🏹