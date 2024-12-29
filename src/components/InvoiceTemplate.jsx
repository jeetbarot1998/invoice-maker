import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ invoiceData, items, calculateTotal }, ref) => {
  return (
    <div ref={ref} className="bg-white p-4 sm:p-8 max-w-4xl mx-auto rounded-lg shadow" id="invoice-template">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Electronics & Accessories</h1>
        <p className="text-gray-600">VAT # 65553025</p>
        <p className="text-gray-600">Salmiya, Kuwait</p>
        <p className="text-gray-600">65553025</p>
      </div>

      {/* Invoice Details */}
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
        <div className="flex-1">
          <p className="font-bold mb-2">BILL TO:</p>
          <p className="text-gray-800">{invoiceData.billTo || 'N/A'}</p>
        </div>
        <div className="flex-1 sm:text-right space-y-1">
          <p><span className="font-semibold">INVOICE #:</span> {invoiceData.invoiceNumber || 'N/A'}</p>
          <p><span className="font-semibold">DATE:</span> {invoiceData.date || 'N/A'}</p>
          <p><span className="font-semibold">DUE:</span> On Receipt</p>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="overflow-x-auto mb-8 -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
            {/* Desktop Table */}
            <table className="hidden sm:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Rate (KWD)
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Disc%
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount (KWD)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-normal">
                      {item.description || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {parseFloat(item.rate || 0).toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.quantity || '0'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.discount || '0'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.amount || '0.000'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Table Alternative */}
            <div className="sm:hidden divide-y divide-gray-200">
              {items.map((item, index) => (
                <div key={item.id} className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="mb-2">
                    <p className="font-medium text-gray-900">{item.description || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Rate (KWD)</p>
                      <p className="font-medium">{parseFloat(item.rate || 0).toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-medium">{item.quantity || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Discount</p>
                      <p className="font-medium">{item.discount || '0'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount (KWD)</p>
                      <p className="font-medium">{item.amount || '0.000'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex flex-col items-end gap-2 sm:gap-4 mb-8">
        <div className="w-full sm:w-72 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
            <span>Total:</span>
            <span>KWD {calculateTotal()}</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;