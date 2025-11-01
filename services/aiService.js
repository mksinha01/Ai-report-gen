const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate professional meeting minutes or event report using Groq AI
 * @param {Object} data - Input data with all event details
 * @returns {Promise<Object>} - Structured report content
 */
async function generateAIReport(data) {
    try {
        const { eventTitle, eventType, eventDate, location, organizer, attendees, agenda, summary, decisions, notes } = data;
        
        const prompt = `You are a professional report writer. Generate a comprehensive and well-structured ${eventType} report based on the following information:

Event Title: ${eventTitle}
Event Type: ${eventType}
Date: ${eventDate}
Location: ${location}
Organizer: ${organizer}
Attendees: ${attendees}
Agenda: ${agenda}
Summary: ${summary}
Decisions: ${decisions || 'None specified'}
Additional Notes: ${notes || 'None'}

Please generate a professional, formal report that elaborates on the above information. Structure it with clear sections for:
1. Event Overview
2. Objectives and Agenda
3. Key Highlights and Summary
4. Decisions and Outcomes
5. Conclusion and Recommendations

Make it comprehensive, formal, and well-organized. Expand on the provided information naturally.`;

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at writing professional meeting minutes and event reports. You create well-structured, comprehensive, and formal documents.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });
        
        const reportText = response.choices[0].message.content;
        
        // Parse the report into sections for better LaTeX formatting
        const sections = parseReportSections(reportText);
        
        return {
            fullText: reportText,
            sections: sections
        };
        
    } catch (error) {
        console.error('Groq API Error:', error);
        
        // If API fails, provide a fallback structured report
        if (error.message.includes('API key') || error.code === 'invalid_api_key') {
            throw new Error('Invalid Groq API key. Please check your .env configuration.');
        }
        
        // Fallback report
        return createFallbackReport(data);
    }
}

/**
 * Parse AI-generated report into sections
 */
function parseReportSections(reportText) {
    const sections = [];
    const lines = reportText.split('\n');
    let currentSection = { title: '', content: '' };
    
    lines.forEach(line => {
        // Check if line is a section header (contains numbers or is all caps/bold)
        if (line.match(/^#+\s+/) || line.match(/^\d+\.\s+[A-Z]/)) {
            if (currentSection.title) {
                sections.push({ ...currentSection });
            }
            currentSection = {
                title: line.replace(/^#+\s+/, '').replace(/^\d+\.\s+/, '').trim(),
                content: ''
            };
        } else if (line.trim()) {
            currentSection.content += line + '\n';
        }
    });
    
    if (currentSection.title) {
        sections.push(currentSection);
    }
    
    return sections;
}

/**
 * Create a fallback report if AI service is unavailable
 */
function createFallbackReport(data) {
    const { eventTitle, eventType, eventDate, location, organizer, attendees, agenda, summary, decisions, notes } = data;
    
    const fallbackText = `
EVENT OVERVIEW

Title: ${eventTitle}
Type: ${eventType}
Date: ${eventDate}
Location: ${location}
Organizer: ${organizer}
Attendees: ${attendees}

AGENDA

${agenda}

SUMMARY

${summary}

DECISIONS

${decisions || 'No decisions recorded'}

ADDITIONAL NOTES

${notes || 'No additional notes'}
`;
    
    return {
        fullText: fallbackText,
        sections: [
            { title: 'Event Overview', content: `Title: ${eventTitle}\nType: ${eventType}\nDate: ${eventDate}\nLocation: ${location}\nOrganizer: ${organizer}\nAttendees: ${attendees}` },
            { title: 'Agenda', content: agenda },
            { title: 'Summary', content: summary },
            { title: 'Decisions', content: decisions || 'No decisions recorded' },
            { title: 'Notes', content: notes || 'No additional notes' }
        ]
    };
}

module.exports = {
    generateAIReport
};
