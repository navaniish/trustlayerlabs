import React from 'react';
import { PricingSummary } from '../types';
import { formatCurrency } from '../utils/pricingEngine';

interface FinancialSummaryProps {
  financials: PricingSummary;
  currency: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  financials,
  currency,
}) => {
  const fmt = (val: number) => formatCurrency(val, currency);
  const totalTax = financials.cgst + financials.sgst + financials.igst;

  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider">
        FINANCIAL SUMMARY
      </div>

      <div className="p-3 bg-white space-y-1.5 text-[9.5px]">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-700 font-semibold border-b border-slate-100 pb-1">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">{fmt(financials.subtotal)}</span>
        </div>

        {/* Discount */}
        {financials.globalDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-semibold border-b border-slate-100 pb-1">
            <span>Discount</span>
            <span>- {fmt(financials.globalDiscount)}</span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between items-center text-slate-700 font-semibold border-b border-slate-100 pb-1">
          <span>Tax</span>
          <span className="font-bold text-slate-900">{fmt(totalTax)}</span>
        </div>

        {/* Additional Charges */}
        {financials.additionalCharges !== undefined && financials.additionalCharges > 0 && (
          <div className="flex justify-between items-center text-slate-700 font-semibold border-b border-slate-100 pb-1">
            <span>Additional Charges</span>
            <span className="font-bold text-slate-900">{fmt(financials.additionalCharges)}</span>
          </div>
        )}

        {/* Round Off */}
        {financials.roundOff !== 0 && (
          <div className="flex justify-between items-center text-slate-500 text-[8.5px] border-b border-slate-100 pb-1">
            <span>Round Off</span>
            <span>{financials.roundOff > 0 ? `+${fmt(financials.roundOff)}` : fmt(financials.roundOff)}</span>
          </div>
        )}

        {/* TOTAL Box */}
        <div className="bg-slate-900 text-white p-2.5 rounded-sm flex justify-between items-center mt-2 shadow-xs border border-slate-950">
          <span className="font-black text-[11px] uppercase tracking-wider">
            TOTAL ({currency})
          </span>
          <span className="font-black text-lg text-white font-sans">
            {fmt(financials.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
