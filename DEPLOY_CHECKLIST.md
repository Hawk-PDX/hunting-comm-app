# 🚀 Quick Deployment Checklist

Use this checklist to deploy your Hunting Communication App to production.

## Prerequisites ✅

- [ ] Render account created (https://render.com)
- [ ] GitHub repository access
- [ ] Namecheap domain ready
- [ ] All local changes committed

## Phase 1: Initial Deployment (15-20 minutes)

### 1. Push Deployment Files
```bash
git add render.yaml DEPLOYMENT.md DEPLOY_CHECKLIST.md backend/init-db.js mobile-app/CONFIG_UPDATE.md
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy on Render
- [ ] Go to https://dashboard.render.com/
- [ ] Click **"New +"** → **"Blueprint"**
- [ ] Connect GitHub and select `hunting-comm-app` repository
- [ ] Click **"Apply"** to deploy
- [ ] Wait for deployment (3-5 minutes)

### 3. Initialize Database
- [ ] Go to your database in Render dashboard
- [ ] Click **"Connect"** → **"External Connection"**
- [ ] Copy the `psql` connection command
- [ ] Run it in your terminal
- [ ] Copy and paste the contents of `backend/src/config/schema.sql`
- [ ] Or use the helper script: `node backend/init-db.js` (requires DATABASE_URL env var)

### 4. Set Environment Variable
- [ ] Go to your web service → **"Environment"**
- [ ] Set `CLIENT_URL` to `*`
- [ ] Save changes

### 5. Test Deployment
- [ ] Copy your Render URL: `https://hunting-comm-backend-xxxx.onrender.com`
- [ ] Test health endpoint: `curl https://your-url.onrender.com/health`
- [ ] Should return: `{"status":"OK",...}`

**✅ Backend is now deployed!**

---

## Phase 2: Custom Domain Setup (1-2 hours)

### 1. Add Custom Domain in Render
- [ ] Go to your service → **"Settings"** → **"Custom Domains"**
- [ ] Click **"Add Custom Domain"**
- [ ] Enter: `hunting.yourdomain.com` (or your chosen subdomain)
- [ ] Copy the CNAME value provided

### 2. Configure DNS in Namecheap
- [ ] Log in to Namecheap
- [ ] Go to **Domain List** → Select domain → **"Advanced DNS"**
- [ ] Add CNAME Record:
  - Type: `CNAME Record`
  - Host: `hunting`
  - Value: `[the CNAME from Render]`
  - TTL: `Automatic`
- [ ] Save changes

### 3. Wait for DNS Propagation
- [ ] Check status: `nslookup hunting.yourdomain.com`
- [ ] Wait until it resolves (5 mins - 48 hours, usually < 1 hour)
- [ ] Render will auto-provision SSL certificate

### 4. Update Environment
- [ ] Update `CLIENT_URL` to `https://hunting.yourdomain.com`
- [ ] Restart service

**✅ Custom domain is now live!**

---

## Phase 3: Mobile App Configuration (5 minutes)

### 1. Update API Configuration
- [ ] Open `mobile-app/src/config/api.js`
- [ ] Replace lines 33-36 with your production URL:
  ```javascript
  return {
    API_URL: 'https://hunting.yourdomain.com/api',
    SOCKET_URL: 'https://hunting.yourdomain.com'
  };
  ```
- [ ] Save the file

### 2. Test Mobile App
- [ ] Run: `cd mobile-app && npx expo start`
- [ ] Test login/registration
- [ ] Test location sharing
- [ ] Test messaging
- [ ] Test emergency alerts

**✅ Mobile app is connected to production!**

---

## Phase 4: Commit Changes

```bash
git add mobile-app/src/config/api.js
git commit -m "Update mobile app to use production API"
git push origin main
```

---

## 🎉 Deployment Complete!

Your app is now live at:
- **Backend:** https://hunting.yourdomain.com
- **Health Check:** https://hunting.yourdomain.com/health
- **API:** https://hunting.yourdomain.com/api

---

## Next Steps

- [ ] Monitor logs in Render dashboard
- [ ] Test all features thoroughly
- [ ] Invite users to test
- [ ] Set up monitoring/alerting
- [ ] Plan for App Store/Google Play submission

---

## Important Notes

⚠️ **Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- First request after sleep: 30-60 seconds
- 750 hours/month total usage

💡 **Tips:**
- Keep an eye on your usage in Render dashboard
- Consider upgrading for production use
- Set up health check monitoring
- Regularly backup your database

---

## Need Help?

- **Detailed Guide:** See `DEPLOYMENT.md`
- **Mobile Config:** See `mobile-app/CONFIG_UPDATE.md`
- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com/

---

## Troubleshooting Quick Links

**Service won't start?**
→ Check logs in Render dashboard

**Database connection error?**
→ Verify schema is initialized: `node backend/init-db.js`

**Custom domain not working?**
→ Check DNS: `nslookup hunting.yourdomain.com`

**Mobile app can't connect?**
→ Test health endpoint: `curl https://your-url.com/health`
