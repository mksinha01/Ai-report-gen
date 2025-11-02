// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import services
const { generateReport } = require('../services/reportGenerator');
const { generateDOCX } = require('../services/docxService');
const { generateAIReport } = require('../services/aiService');

// Configure multer for file uploads (use /tmp for Vercel)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '/tmp/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 4.5 * 1024 * 1024, // 4.5MB limit for Vercel
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

// Helper to run middleware
const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

// Main handler
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    let uploadedFiles = [];
    
    try {
        // Run multer middleware
        await runMiddleware(req, res, upload.array('photos', 3));
        
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
            format = 'pdf'
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
        
        // Clean up immediately for serverless
        uploadedFiles.forEach(file => {
            try {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        });
        
    } catch (error) {
        console.error('Error generating report:', error);
        
        // Clean up on error
        uploadedFiles.forEach(file => {
            try {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        });
        
        res.status(500).json({ 
            error: error.message || 'Failed to generate report',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
