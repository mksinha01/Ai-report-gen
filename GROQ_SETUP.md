# 🚀 How to Get Your FREE Groq API Key

## Why Groq?

✅ **100% FREE** - No credit card required  
✅ **Lightning Fast** - 10x faster than OpenAI  
✅ **Powerful** - Llama 3.3 70B model  
✅ **Generous Limits** - 14,400 requests/day  
✅ **No Hidden Costs** - Completely free tier  

---

## Step-by-Step Guide (Takes 2 Minutes!)

### 1. Visit Groq Console
Go to: **https://console.groq.com/**

### 2. Sign Up
- Click "Sign In" or "Get Started"
- Sign up with:
  - 🔵 Google Account (recommended - fastest)
  - 🐙 GitHub Account
  - 📧 Email

### 3. Create API Key
1. After signing in, go to: **https://console.groq.com/keys**
2. Click **"Create API Key"**
3. Give it a name (e.g., "MoM Generator")
4. Click **"Submit"**
5. **COPY YOUR API KEY** - It looks like: `gsk_xxxxxxxxxxxxxxxxxx`

### 4. Add to Your Project
1. Open the `.env` file in your project folder
2. Replace the placeholder:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   With your actual key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxx
   ```
3. Save the file

### 5. You're Done! 🎉
Run your application:
```bash
npm start
```

---

## Available Models

Groq offers several FREE models:

| Model | Best For | Speed |
|-------|----------|-------|
| **llama-3.3-70b-versatile** | High-quality reports (DEFAULT) | ⚡⚡⚡ |
| **mixtral-8x7b-32768** | Fast, balanced performance | ⚡⚡⚡⚡ |
| **llama-3.1-70b-versatile** | Alternative quality option | ⚡⚡⚡ |
| **gemma2-9b-it** | Fastest, simple reports | ⚡⚡⚡⚡⚡ |

All models are **FREE** with the same rate limits!

---

## Rate Limits (FREE Tier)

- **30 requests per minute**
- **14,400 requests per day**
- **No monthly limit** - just daily resets

This means you can generate:
- ✅ Up to 30 reports per minute
- ✅ Up to 14,400 reports per day
- ✅ Completely FREE!

---

## Troubleshooting

### Can't find API Keys page?
Direct link: https://console.groq.com/keys

### API Key not working?
- Make sure there are no extra spaces
- Ensure you copied the entire key (starts with `gsk_`)
- Check that `.env` file is in the project root folder

### Need more requests?
The free tier is very generous. If you need more:
- Wait for daily reset (midnight UTC)
- Or contact Groq for enterprise plans

---

## Security Tips

🔒 **Never share your API key**  
🔒 **Never commit `.env` to Git** (it's already in `.gitignore`)  
🔒 **Regenerate if exposed** (you can create new keys anytime)

---

## Comparison with OpenAI

| Feature | Groq (FREE) | OpenAI GPT-4 |
|---------|-------------|--------------|
| **Cost** | $0.00 | ~$0.03-0.06/report |
| **Speed** | 10x faster | Standard |
| **Setup** | No credit card | Credit card required |
| **Limits** | 14,400/day | Based on credits |
| **Quality** | Excellent | Excellent |

---

**Ready?** Get your FREE key now: https://console.groq.com/keys

Then run `npm start` and start generating reports! 🚀
