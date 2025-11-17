# Deployment Guide: Hunting Communication App

This guide walks you through deploying the Hunting Communication App backend to Render and configuring your custom domain.

## Prerequisites

- A [Render](https://render.com) account (free tier available)
- A [Namecheap](https://www.namecheap.com) domain
- GitHub repository access

## Part 1: Deploy to Render

### Option A: Deploy via Render Blueprint (Recommended)

This method uses the `render.yaml` configuration file to automatically set up everything.

1. **Push the latest changes to GitHub:**
   ```bash
   git add render.yaml DEPLOYMENT.md
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create a new Blueprint on Render:**
   - Go to https://dashboard.render.com/
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub account if you haven't already
   - Select the `hunting-comm-app` repository
   - Render will automatically detect the `render.yaml` file
   - Click **"Apply"**

3. **Configure environment variables:**
   After deployment starts, you'll need to set the `CLIENT_URL` environment variable:
   - Go to your service in the Render dashboard
   - Click **"Environment"** in the left sidebar
   - Set `CLIENT_URL` to `*` (for now, or your future custom domain)

4. **Wait for deployment:**
   - Render will automatically:
     - Create a PostgreSQL database
     - Deploy your Node.js backend
     - Link them together
   - This usually takes 3-5 minutes

5. **Initialize the database:**
   Once deployed, you need to run the schema SQL:
   - Go to your database in Render dashboard
   - Click **"Connect"** → **"External Connection"**
   - Use the provided `psql` command to connect, or use a GUI tool like pgAdmin
   - Run the contents of `backend/src/config/schema.sql`

### Option B: Manual Deployment

If you prefer manual setup:

1. **Create PostgreSQL Database:**
   - In Render Dashboard, click **"New +"** → **"PostgreSQL"**
   - Name: `hunting-comm-db`
   - Database: `hunting_comm`
   - Region: Oregon (or closest to you)
   - Plan: Free
   - Click **"Create Database"**
   - Wait for provisioning, then run the schema (see step 5 in Option A)

2. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your `hunting-comm-app` repository
   - Configure:
     - **Name:** `hunting-comm-backend`
     - **Region:** Oregon
     - **Branch:** main
     - **Root Directory:** (leave empty)
     - **Runtime:** Node
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Plan:** Free

3. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = (copy from your database's internal connection string)
   - `JWT_SECRET` = (generate a secure random string, at least 32 characters)
   - `CLIENT_URL` = `*`

4. **Deploy:**
   - Click **"Create Web Service"**

## Part 2: Get Your Render URL

After deployment completes:

1. Go to your web service in the Render dashboard
2. Your URL will be something like: `https://hunting-comm-backend-xxxx.onrender.com`
3. **Save this URL** - you'll need it for:
   - Configuring your mobile app
   - Setting up your custom domain

## Part 3: Test Your Deployment

Test the health endpoint:
```bash
curl https://your-app-name.onrender.com/health
```

You should get a response like:
```json
{
  "status": "OK",
  "timestamp": "2025-11-17T20:47:39.123Z",
  "uptime": 123.456
}
```

## Part 4: Configure Custom Domain (Namecheap Subdomain)

### Step 1: Add Custom Domain in Render

1. Go to your web service in Render dashboard
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter your subdomain (e.g., `hunting.yourdomain.com`)
5. Render will provide you with a CNAME value

### Step 2: Configure DNS in Namecheap

1. Log in to [Namecheap](https://www.namecheap.com)
2. Go to **Domain List** → Select your domain
3. Click **"Advanced DNS"**
4. Add a new CNAME Record:
   - **Type:** CNAME Record
   - **Host:** `hunting` (or your chosen subdomain)
   - **Value:** The CNAME value from Render (e.g., `hunting-comm-backend-xxxx.onrender.com`)
   - **TTL:** Automatic

5. Click **"Save All Changes"**

### Step 3: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours (usually within 1 hour)
- Check status: `nslookup hunting.yourdomain.com`
- Render will automatically provision an SSL certificate once DNS is verified

### Step 4: Update Environment Variables

Once your custom domain is working:

1. In Render dashboard, update `CLIENT_URL` to your custom domain:
   - `CLIENT_URL` = `https://hunting.yourdomain.com`

2. Restart your service for changes to take effect

## Part 5: Update Mobile App Configuration

After deployment, update the mobile app to point to your production API:

1. Open `mobile-app/src/config/api.js`

2. Replace the production URLs:
   ```javascript
   return {
     API_URL: 'https://hunting.yourdomain.com/api',
     SOCKET_URL: 'https://hunting.yourdomain.com'
   };
   ```

3. Test the mobile app to ensure it connects to your production backend

## Part 6: Ongoing Maintenance

### Monitoring

- Check your service logs in Render dashboard
- Set up email notifications for deploy failures
- Monitor your free tier limits (750 hours/month)

### Updates

Render will automatically deploy when you push to your `main` branch:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

### Database Backups

Render Free tier doesn't include automatic backups. Consider:
- Upgrading to a paid plan for automatic backups
- Manually exporting your database periodically

### Important Notes

- **Free tier limitations:**
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month across all services
  
- **Security recommendations:**
  - Never commit `.env` files to GitHub
  - Rotate JWT_SECRET periodically
  - Review CORS settings before going to production
  - Enable rate limiting (already configured)

## Troubleshooting

### Service won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure database is running

### Database connection errors
- Verify `DATABASE_URL` is set correctly
- Check that schema has been initialized
- Ensure database is in the same region as your service

### Custom domain not working
- Verify CNAME is set correctly in Namecheap
- Wait for DNS propagation (use `nslookup` or `dig` to check)
- Check Render's custom domain status

### Mobile app can't connect
- Verify the production URL in `api.js` matches your Render URL
- Check CORS settings in `backend/src/server.js`
- Test the `/health` endpoint from a browser

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)

## Next Steps

After successful deployment:

1. ✅ Deploy backend to Render
2. ✅ Initialize database schema
3. ✅ Test API endpoints
4. ✅ Configure custom domain
5. ✅ Update mobile app configuration
6. 📱 Build and test mobile app with production backend
7. 📱 Deploy mobile app to App Store / Google Play (future)
