const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generate professional LaTeX-style PDF from report content
 * @param {Object} data - Report data including content and photos
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generatePDF(data) {
    const { eventTitle, eventType, eventDate, location, reportContent, photos } = data;
    
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                margin: 72,  // 1 inch margins (LaTeX standard)
                size: 'A4',
                bufferPages: true,
                autoFirstPage: false
            });
            
            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            // Add first page
            doc.addPage();
            
            // Professional Title Page (LaTeX style)
            doc.moveDown(3);
            
            // Title - Large, bold, centered
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .fillColor('#1a1a1a')
               .text(eventTitle.toUpperCase(), { 
                   align: 'center',
                   lineGap: 8
               });
            
            // Decorative line under title
            doc.moveDown(0.5);
            const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
            const lineY = doc.y;
            doc.moveTo(doc.page.margins.left + pageWidth * 0.3, lineY)
               .lineTo(doc.page.margins.left + pageWidth * 0.7, lineY)
               .lineWidth(2)
               .stroke('#2563eb');
            
            doc.moveDown(1.5);
            
            // Subtitle
            doc.fontSize(16)
               .font('Helvetica')
               .fillColor('#4a4a4a')
               .text(`${eventType} Report`, { align: 'center' });
            
            doc.moveDown(3);
            
            // Metadata section (LaTeX style)
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .fillColor('#2a2a2a');
            
            const metaLeft = doc.page.margins.left + 100;
            
            doc.text('Date:', metaLeft, doc.y, { continued: false });
            doc.font('Helvetica')
               .fillColor('#4a4a4a')
               .text(eventDate, metaLeft + 80, doc.y - 11);
            
            doc.moveDown(0.8);
            doc.font('Helvetica-Bold')
               .fillColor('#2a2a2a')
               .text('Location:', metaLeft, doc.y);
            doc.font('Helvetica')
               .fillColor('#4a4a4a')
               .text(location, metaLeft + 80, doc.y - 11);
            
            doc.moveDown(0.8);
            doc.font('Helvetica-Bold')
               .fillColor('#2a2a2a')
               .text('Document ID:', metaLeft, doc.y);
            doc.font('Helvetica')
               .fillColor('#4a4a4a')
               .text(`RPT-${Date.now().toString().slice(-8)}`, metaLeft + 80, doc.y - 11);
            
            doc.moveDown(0.8);
            doc.font('Helvetica-Bold')
               .fillColor('#2a2a2a')
               .text('Generated:', metaLeft, doc.y);
            doc.font('Helvetica')
               .fillColor('#4a4a4a')
               .text(new Date().toLocaleDateString('en-US', { 
                   year: 'numeric', 
                   month: 'long', 
                   day: 'numeric' 
               }), metaLeft + 80, doc.y - 11);
            
            // Add new page for content
            doc.addPage();
            doc.moveDown(1);
            
            // Content sections (LaTeX-style formatting)
            if (reportContent.sections && reportContent.sections.length > 0) {
                reportContent.sections.forEach((section, index) => {
                    // Check if we need a new page
                    if (doc.y > doc.page.height - doc.page.margins.bottom - 100) {
                        doc.addPage();
                    }
                    
                    if (section.title) {
                        // Section heading (LaTeX \section style)
                        doc.fontSize(14)
                           .font('Helvetica-Bold')
                           .fillColor('#1a1a1a')
                           .text(`${index + 1}. ${section.title.toUpperCase()}`, {
                               lineGap: 4
                           });
                        
                        // Underline for section
                        const titleY = doc.y;
                        doc.moveTo(doc.page.margins.left, titleY + 2)
                           .lineTo(doc.page.margins.left + 200, titleY + 2)
                           .lineWidth(1.5)
                           .stroke('#2563eb');
                        
                        doc.moveDown(0.8);
                    }
                    
                    if (section.content) {
                        // Body text (LaTeX article style)
                        doc.fontSize(11)
                           .font('Helvetica')
                           .fillColor('#2a2a2a')
                           .text(section.content, {
                               align: 'justify',
                               lineGap: 3,
                               paragraphGap: 8
                           });
                        doc.moveDown(1.2);
                    }
                });
            } else {
                doc.fontSize(11)
                   .font('Helvetica')
                   .fillColor('#2a2a2a')
                   .text(reportContent.fullText || reportContent, {
                       align: 'justify',
                       lineGap: 3
                   });
            }
            
            // Add photos if available (LaTeX figure style)
            if (photos && photos.length > 0) {
                doc.addPage();
                
                // Section heading for photos
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .fillColor('#1a1a1a')
                   .text('APPENDIX: PHOTO DOCUMENTATION');
                
                const titleY = doc.y;
                doc.moveTo(doc.page.margins.left, titleY + 2)
                   .lineTo(doc.page.margins.left + 250, titleY + 2)
                   .lineWidth(1.5)
                   .stroke('#2563eb');
                
                doc.moveDown(1.5);
                
                photos.forEach((photoPath, index) => {
                    if (fs.existsSync(photoPath)) {
                        try {
                            // Check if we need a new page
                            if (doc.y > doc.page.height - 400) {
                                doc.addPage();
                            }
                            
                            // Figure caption (LaTeX style)
                            doc.fontSize(10)
                               .font('Helvetica-Bold')
                               .fillColor('#2a2a2a')
                               .text(`Figure ${index + 1}:`, { continued: true })
                               .font('Helvetica')
                               .text(` Event photograph ${index + 1}`);
                            
                            doc.moveDown(0.5);
                            
                            // Image with border (LaTeX figure style)
                            const imgX = doc.page.margins.left;
                            const imgY = doc.y;
                            const maxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
                            
                            doc.image(photoPath, imgX, imgY, {
                                fit: [maxWidth, 300],
                                align: 'center'
                            });
                            
                            doc.moveDown(2);
                        } catch (err) {
                            console.error('Error adding image:', err);
                        }
                    }
                });
            }
            
            // Add page numbers (LaTeX style)
            const pages = doc.bufferedPageRange();
            for (let i = 0; i < pages.count; i++) {
                doc.switchToPage(i);
                
                // Footer line
                const footerY = doc.page.height - doc.page.margins.bottom + 20;
                doc.moveTo(doc.page.margins.left, footerY)
                   .lineTo(doc.page.width - doc.page.margins.right, footerY)
                   .lineWidth(0.5)
                   .stroke('#cccccc');
                
                // Page number
                doc.fontSize(9)
                   .font('Helvetica')
                   .fillColor('#666666')
                   .text(
                       `Page ${i + 1} of ${pages.count}`,
                       doc.page.margins.left,
                       doc.page.height - doc.page.margins.bottom + 30,
                       { align: 'center' }
                   );
                
                // Footer text
                doc.fontSize(8)
                   .fillColor('#999999')
                   .text(
                       `Generated by BMAD™ Core • ${new Date().toLocaleDateString()}`,
                       doc.page.margins.left,
                       doc.page.height - doc.page.margins.bottom + 45,
                       { align: 'center' }
                   );
            }
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generatePDF
};
