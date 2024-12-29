import React from 'react';

const InvoiceTemplate = React.forwardRef(({ invoiceData, items, calculateTotal }, ref) => {
  return (
    // Updated wrapper with flex centering
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Fixed-size invoice container with explicit A4 dimensions */}
      <div 
        ref={ref} 
        id="invoice-template" 
        className="bg-white shadow-lg"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          margin: 'auto',
          boxSizing: 'border-box',
          position: 'relative', // Add this for absolute positioning context
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        {/* Company Header */}
        <div className="flex flex justify-between">

        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold">Electronics & Accessories</h1>
          <p className="text-gray-600">Abbas Kala</p>
          <p className="text-gray-600">VAT # 65553025</p>
          <p className="text-gray-600">Salmiya, Kuwait</p>
          <p className="text-gray-600">65553025</p>
        </div>

        {/* Invoice Details Section */}
        <div className="flex justify-between mb-8">
        <div className="text-right">
            <div className="mb-1">
              <p><strong>INVOICE #</strong></p>
              <p className="mt-1 text-lg">{invoiceData.invoiceNumber}</p>
            </div>
            <div className="mb-1">
              <p><strong>DATE</strong></p>
              <p className="mt-1 text-lg">{invoiceData.date}</p>
            </div>
            <div className="mb-1">
              <p><strong>DUE</strong></p>
              <p className="mt-1 text-lg">On Receipt</p>
            </div>
            <div className="mb-1">
              <p><strong>BALANCE DUE</strong></p>
              <p className="mt-1 text-lg">{calculateTotal()}</p>
            </div>
          </div>
        </div>
        </div>

        <div className="border-b-2 border-amber-800 my-4"></div>

        <div className="text-left">  
          <div className="mb-1">
            <p><strong>BILL TO</strong></p>
            <p className="mt-1 text-lg">{invoiceData.billTo}</p>
          </div>
        </div>
        
        <div className="border-b-2 border-amber-800 my-4"></div>


        {/* Items Table */}
        <div className="mb-8 flex-grow">
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
              {/* Empty rows to maintain consistent height */}
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
        <div className="text-center text-sm text-gray-500 mt-auto">
          <p>Thank you for your business</p>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;