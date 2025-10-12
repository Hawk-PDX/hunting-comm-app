# Render Deployment TODO

## Backend Deployment
- [ ] Sign up for Render account at https://render.com
- [ ] Connect GitHub repository to Render
- [ ] Create a new PostgreSQL database on Render
- [ ] Create a new Web Service on Render for the backend
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables:
  - NODE_ENV: production
  - JWT_SECRET: [generate a secure secret]
  - DATABASE_URL: [from Render PostgreSQL instance]
- [ ] Run the schema.sql on the Render database
- [ ] Deploy the backend

## Mobile App Deployment
- [ ] Update mobile-app/src/config/api.js with actual Render URL
- [ ] Build and submit mobile app to app stores or use Expo

## Testing
- [ ] Test backend health endpoint
- [ ] Test mobile app connection to deployed backend
