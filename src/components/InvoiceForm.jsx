import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Download, Share2 } from 'lucide-react';

const InvoiceForm = () => {
  const [showInvoice, setShowInvoice] = useState(true);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    billTo: '',
    whatsappNumber: ''
  });

  const [items, setItems] = useState([{
    id: 1,
    description: '',
    rate: '',
    quantity: '',
    discount: '0',
    amount: 0
  }]);

  const [status, setStatus] = useState({ message: '', type: '' });
  const invoiceRef = useRef(null);

  const calculateAmount = (rate, quantity, discount) => {
    const numRate = parseFloat(rate) || 0;
    const numQuantity = parseFloat(quantity) || 0;
    const numDiscount = parseFloat(discount) || 0;
    return (numRate * numQuantity * (1 - numDiscount/100)).toFixed(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prevItems => {
      const newItems = prevItems.map((item, i) => {
        if (i !== index) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'rate' || field === 'quantity' || field === 'discount') {
          updatedItem.amount = calculateAmount(
            field === 'rate' ? value : item.rate,
            field === 'quantity' ? value : item.quantity,
            field === 'discount' ? value : item.discount
          );
        }
        
        return updatedItem;
      });
      return newItems;
    });
  };

  const addItem = () => {
    setItems(prevItems => [
      ...prevItems,
      {
        id: prevItems.length + 1,
        description: '',
        rate: '',
        quantity: '',
        discount: '0',
        amount: 0
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prevItems => prevItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(3);
  };

  const generatePDF = async () => {
    try {
      const invoiceElement = document.getElementById('invoice-template');
      
      if (!invoiceElement) {
        throw new Error('Invoice template element not found');
      }
  
      // A4 dimensions in mm
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
  
      // Convert mm to pixels (assuming 96 DPI)
      const MM_TO_PX = 3.7795275591;  // 1mm = 3.7795275591 pixels
      
      const canvasOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: A4_WIDTH_MM * MM_TO_PX,
        height: A4_HEIGHT_MM * MM_TO_PX,
        windowWidth: A4_WIDTH_MM * MM_TO_PX,
        windowHeight: A4_HEIGHT_MM * MM_TO_PX,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('invoice-template');
          if (clonedElement) {
            // Ensure the cloned element maintains A4 dimensions
            clonedElement.style.width = `${A4_WIDTH_MM}mm`;
            clonedElement.style.height = `${A4_HEIGHT_MM}mm`;
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '20mm'; // Consistent padding
          }
        }
      };
  
      // Generate canvas
      const canvas = await html2canvas(invoiceElement, canvasOptions);
  
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
  
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);
  
      // Add image to PDF with exact A4 dimensions
      pdf.addImage(
        imgData,
        'PNG',
        8,
        0,
        A4_WIDTH_MM,
        A4_HEIGHT_MM,
        undefined,
        'FAST'
      );
  
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };
  
  // Download function
  const downloadPDF = async () => {
    try {
      setStatus({ message: 'Generating PDF...', type: 'info' });
      const pdf = await generatePDF();
      pdf.save(`Invoice_${invoiceData.invoiceNumber || 'draft'}.pdf`);
      setStatus({ message: 'PDF downloaded successfully!', type: 'success' });
    } catch (error) {
      setStatus({ message: 'Error downloading PDF: ' + error.message, type: 'error' });
      console.error('Download error:', error);
    }
  };
  
  // Share function
  const sharePDF = async () => {
    try {
      setStatus({ message: 'Preparing PDF for sharing...', type: 'info' });
      const pdf = await generatePDF();
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Invoice_${invoiceData.invoiceNumber || 'draft'}.pdf`, {
        type: 'application/pdf'
      });
  
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice #${invoiceData.invoiceNumber}`,
          text: `Invoice for ${invoiceData.billTo}\nTotal Amount: KWD ${calculateTotal()}`
        });
        setStatus({ message: 'Sharing initiated!', type: 'success' });
      } else {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setStatus({
          message: 'PDF opened in new tab. You can now save and share it manually.',
          type: 'info'
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus({ message: 'Sharing cancelled', type: 'info' });
      } else {
        setStatus({ message: 'Error sharing PDF: ' + error.message, type: 'error' });
        console.error('Sharing error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!showInvoice ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Invoice Number"
              name="invoiceNumber"
              className="p-2 border rounded"
              value={invoiceData.invoiceNumber}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date"
              className="p-2 border rounded"
              value={invoiceData.date}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Bill To"
              name="billTo"
              className="p-2 border rounded"
              value={invoiceData.billTo}
              onChange={handleInputChange}
            />
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2">Rate (KWD)</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Discount (%)</th>
                  <th className="border p-2">Amount (KWD)</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-1"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 text-right"
                        step="0.001"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 text-right"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 text-right"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                      />
                    </td>
                    <td className="border p-2 text-right">
                      {item.amount}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={addItem}
            >
              Add Item
            </button>

            <div className="text-right">
              <p className="text-lg font-bold mb-2">
                Total Amount: KWD {calculateTotal()}
              </p>
              <button
                className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                onClick={() => setShowInvoice(true)}
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-end space-x-4 no-print">
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              onClick={() => setShowInvoice(false)}
            >
              Edit Invoice
            </button>
            
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              <Download size={20} />
              Download PDF
            </button>
            
            <button
              onClick={sharePDF}
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              <Share2 size={20} />
              Share PDF
            </button>
          </div>
          
          <InvoiceTemplate
            ref={invoiceRef}
            invoiceData={invoiceData}
            items={items}
            calculateTotal={calculateTotal}
          />
          
          {status.message && (
            <div className={`mt-4 p-4 rounded ${
              status.type === 'error' ? 'bg-red-100 text-red-700' : 
              status.type === 'success' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {status.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
