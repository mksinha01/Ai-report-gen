# 🚀 Quick Start Guide

## ⚠️ IMPORTANT: Setup Required

Before running the application, you need to complete these setup steps:

### 1. ✅ Install LaTeX (Required for PDF Generation)

**You need to install a LaTeX distribution on Windows:**

#### Option A: MiKTeX (Recommended for Windows)
1. Download from: https://miktex.org/download
2. Run the installer
3. Choose "Install missing packages automatically" during installation
4. **Restart your computer after installation**

#### Option B: TeX Live
1. Download from: https://tug.org/texlive/windows.html
2. Run the installer (this may take a while)
3. **Restart your computer after installation**

#### Verify Installation:
After installing LaTeX, open a **new** PowerShell/Command Prompt and run:
```bash
pdflatex --version
```

You should see version information. If not, LaTeX is not properly installed or not in your PATH.

### 2. ✅ Configure Groq API Key (FREE!)

1. Get your FREE API key from: https://console.groq.com/keys
   - Sign up with Google/GitHub (takes 30 seconds)
   - No credit card required!
   - Free tier with generous limits
2. Open the `.env` file in this directory
3. Replace `your_groq_api_key_here` with your actual API key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
   ```

### 3. ✅ Start the Application

After completing steps 1 and 2:

```bash
npm start
```

Or for development mode with auto-reload:
```bash
npm run dev
```

### 4. ✅ Access the Application

Open your browser and go to: **http://localhost:3000**

---

## 📝 Usage Example

1. **Event Name**: "Team Standup Meeting"
2. **Date**: Select today's date
3. **Key Points**: 
   ```
   - John completed the authentication module
   - Sarah is working on the dashboard UI
   - Mike identified a bug in the payment system
   - Action: Mike to fix payment bug by Friday
   - Action: Team to review PR #123
   ```
4. **Photos**: Upload meeting screenshots or whiteboard photos (optional)
5. Click **"Generate Report"**
6. Wait 10-30 seconds while AI generates the content
7. PDF will automatically download!

---

## 🔧 Troubleshooting

### LaTeX Not Working
- Make sure you **restarted your computer** after installing LaTeX
- Verify `pdflatex` is in your PATH
- Try opening a **new** terminal window

### Groq API Error
- Check your API key is correctly set in `.env`
- Get a FREE API key at https://console.groq.com/keys
- Make sure there are no extra spaces in the API key
- Groq is FREE - no credit card needed!

### Port Already in Use
- Change PORT in `.env` to a different number (e.g., 3001, 8080)
- Or stop the other process using port 3000

---

## 📦 What Was Installed

- ✅ Express.js - Web server
- ✅ Multer - File upload handling
- ✅ Groq SDK - AI report generation (FREE & FAST!)
- ✅ node-latex - LaTeX to PDF conversion
- ✅ Other utilities (dotenv, cors, uuid)

---

## 🎯 Next Steps

1. Install LaTeX (see step 1 above)
2. Get your FREE Groq API key and add it to `.env`
3. Restart your terminal/computer if needed
4. Run `npm start`
5. Open http://localhost:3000
6. Generate your first report!

## 🚀 Why Groq?

- ✅ **FREE** - No credit card required
- ✅ **FAST** - 10x faster than traditional APIs
- ✅ **POWERFUL** - Uses Llama 3.3 70B model
- ✅ **GENEROUS** - 14,400 requests per day free
- ✅ **NO LIMITS** - Perfect for testing and production

---

**Need help?** Check the full README.md for detailed documentation.
