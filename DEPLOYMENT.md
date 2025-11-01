# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: Render.com (Recommended - FREE)

**Easiest deployment with free tier!**

1. **Push to GitHub** (if not done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Render.com**:
   - Visit [https://render.com](https://render.com)
   - Sign up/Login with GitHub

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `report-generator` repo

4. **Configure Service**:
   - **Name**: `report-generator` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

5. **Add Environment Variable**:
   - Click "Advanced" → "Add Environment Variable"
   - **Key**: `GROQ_API_KEY`
   - **Value**: `your_groq_api_key_here` (get free key from console.groq.com)

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://report-generator-xxxx.onrender.com`

**Render Free Tier**:
- ✅ Free SSL certificate
- ✅ Auto-deploy on git push
- ✅ 512MB RAM
- ⚠️ Spins down after 15 min inactivity (30s cold start)

---

### Option 2: Railway.app (FREE $5/month credit)

1. **Go to Railway**:
   - Visit [https://railway.app](https://railway.app)
   - Login with GitHub

2. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variable**:
   - Click on your service
   - Go to "Variables" tab
   - Add: `GROQ_API_KEY` = your_key

4. **Deploy**:
   - Railway auto-deploys
   - Get your URL from "Settings" → "Domains"

**Railway Free Tier**:
- ✅ $5 free credit/month
- ✅ Custom domains
- ✅ Always-on (no cold starts)

---

### Option 3: Vercel (Serverless)

**Note**: Requires slight modifications for serverless

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Create vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variable**:
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add `GROQ_API_KEY`

---

### Option 4: Heroku (FREE tier discontinued, $5/month minimum)

1. **Install Heroku CLI**:
   - Download from [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login and Create App**:
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set Environment Variable**:
   ```bash
   heroku config:set GROQ_API_KEY=your_key
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

---

### Option 5: Glitch.com (FREE)

1. **Go to Glitch**:
   - Visit [https://glitch.com](https://glitch.com)
   - Click "New Project" → "Import from GitHub"

2. **Import Repository**:
   - Enter your GitHub repo URL

3. **Add Environment Variable**:
   - Click `.env` file in left sidebar
   - Add: `GROQ_API_KEY=your_key`

4. **Auto-deploys** - Your app is live!

---

## 📋 Pre-Deployment Checklist

- [x] `.env` file in `.gitignore` ✅
- [x] Dependencies in `package.json` ✅
- [x] Start script configured ✅
- [x] Environment variables documented ✅
- [x] Port configured from `process.env.PORT` ✅

## 🔒 Security Notes

- ✅ Never commit `.env` file
- ✅ Use environment variables for API keys
- ✅ `.gitignore` properly configured
- ✅ Sensitive data excluded from repo

## 🌐 After Deployment

1. Test your live URL
2. Check all features work
3. Upload test photos
4. Generate PDF and DOC reports
5. Monitor logs for errors

## 💡 Tips

- **Render/Railway**: Best for always-on apps
- **Vercel**: Best for serverless/low traffic
- **Glitch**: Best for quick demos
- **Free Options**: Render, Railway ($5 credit), Glitch

## 🆘 Troubleshooting

**Problem**: App won't start
- Check environment variables set correctly
- Review deployment logs
- Ensure `node server.js` is the start command

**Problem**: File upload errors
- Most platforms limit file size (Render: 10MB, Vercel: 4.5MB)
- Consider using cloud storage (AWS S3, Cloudinary) for images

**Problem**: Cold starts on Render
- Upgrade to paid tier ($7/month) for always-on
- Or use Railway with free $5 credit

---

## 📧 Support

Need help? Open an issue on GitHub!

---

**Recommended**: Start with **Render.com** - it's the easiest and has a generous free tier!
