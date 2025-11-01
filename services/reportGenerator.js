const { generateAIReport } = require('./aiService');
const { generatePDF } = require('./pdfService');

/**
 * Main report generation orchestrator
 * @param {Object} data - Report data including all event details and photos
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateReport(data) {
    try {
        console.log('Step 1: Generating AI-powered report content...');
        
        // Step 1: Generate professional report using AI
        const reportContent = await generateAIReport({
            eventTitle: data.eventTitle,
            eventType: data.eventType,
            eventDate: data.eventDate,
            location: data.location,
            organizer: data.organizer,
            attendees: data.attendees,
            agenda: data.agenda,
            summary: data.summary,
            decisions: data.decisions,
            notes: data.notes
        });
        
        console.log('Step 2: Creating PDF with LaTeX...');
        
        // Step 2: Format the report with photos and generate PDF
        const pdfBuffer = await generatePDF({
            eventTitle: data.eventTitle,
            eventType: data.eventType,
            eventDate: data.eventDate,
            location: data.location,
            reportContent: reportContent,
            photos: data.photos
        });
        
        console.log('✅ Report generated successfully!');
        
        return pdfBuffer;
        
    } catch (error) {
        console.error('Error in report generation:', error);
        throw new Error(`Report generation failed: ${error.message}`);
    }
}

module.exports = {
    generateReport
};
