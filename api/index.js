// Simple health check endpoint for Vercel
module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.json({ 
        status: 'OK', 
        message: 'Report Generator API is running',
        timestamp: new Date().toISOString(),
        env: process.env.GROQ_API_KEY ? 'API Key configured' : 'API Key missing'
    });
};
