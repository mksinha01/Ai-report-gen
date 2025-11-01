# 📋 Meeting Minutes & Event Report Generator

An AI-powered web application that generates professional meeting minutes (MoM) and event reports with photo integration, outputted as beautifully formatted LaTeX PDFs.

## ✨ Features

- **Minimal Form Interface**: Clean, modern UI with event name, date, key points, and up to 3 photo uploads
- **AI-Powered Content Generation**: Uses OpenAI GPT-4 to transform bullet points into professional reports
- **Photo Integration**: Seamlessly embeds uploaded photos into the report
- **LaTeX PDF Output**: Professional, publication-quality PDF documents
- **Automatic Formatting**: Well-structured reports with table of contents, sections, and styling

## 🏗️ Architecture

```
Form Input → AI Report Generator → Format with Photos → LaTeX PDF Output
```

### Workflow Components:

1. **Frontend Form**: Collects event details, key points, and photos
- **AI Agent**: Groq AI (Llama 3.3 70B) generates professional report content
3. **PDF Service**: Formats report using LaTeX with embedded photos
4. **Download**: User receives publication-ready PDF

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **LaTeX Distribution**:
  - **Windows**: [MiKTeX](https://miktex.org/download) or [TeX Live](https://tug.org/texlive/)
  - **macOS**: [MacTeX](https://www.tug.org/mactex/)
  - **Linux**: `sudo apt-get install texlive-full` or `sudo yum install texlive`
- **Groq API Key** - [Get one FREE here](https://console.groq.com/keys)

### Verify LaTeX Installation

Open a terminal/command prompt and run:
```bash
pdflatex --version
```

You should see version information. If not, LaTeX is not properly installed.

## 🚀 Installation

### 1. Clone or Download the Project

```bash
cd "c:\A SSD NEW WIN\code\report"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
copy .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 📖 Usage

1. **Open the Application**: Navigate to `http://localhost:3000` in your web browser

2. **Fill Out the Form**:
   - Enter the event/meeting name
   - Select the date
   - Add key points in the text area (bullet points work well)
   - Optionally upload up to 3 photos

3. **Generate Report**: Click "🚀 Generate Report"

4. **Download PDF**: The PDF will automatically download when ready

### Example Input:

**Event Name**: Q4 Planning Meeting

**Date**: 2025-11-02

**Key Points**:
```
- Reviewed Q3 performance metrics - exceeded targets by 15%
- Discussed Q4 budget allocation for marketing and R&D
- Approved new product launch strategy for December
- Action Item: Marketing team to submit campaign proposal by Nov 10
- Action Item: Engineering to complete beta testing by Nov 20
- Decided to increase social media advertising budget by 20%
```

## 📁 Project Structure

```
report/
├── public/                  # Frontend files
│   ├── index.html          # Main form interface
│   ├── styles.css          # Styling
│   └── script.js           # Client-side logic
├── services/               # Backend services
│   ├── reportGenerator.js  # Main orchestrator
│   ├── aiService.js        # OpenAI integration
│   └── pdfService.js       # LaTeX PDF generation
├── uploads/                # Temporary photo storage (auto-created)
├── temp/                   # Temporary files (auto-created)
├── server.js               # Express server
├── package.json            # Dependencies
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key (FREE) | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

### Photo Upload Limits

- **Maximum files**: 3 images
- **Maximum file size**: 5MB per image
- **Accepted formats**: JPEG, JPG, PNG, GIF

## 🛠️ Troubleshooting

### LaTeX Not Found Error

**Error**: `spawn pdflatex ENOENT`

**Solution**:
1. Ensure LaTeX is installed (see Prerequisites)
2. Verify `pdflatex` is in your system PATH
3. Restart your terminal/IDE after installation

### Groq API Error

**Error**: `Invalid Groq API key`

**Solution**:
1. Check that your `.env` file exists and contains the correct API key
2. Get a FREE API key at https://console.groq.com/keys
3. Groq offers free tier with generous rate limits

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
1. Change the PORT in `.env` to another number (e.g., 3001)
2. Or stop the process using port 3000

### Photo Upload Issues

**Error**: Photos not appearing in PDF

**Solution**:
1. Check that images are under 5MB
2. Ensure images are in supported formats (JPEG, PNG, GIF)
3. Check the `uploads/` directory exists and has write permissions

## 🎨 Customization

### Modify LaTeX Template

Edit `services/pdfService.js` to customize:
- Colors and styling
- Section formatting
- Header/footer layout
- Page margins

### Adjust AI Prompt or Model

Edit `services/aiService.js` to customize:
- Report structure
- Tone and style
- Section names
- Level of detail
- AI model (llama-3.3-70b-versatile, mixtral-8x7b-32768, etc.)

### Change UI Design

Edit `public/styles.css` to customize:
- Colors and theme
- Layout and spacing
- Form styling
- Responsive design

## 📊 API Endpoints

### POST `/api/generate-report`

Generates a report and returns PDF.

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `eventName` (string, required)
  - `eventDate` (string, required)
  - `keyPoints` (string, required)
  - `photos` (files, optional, max 3)

**Response**:
- Content-Type: application/pdf
- Body: PDF file buffer

### GET `/api/health`

Health check endpoint.

**Response**:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📝 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI**: Groq AI (Llama 3.3 70B) - Fast & FREE
- **PDF Generation**: LaTeX (pdflatex), node-latex
- **File Upload**: Multer
- **Environment**: dotenv

## 🔒 Security Considerations

- API keys are stored in environment variables (never commit `.env`)
- File uploads are validated and limited
- Uploaded files are automatically cleaned up
- Input is sanitized before LaTeX processing

## 📄 License

ISC

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.

---

**Happy Report Generating! 📋✨**
