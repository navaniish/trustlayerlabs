import React from 'react';
import { DocumentItem } from '../types';
import { formatCurrency } from '../utils/pricingEngine';

interface LineItemsTableProps {
  items: DocumentItem[];
  currency: string;
  type?: 'quotation' | 'invoice';
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  items,
  currency,
  type = 'quotation',
}) => {
  const isQuotation = type === 'quotation';
  const fmt = (val: number) => formatCurrency(val, currency);

  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider flex justify-between items-center">
        <span>{isQuotation ? 'SCOPE OF WORK / SERVICES' : 'ITEMS / SERVICES'}</span>
        <span className="text-[8.5px] font-normal text-slate-300">
          CURRENCY: <strong className="text-white">{currency}</strong>
        </span>
      </div>

      <table className="w-full text-left border-collapse text-[9.5px]">
        <thead>
          <tr className="bg-slate-100 text-slate-900 font-extrabold uppercase border-b-2 border-slate-900">
            <th className="py-2 px-2 text-center w-8 border-r border-slate-300">#</th>
            {isQuotation ? (
              <>
                <th className="py-2 px-3 border-r border-slate-300 w-40">SERVICE / SOLUTION</th>
                <th className="py-2 px-3 border-r border-slate-300">DESCRIPTION</th>
                <th className="py-2 px-3 border-r border-slate-300 w-36">DELIVERABLES</th>
                <th className="py-2 px-2 text-center w-12 border-r border-slate-300">QTY</th>
                <th className="py-2 px-3 text-right w-24 border-r border-slate-300">UNIT PRICE</th>
                <th className="py-2 px-3 text-right w-24">TOTAL</th>
              </>
            ) : (
              <>
                <th className="py-2 px-3 border-r border-slate-300">DESCRIPTION</th>
                <th className="py-2 px-2 text-center w-12 border-r border-slate-300">QTY</th>
                <th className="py-2 px-3 text-right w-24 border-r border-slate-300">UNIT PRICE</th>
                <th className="py-2 px-2 text-center w-14 border-r border-slate-300">TAX</th>
                <th className="py-2 px-3 text-right w-28">AMOUNT</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((item, idx) => {
            const lineSubtotal = item.unitPrice * item.quantity;
            const lineTax = lineSubtotal * ((item.taxPercent || 0) / 100);
            const lineAmount = lineSubtotal + lineTax;

            return (
              <tr
                key={item.id || idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
              >
                <td className="py-2.5 px-2 text-center font-bold text-slate-500 border-r border-slate-200">
                  {String(idx + 1).padStart(2, '0')}
                </td>

                {isQuotation ? (
                  <>
                    <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 leading-snug border-r border-slate-200">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3 text-[8.5px] text-slate-600 border-r border-slate-200">
                      {item.deliverables || 'As per scope documentation'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800 border-r border-slate-200">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-800 border-r border-slate-200">
                      {fmt(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                      {fmt(lineSubtotal)}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[8.5px] text-slate-600 leading-tight mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800 border-r border-slate-200">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-800 border-r border-slate-200">
                      {fmt(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium border-r border-slate-200">
                      {item.taxPercent || 18}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                      {fmt(lineAmount)}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
