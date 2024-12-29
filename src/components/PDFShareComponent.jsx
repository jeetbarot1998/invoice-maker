import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Share2 } from 'lucide-react';

const PDFShareComponent = () => {
  const [status, setStatus] = useState('');

  const generatePDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add content to PDF (customize this part as needed)
      doc.text("Sample Invoice", 20, 20);
      doc.text("Amount: $100", 20, 30);
      doc.text("Date: " + new Date().toLocaleDateString(), 20, 40);
      
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const downloadPDF = async () => {
    try {
      const pdf = generatePDF();
      pdf.save('document.pdf');
      setStatus('PDF downloaded successfully!');
    } catch (error) {
      setStatus('Error downloading PDF');
    }
  };

  const sharePDF = async () => {
    try {
      const pdf = generatePDF();
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], 'document.pdf', { type: 'application/pdf' });

      // Check if the Web Share API is supported
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Share PDF',
          text: 'Here is your PDF document'
        });
        setStatus('Sharing initiated!');
      } else {
        // Fallback for desktop or unsupported browsers
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setStatus('PDF opened in new tab. You can now save and share it manually.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus('Sharing cancelled');
      } else {
        setStatus('Error sharing PDF');
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Download size={20} />
            Download PDF
          </button>
          
          <button
            onClick={sharePDF}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            <Share2 size={20} />
            Share PDF
          </button>
        </div>

        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-center">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFShareComponent;