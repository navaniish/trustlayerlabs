import React, { useState } from 'react';
import { CreditCard, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, invoiceId }) => {
  const { invoices, recordPayment } = useApp();
  const invoice = invoices.find((i) => i.id === invoiceId);

  const [amount, setAmount] = useState<number>(invoice ? invoice.amountDue : 0);
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [transactionId, setTransactionId] = useState<string>(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    recordPayment({
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      clientName: invoice.client.companyName,
      paymentDate: new Date().toISOString().split('T')[0],
      amount,
      method,
      transactionId,
      reference,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-y-auto shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit">Record Invoice Payment</h3>
              <p className="text-[11px] text-slate-500">Log incoming client settlement details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <div>
              <div className="text-[10px] font-mono text-slate-500 font-bold">Invoice #{invoice.number}</div>
              <div className="font-extrabold text-slate-900">{invoice.client.companyName}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold">Amount Due</div>
              <div className="font-extrabold text-amber-600 text-sm font-outfit">₹{invoice.amountDue.toLocaleString()}</div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={invoice.amountDue}
              min={1}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-extrabold text-sm focus:bg-white focus:border-trustBlue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:border-trustBlue-600 outline-none"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI Payment</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Online Payment">Online Payment Gateway</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 font-mono">Transaction / Reference ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. HDFC981273910"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Additional Settlement Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received via NEFT Branch Transfer"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
