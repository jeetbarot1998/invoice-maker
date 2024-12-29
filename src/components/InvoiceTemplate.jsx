import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ invoiceData, items, calculateTotal }, ref) => {
  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto my-8" id="invoice-template">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Electronics & Accessories</h1>
        <p className="text-gray-600">VAT # 65553025</p>
        <p className="text-gray-600">Salmiya, Kuwait</p>
        <p className="text-gray-600">65553025</p>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <p className="font-bold mb-2">BILL TO:</p>
          <p>{invoiceData.billTo}</p>
        </div>
        <div>
          <p><strong>INVOICE #:</strong> {invoiceData.invoiceNumber}</p>
          <p><strong>DATE:</strong> {invoiceData.date}</p>
          <p><strong>DUE:</strong> On Receipt</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-left">DESCRIPTION</th>
            <th className="border p-2 text-right">RATE (KWD)</th>
            <th className="border p-2 text-right">QTY</th>
            <th className="border p-2 text-right">DISCOUNT (%)</th>
            <th className="border p-2 text-right">AMOUNT (KWD)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2 text-right">{parseFloat(item.rate).toFixed(3)}</td>
              <td className="border p-2 text-right">{item.quantity}</td>
              <td className="border p-2 text-right">{item.discount}</td>
              <td className="border p-2 text-right">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mb-8">
        <p className="text-xl font-bold">BALANCE DUE: KWD {calculateTotal()}</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
