import React, { useState } from 'react';

const InvoiceGenerator = () => {
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

  const calculateAmount = (rate, quantity, discount) => {
    const numRate = parseFloat(rate) || 0;
    const numQuantity = parseFloat(quantity) || 0;
    const numDiscount = parseFloat(discount) || 0;
    return (numRate * numQuantity * (1 - numDiscount/100)).toFixed(3);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'rate' || field === 'quantity' || field === 'discount') {
      newItems[index].amount = calculateAmount(
        field === 'rate' ? value : items[index].rate,
        field === 'quantity' ? value : items[index].quantity,
        field === 'discount' ? value : items[index].discount
      );
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      id: items.length + 1,
      description: '',
      rate: '',
      quantity: '',
      discount: '0',
      amount: 0
    }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(3);
  };

  const generateInvoiceText = () => {
    let text = `*INVOICE*\n`;
    text += `Invoice #: ${invoiceData.invoiceNumber}\n`;
    text += `Date: ${invoiceData.date}\n`;
    text += `Bill To: ${invoiceData.billTo}\n\n`;
    text += `*Items:*\n`;

    items.forEach(item => {
      if (item.description) {
        text += `${item.description}\n`;
        text += `Rate: KWD ${item.rate} x Qty: ${item.quantity}\n`;
        if (parseFloat(item.discount) > 0) {
          text += `Discount: ${item.discount}%\n`;
        }
        text += `Amount: KWD ${item.amount}\n\n`;
      }
    });

    text += `*Total Amount: KWD ${calculateTotal()}*`;
    return text;
  };

  const sendToWhatsApp = () => {
    const number = invoiceData.whatsappNumber.replace(/\D/g, '');
    if (!number) {
      setStatus({ message: 'Please enter a valid WhatsApp number', type: 'error' });
      return;
    }

    const text = generateInvoiceText();
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setStatus({ message: 'WhatsApp opened with invoice details', type: 'success' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Electronics & Accessories Invoice</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Invoice Number"
            className="p-2 border rounded"
            value={invoiceData.invoiceNumber}
            onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={invoiceData.date}
            onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
          />
          <input
            type="text"
            placeholder="Bill To"
            className="p-2 border rounded"
            value={invoiceData.billTo}
            onChange={(e) => setInvoiceData({...invoiceData, billTo: e.target.value})}
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

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          onClick={addItem}
        >
          Add Item
        </button>

        <div className="text-right text-xl font-bold mb-6">
          Total: KWD {calculateTotal()}
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="WhatsApp Number (with country code)"
              className="p-2 border rounded"
              value={invoiceData.whatsappNumber}
              onChange={(e) => setInvoiceData({...invoiceData, whatsappNumber: e.target.value})}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={sendToWhatsApp}
            >
              Send via WhatsApp
            </button>
          </div>
        </div>

        {status.message && (
          <div className={`mt-4 p-4 rounded ${
            status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerator;