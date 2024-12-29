import React from 'react';

const InvoiceTemplate = React.forwardRef(({ invoiceData, items, calculateTotal }, ref) => {
  return (
    // Wrapper div to center the fixed-size invoice
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      {/* Fixed-size invoice container - A4 dimensions in pixels (assuming 96 DPI) */}
      <div 
        ref={ref} 
        id="invoice-template" 
        className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-lg"
        style={{
          // Force A4 dimensions and ensure content doesn't overflow
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          margin: '0 auto',
          boxSizing: 'border-box',
          backgroundColor: 'white',
        }}
      >
        {/* Company Header - positioned relative to A4 size */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Electronics & Accessories</h1>
          <p className="text-gray-600">VAT # 65553025</p>
          <p className="text-gray-600">Salmiya, Kuwait</p>
          <p className="text-gray-600">65553025</p>
        </div>

        {/* Invoice Details Section */}
        <div className="flex justify-between mb-8">
          <div >
            <p className="font-bold mb-2">BILL TO:</p>
            <p className="text-base">{invoiceData.billTo}</p>
          </div>
          <div className="w-1/2 text-right">
            <p className="mb-1"><strong>INVOICE #:</strong> {invoiceData.invoiceNumber}</p>
            <p className="mb-1"><strong>DATE:</strong> {invoiceData.date}</p>
            <p><strong>DUE:</strong> On Receipt</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2 text-left w-2/5">DESCRIPTION</th>
                <th className="border p-2 text-right w-1/5">RATE (KWD)</th>
                <th className="border p-2 text-right w-1/5">QTY</th>
                <th className="border p-2 text-right w-1/5">DISCOUNT (%)</th>
                <th className="border p-2 text-right w-1/5">AMOUNT (KWD)</th>
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
              {/* Add empty rows to maintain consistent height */}
              {[...Array(Math.max(0, 10 - items.length))].map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td className="border p-2">&nbsp;</td>
                  <td className="border p-2">&nbsp;</td>
                  <td className="border p-2">&nbsp;</td>
                  <td className="border p-2">&nbsp;</td>
                  <td className="border p-2">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="text-right mb-8">
          <p className="text-xl font-bold">BALANCE DUE: KWD {calculateTotal()}</p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Thank you for your business</p>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;