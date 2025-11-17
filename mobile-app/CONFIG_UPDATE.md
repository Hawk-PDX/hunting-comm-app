# Mobile App Configuration Update

After deploying your backend to Render, you need to update the mobile app to point to your production API.

## Step 1: Get Your Production URL

After deploying to Render, your production URL will be one of:
- **Render default:** `https://hunting-comm-backend-xxxx.onrender.com`
- **Custom domain:** `https://hunting.yourdomain.com`

## Step 2: Update the API Configuration

Edit the file: `mobile-app/src/config/api.js`

### Current Configuration (lines 33-36):

```javascript
return {
  API_URL: 'https://your-render-app-name.onrender.com/api',
  SOCKET_URL: 'https://your-render-app-name.onrender.com'
};
```

### Replace with Your Production URL:

**Option A: Using Render default URL**
```javascript
return {
  API_URL: 'https://hunting-comm-backend-xxxx.onrender.com/api',
  SOCKET_URL: 'https://hunting-comm-backend-xxxx.onrender.com'
};
```

**Option B: Using custom domain** (recommended after DNS setup)
```javascript
return {
  API_URL: 'https://hunting.yourdomain.com/api',
  SOCKET_URL: 'https://hunting.yourdomain.com'
};
```

## Step 3: Test the Configuration

1. **Start the mobile app:**
   ```bash
   cd mobile-app
   npx expo start
   ```

2. **Test connectivity:**
   - Try logging in or creating an account
   - Check if location sharing works
   - Verify real-time messaging
   - Test emergency alerts

3. **Check the console:**
   - Look for the log: `Using production API: https://...`
   - Ensure no connection errors

## Troubleshooting

### Connection Failed Error

If you get connection errors:

1. **Verify the URL is correct:**
   - Open the URL in a browser: `https://your-url.com/health`
   - You should see: `{"status":"OK","timestamp":"...","uptime":...}`

2. **Check CORS settings:**
   - The backend is configured to allow all origins (`*`)
   - If you added a custom domain, make sure it's working

3. **Wait for Render spin-up:**
   - Free tier services spin down after 15 minutes of inactivity
   - First request may take 30-60 seconds to wake up

### SSL Certificate Errors

If using a custom domain:
- Ensure DNS has propagated (use `nslookup hunting.yourdomain.com`)
- Wait for Render to provision the SSL certificate (usually automatic within 1 hour)

## Environment-Specific Configuration

The app already handles development vs production automatically:

- **Development mode** (`__DEV__ === true`):
  - Uses ngrok tunnel if available
  - Falls back to local network (localhost or 10.0.0.173)

- **Production mode** (`__DEV__ === false`):
  - Uses the URLs you configure in this file
  - This happens when you build for App Store/Google Play

## Building for Production

When you're ready to build the mobile app for distribution:

```bash
# For iOS
cd mobile-app
eas build --platform ios

# For Android
eas build --platform android
```

Make sure the production URLs are set correctly before building!
