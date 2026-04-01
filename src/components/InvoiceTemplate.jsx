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
            <h1 className="text-xl md:text-2xl font-bold">Saree & Clothing</h1>
            <p className="text-gray-600">Mohammadi Saree House</p>
            <p className="text-gray-600">Kuwait</p>
            <p className="text-gray-600">55127786</p>
          </div>

          <div className="mb-4 md:mb-8 md:text-right">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <div>
                <p className="font-bold">INVOICE #</p>
                <p>{invoiceData.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-bold">DATE</p>
                <p>{invoiceData.date}</p>
              </div>
              <div>
                <p className="font-bold">DUE</p>
                <p>On Receipt</p>
              </div>
              <div>
                <p className="font-bold">BALANCE DUE</p>
                <p>{calculateTotal()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b-2 my-4"></div>

        <div className="mb-4">
          <p className="font-bold">BILL TO</p>
          <p>{invoiceData.billTo}</p>
        </div>

        <div className="border-b-2 my-4"></div>

        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse hidden md:table">
            <thead>
              <tr>
                <th className="border p-2 text-left">DESCRIPTION</th>
                <th className="border p-2 text-right">RATE</th>
                <th className="border p-2 text-right">QTY</th>
                <th className="border p-2 text-right">DISCOUNT</th>
                <th className="border p-2 text-right">CASH</th> {/* ✅ */}
                <th className="border p-2 text-right">AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-right">{item.rate}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">{item.discount}</td>
                  <td className="border p-2 text-right">{item.cash}</td> {/* ✅ */}
                  <td className="border p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="md:hidden space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <p className="font-bold">{item.description}</p>

                <p>Rate: {item.rate}</p>
                <p>Qty: {item.quantity}</p>
                <p>Discount: {item.discount}%</p>
                <p>Cash: {item.cash} KWD</p> {/* ✅ */}
                <p>Amount: {item.amount} KWD</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold">BALANCE DUE: KWD {calculateTotal()}</p>
        </div>

      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;
