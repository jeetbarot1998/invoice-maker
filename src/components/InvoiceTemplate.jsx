import React from 'react';

const InvoiceTemplate = React.forwardRef(({ invoiceData, items, calculateTotal }, ref) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div
        ref={ref}
        id="invoice-template"
        className="bg-white shadow-lg w-full max-w-4xl p-4 md:p-8 mx-auto"
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
          <div className="mb-4 md:mb-8 text-left">
            <h1 className="text-xl md:text-2xl font-bold">Electronics & Accessories</h1>
            <p className="text-gray-600">Abbas Kala</p>
            <p className="text-gray-600">Salmiya, Kuwait</p>
            <p className="text-gray-600">65553025</p>
          </div>

          <div className="mb-4 md:mb-8 md:text-right">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <div>
                <p className="font-bold">INVOICE #</p>
                <p className="text-base md:text-lg">{invoiceData.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-bold">DATE</p>
                <p className="text-base md:text-lg">{invoiceData.date}</p>
              </div>
              <div>
                <p className="font-bold">DUE</p>
                <p className="text-base md:text-lg">On Receipt</p>
              </div>
              <div>
                <p className="font-bold">BALANCE DUE</p>
                <p className="text-base md:text-lg">{calculateTotal()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b-2 border-amber-800 my-4"></div>

        <div className="mb-4">
          <p className="font-bold">BILL TO</p>
          <p className="text-base md:text-lg mt-1">{invoiceData.billTo}</p>
        </div>

        <div className="border-b-2 border-amber-800 my-4"></div>

        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse hidden md:table">
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
            </tbody>
          </table>

          <div className="md:hidden space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg bg-white">
                <p className="font-bold mb-2">{item.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Rate:</p>
                  <p className="text-right">{parseFloat(item.rate).toFixed(3)} KWD</p>
                  <p className="text-gray-600">Quantity:</p>
                  <p className="text-right">{item.quantity}</p>
                  <p className="text-gray-600">Discount:</p>
                  <p className="text-right">{item.discount}%</p>
                  <p className="text-gray-600 font-bold">Amount:</p>
                  <p className="text-right font-bold">{item.amount} KWD</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right mb-8">
          <p className="text-lg md:text-xl font-bold">BALANCE DUE: KWD {calculateTotal()}</p>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Thank you for your business</p>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;