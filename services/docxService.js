const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ImageRun, Table, TableRow, TableCell, WidthType } = require('docx');
const fs = require('fs');

/**
 * Generate professional Word document from report content
 * @param {Object} data - Report data including content and photos
 * @returns {Promise<Buffer>} - DOCX buffer
 */
async function generateDOCX(data) {
    const { eventTitle, eventType, eventDate, location, organizer, reportContent, photos } = data;
    
    try {
        const children = [];
        
        // Title Page
        children.push(
            new Paragraph({
                text: eventTitle.toUpperCase(),
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { before: 1440, after: 480 }, // 2 inches before, 0.67 inches after
            }),
            new Paragraph({
                text: `${eventType} Report`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 960 }, // 1.33 inches
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Date: ",
                        bold: true,
                    }),
                    new TextRun({
                        text: eventDate,
                    }),
                ],
                spacing: { after: 120 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Location: ",
                        bold: true,
                    }),
                    new TextRun({
                        text: location,
                    }),
                ],
                spacing: { after: 120 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Organizer: ",
                        bold: true,
                    }),
                    new TextRun({
                        text: organizer || 'N/A',
                    }),
                ],
                spacing: { after: 120 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Document ID: ",
                        bold: true,
                    }),
                    new TextRun({
                        text: `RPT-${Date.now().toString().slice(-8)}`,
                    }),
                ],
                spacing: { after: 120 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Generated: ",
                        bold: true,
                    }),
                    new TextRun({
                        text: new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }),
                    }),
                ],
                spacing: { after: 960 },
                pageBreakBefore: false,
            })
        );
        
        // Add page break before content
        children.push(
            new Paragraph({
                text: "",
                pageBreakBefore: true,
            })
        );
        
        // Content sections
        if (reportContent.sections && reportContent.sections.length > 0) {
            reportContent.sections.forEach((section, index) => {
                if (section.title) {
                    children.push(
                        new Paragraph({
                            text: `${index + 1}. ${section.title.toUpperCase()}`,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 240, after: 120 },
                            border: {
                                bottom: {
                                    color: "2563EB",
                                    space: 1,
                                    style: BorderStyle.SINGLE,
                                    size: 12,
                                },
                            },
                        })
                    );
                }
                
                if (section.content) {
                    // Split content into paragraphs
                    const paragraphs = section.content.split('\n\n');
                    paragraphs.forEach(para => {
                        if (para.trim()) {
                            children.push(
                                new Paragraph({
                                    text: para.trim(),
                                    spacing: { after: 200, line: 276 }, // 1.15 line spacing
                                    alignment: AlignmentType.JUSTIFIED,
                                })
                            );
                        }
                    });
                    
                    children.push(
                        new Paragraph({
                            text: "",
                            spacing: { after: 240 },
                        })
                    );
                }
            });
        } else {
            const fullText = reportContent.fullText || reportContent;
            const paragraphs = fullText.split('\n\n');
            paragraphs.forEach(para => {
                if (para.trim()) {
                    children.push(
                        new Paragraph({
                            text: para.trim(),
                            spacing: { after: 200, line: 276 },
                            alignment: AlignmentType.JUSTIFIED,
                        })
                    );
                }
            });
        }
        
        // Add photos if available
        if (photos && photos.length > 0) {
            children.push(
                new Paragraph({
                    text: "",
                    pageBreakBefore: true,
                }),
                new Paragraph({
                    text: "APPENDIX: PHOTO DOCUMENTATION",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 240, after: 240 },
                    border: {
                        bottom: {
                            color: "2563EB",
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 12,
                        },
                    },
                })
            );
            
            for (let i = 0; i < photos.length; i++) {
                const photoPath = photos[i];
                if (fs.existsSync(photoPath)) {
                    try {
                        const imageBuffer = fs.readFileSync(photoPath);
                        
                        children.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Figure ${i + 1}: `,
                                        bold: true,
                                    }),
                                    new TextRun({
                                        text: `Event photograph ${i + 1}`,
                                    }),
                                ],
                                spacing: { before: 240, after: 120 },
                            }),
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: imageBuffer,
                                        transformation: {
                                            width: 500,
                                            height: 375,
                                        },
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 480 },
                            })
                        );
                    } catch (err) {
                        console.error('Error adding image to DOCX:', err);
                        children.push(
                            new Paragraph({
                                text: `[Image ${i + 1} could not be loaded]`,
                                italics: true,
                                spacing: { after: 240 },
                            })
                        );
                    }
                }
            }
        }
        
        // Footer
        children.push(
            new Paragraph({
                text: "",
                pageBreakBefore: false,
            }),
            new Paragraph({
                text: `Generated by BMAD™ Core • ${new Date().toLocaleDateString()}`,
                alignment: AlignmentType.CENTER,
                spacing: { before: 480 },
                style: {
                    run: {
                        size: 16, // 8pt
                        color: "999999",
                    },
                },
            })
        );
        
        // Create document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440,    // 1 inch
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children: children,
            }],
        });
        
        // Generate buffer using Packer
        const Packer = require('docx').Packer;
        const buffer = await Packer.toBuffer(doc);
        return buffer;
        
    } catch (error) {
        console.error('Error generating DOCX:', error);
        throw new Error('Failed to generate Word document');
    }
}

module.exports = { generateDOCX };
