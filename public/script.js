// Set default date to today
document.getElementById('eventDate').valueAsDate = new Date();

// Track which button was clicked
let currentFormat = 'pdf';

// Attach event listeners to both buttons
document.getElementById('pdfBtn').addEventListener('click', (e) => {
    e.preventDefault();
    currentFormat = 'pdf';
    submitForm('pdf');
});

document.getElementById('docxBtn').addEventListener('click', (e) => {
    e.preventDefault();
    currentFormat = 'docx';
    submitForm('docx');
});

async function submitForm(format) {
    const form = document.getElementById('reportForm');
    const pdfBtn = document.getElementById('pdfBtn');
    const docxBtn = document.getElementById('docxBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Disable both buttons
    pdfBtn.disabled = true;
    docxBtn.disabled = true;
    
    const originalPdfText = pdfBtn.innerHTML;
    const originalDocxText = docxBtn.innerHTML;
    
    if (format === 'pdf') {
        pdfBtn.innerHTML = '<span>⏳</span> Generating PDF...';
    } else {
        docxBtn.innerHTML = '<span>⏳</span> Generating DOC...';
    }
    
    statusMessage.style.display = 'none';
    
    try {
        const formData = new FormData(form);
        formData.append('format', format);
        
        showStatus('info', `Generating ${format.toUpperCase()} report...`);
        
        const response = await fetch('/api/generate-report', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate report');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showStatus('success', `${format.toUpperCase()} report downloaded successfully!`);
        
        setTimeout(() => {
            form.reset();
            document.getElementById('eventDate').valueAsDate = new Date();
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showStatus('error', 'Error: ' + error.message);
    } finally {
        pdfBtn.disabled = false;
        docxBtn.disabled = false;
        pdfBtn.innerHTML = originalPdfText;
        docxBtn.innerHTML = originalDocxText;
    }
}

function showStatus(type, message) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.className = type;
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
}
