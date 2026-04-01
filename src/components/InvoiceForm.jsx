import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';
import { Download, Share2 } from 'lucide-react';

const InvoiceForm = () => {
  const [showInvoice, setShowInvoice] = useState(false);

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
    cash: '', // ✅ already present
    amount: 0
  }]);

  const invoiceRef = useRef(null);

  const calculateAmount = (rate, quantity, discount) => {
    const numRate = parseFloat(rate) || 0;
    const numQuantity = parseFloat(quantity) || 0;
    const numDiscount = parseFloat(discount) || 0;
    return (numRate * numQuantity * (1 - numDiscount / 100)).toFixed(3);
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
        cash: '', // ✅ already present
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
    const invoiceElement = document.getElementById('invoice-template');
    const canvas = await html2canvas(invoiceElement, { scale: 2 });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    return pdf;
  };

  const downloadPDF = async () => {
    const pdf = await generatePDF();
    pdf.save(`Invoice_${invoiceData.invoiceNumber || 'draft'}.pdf`);
  };

  const sharePDF = async () => {
    const pdf = await generatePDF();
    const blob = pdf.output('blob');

    const file = new File([blob], 'invoice.pdf', { type: 'application/pdf' });

    if (navigator.share) {
      await navigator.share({ files: [file] });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!showInvoice ? (
        <div className="bg-white shadow rounded-lg p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input name="invoiceNumber" placeholder="Invoice Number" className="p-2 border rounded"
              value={invoiceData.invoiceNumber} onChange={handleInputChange} />
            <input type="date" name="date" className="p-2 border rounded"
              value={invoiceData.date} onChange={handleInputChange} />
            <input name="billTo" placeholder="Bill To" className="p-2 border rounded"
              value={invoiceData.billTo} onChange={handleInputChange} />
          </div>

          <table className="w-full border">
            <thead>
              <tr>
                <th>Description</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Discount</th>
                <th>Cash</th> {/* ✅ */}
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                  </td>

                  <td>
                    <input type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)} />
                  </td>

                  <td>
                    <input type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
                  </td>

                  <td>
                    <input type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(index, 'discount', e.target.value)} />
                  </td>

                  <td>
                    <input type="number"
                      value={item.cash}
                      onChange={(e) => handleItemChange(index, 'cash', e.target.value)} />
                  </td>

                  <td>{item.amount}</td>

                  <td>
                    <button onClick={() => removeItem(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={addItem}>Add Item</button>

          <p>Total: KWD {calculateTotal()}</p>

          <button onClick={() => setShowInvoice(true)}>
            Generate Invoice
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => setShowInvoice(false)}>Edit</button>
          <button onClick={downloadPDF}><Download /> Download</button>
          <button onClick={sharePDF}><Share2 /> Share</button>

          <InvoiceTemplate
            ref={invoiceRef}
            invoiceData={invoiceData}
            items={items}
            calculateTotal={calculateTotal}
          />
        </>
      )}
    </div>
  );
};

export default InvoiceForm;
