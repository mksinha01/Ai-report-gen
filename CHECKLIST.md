# Setup Checklist

## Before Running the Application

### Dependencies Installation
- [x] Node.js installed (v16+)
- [x] Project dependencies installed (`npm install`)

### Required Setup (Not Yet Complete)
- [ ] LaTeX Distribution Installed
  - [ ] Downloaded MiKTeX or TeX Live
  - [ ] Installed the software
  - [ ] Restarted computer
  - [ ] Verified with `pdflatex --version`

- [ ] Groq API Configuration (FREE!)
  - [ ] Created account at console.groq.com
  - [ ] Generated FREE API key
  - [ ] Added API key to `.env` file
  - [ ] No credit card required!

### Ready to Run
- [ ] All above items checked
- [ ] Run `npm start`
- [ ] Open http://localhost:3000
- [ ] Test with sample meeting minutes

---

## Download Links

- **MiKTeX (Windows)**: https://miktex.org/download
- **TeX Live (Windows)**: https://tug.org/texlive/windows.html
- **Groq API Keys (FREE)**: https://console.groq.com/keys

---

## Quick Test After Setup

Run this command to verify everything is ready:
```bash
# Check LaTeX
pdflatex --version

# Check Node.js
node --version

# Check npm packages
npm list --depth=0
```

All should return version information with no errors.
