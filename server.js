// Load environment variables FIRST before any other modules
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateReport } = require('./services/reportGenerator');
const { generateDOCX } = require('./services/docxService');
const { generatePDF } = require('./services/pdfService');

const app = express();
const PORT = process.env.PORT || 3000;

// Create necessary directories
const dirs = ['uploads', 'temp'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        files: 3
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Main report generation endpoint with format support
app.post('/api/generate-report', upload.array('photos', 3), async (req, res) => {
    let uploadedFiles = [];
    
    try {
        const { 
            eventTitle, 
            eventType, 
            eventDate, 
            location, 
            organizer, 
            attendees, 
            agenda, 
            summary, 
            decisions, 
            notes,
            format = 'pdf' // 'pdf' or 'docx'
        } = req.body;
        
        // Validate required fields
        if (!eventTitle || !eventType || !eventDate || !location || !organizer || !attendees || !agenda || !summary) {
            throw new Error('Missing required fields');
        }
        
        // Get uploaded file paths
        uploadedFiles = req.files ? req.files.map(file => file.path) : [];
        
        console.log('Generating report for:', eventTitle);
        console.log('Format:', format);
        console.log('Uploaded photos:', uploadedFiles.length);
        
        const reportData = {
            eventTitle,
            eventType,
            eventDate,
            location,
            organizer,
            attendees,
            agenda,
            summary,
            decisions,
            notes,
            photos: uploadedFiles
        };
        
        if (format === 'docx') {
            // Generate DOCX directly
            const { generateAIReport } = require('./services/aiService');
            const reportContent = await generateAIReport(reportData);
            const docxBuffer = await generateDOCX({
                ...reportData,
                reportContent
            });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="report_${Date.now()}.docx"`);
            res.send(docxBuffer);
        } else {
            // Generate PDF (default)
            const pdfBuffer = await generateReport(reportData);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="report_${Date.now()}.pdf"`);
            res.send(pdfBuffer);
        }
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate report',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        // Clean up uploaded files after processing
        setTimeout(() => {
            uploadedFiles.forEach(file => {
                try {
                    if (fs.existsSync(file)) {
                        fs.unlinkSync(file);
                    }
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }, 5000);
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(error.status || 500).json({
        error: error.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📋 MoM & Report Generator is ready!`);
    console.log(`\n⚠️  Make sure to set your GROQ_API_KEY in .env file\n`);
});

module.exports = app;
