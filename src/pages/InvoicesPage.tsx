import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Mail,
  Download,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Trash2,
  FileText,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/pricingEngine';
import { PaymentModal } from '../components/PaymentModal';
import { dbService, STORES } from '../services/db';

export const InvoicesPage: React.FC = () => {
  const { invoices, addInvoice, openEmailModal, clients, services, setActiveTab, businessProfile } = useApp();
  const [search, setSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activePaymentInvoiceId, setActivePaymentInvoiceId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);


  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.companyName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateNewInvoice = () => {
    const fallbackCli = {
      id: 'cli-default',
      companyName: 'Default Client',
      contactPerson: 'Contact Person',
      email: 'billing@client.com',
      phone: '+91 98000 00000',
      billingAddress: {
        line1: 'Corporate Park',
        city: 'Hyderabad',
        state: 'Telangana',
        pin: '500081',
        country: 'India',
      },
      gstin: '',
      outstandingBalance: 0,
      status: 'Active' as const,
    };
    const cli = clients[0] || fallbackCli;
    const fallbackSrv = services[0] || {
      id: 'srv-001',
      name: 'VAPT (Web & API)',
      description: 'Web application and REST API penetration testing',
      unit: 'Project',
      unitPrice: 75000,
      taxPercent: 18,
      deliverables: 'Executive Findings Report',
    };
    const srv = fallbackSrv;
    const newInv = addInvoice({
      number: '',
      clientId: cli.id,
      client: cli,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      currency: 'INR',
      currencySymbol: '₹',
      items: [
        {
          id: `item-inv-${Date.now()}`,
          serviceId: srv.id,
          name: srv.name,
          description: srv.description,
          deliverables: srv.deliverables,
          quantity: 1,
          unit: srv.unit,
          unitPrice: srv.unitPrice,
          discountPercent: 0,
          taxPercent: srv.taxPercent,
          totalPrice: srv.unitPrice * 1.18,
        },
      ],
      financials: {
        subtotal: srv.unitPrice,
        itemDiscounts: 0,
        globalDiscount: 0,
        taxableAmount: srv.unitPrice,
        cgst: Math.round(srv.unitPrice * 0.09),
        sgst: Math.round(srv.unitPrice * 0.09),
        igst: 0,
        roundOff: 0,
        grandTotal: Math.round(srv.unitPrice * 1.18),
      },
      globalDiscount: 0,
      amountPaid: 0,
      amountDue: Math.round(srv.unitPrice * 1.18),
      paymentInstructions: 'Direct NEFT/RTGS to HDFC Account 50200084729104',
      templateId: 'trustlayer-labs',
      status: 'SENT',
    });

    setActionNotice(`Draft Tax Invoice ${newInv.number} created.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-4 pb-8 font-sans">
      {/* Signature Reference Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-br from-trustBlue-50 via-white to-blue-50/60 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-trustBlue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="h-12 w-12 bg-white rounded-2xl border border-slate-200/90 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-full w-auto object-contain" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-trustBlue-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{businessProfile.legalName}</span>
              </span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                GST VERIFIED ({businessProfile.gstin})
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Invoice Management</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Track client billing, outstanding receivables, payment ledgers, and Tax Invoices.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <button
            onClick={handleCreateNewInvoice}
            className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-99"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>


      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice # or client name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-trustBlue-600 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === st
                  ? 'bg-trustBlue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Data & Cards Layout */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        {/* Mobile Responsive Cards View (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-trustBlue-600 font-mono text-xs">
                    {inv.number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inv.status === 'PARTIALLY_PAID'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-outfit">
                    {inv.client.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {inv.client.contactPerson} • {inv.client.email}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Issued: {inv.issueDate}</span>
                    <span className="text-slate-500 block text-[10px]">Due: {inv.dueDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 font-outfit text-sm block">
                      {formatCurrency(inv.financials.grandTotal)}
                    </span>
                    {inv.amountDue > 0 ? (
                      <span className="text-[10px] text-amber-600 font-extrabold">
                        Due: {formatCurrency(inv.amountDue)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-extrabold">Fully Paid ✓</span>
                    )}
                  </div>
                </div>

                {/* Touch-Friendly Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEmailModal(inv.number, inv.client.email, 'invoice')}
                    className="min-h-[44px] touch-target flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition-colors"
                  >
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Email Invoice</span>
                  </button>

                  {inv.amountDue > 0 ? (
                    <button
                      type="button"
                      onClick={() => setActivePaymentInvoiceId(inv.id)}
                      className="min-h-[44px] touch-target flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Record Payment</span>
                    </button>
                  ) : (
                    <div className="min-h-[44px] flex items-center justify-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                      Paid in Full
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No matching invoices found</p>
            </div>
          )}
        </div>

        {/* Desktop Data Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9.5px] tracking-wider bg-slate-50/70">
                <th className="py-3 px-3 rounded-l-xl">Invoice #</th>
                <th className="py-3 px-3">Client Company</th>
                <th className="py-3 px-3">Issue / Due Date</th>
                <th className="py-3 px-3">Total / Amount Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-trustBlue-600 font-mono">{inv.number}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{inv.client.companyName}</div>
                      <div className="text-[10px] text-slate-400">{inv.client.contactPerson} • {inv.client.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <div className="font-semibold">{inv.issueDate}</div>
                      <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-slate-900">{formatCurrency(inv.financials.grandTotal)}</div>
                      {inv.amountDue > 0 ? (
                        <div className="text-[10px] text-amber-600 font-extrabold">
                          Due: {formatCurrency(inv.amountDue)}
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 font-extrabold">Fully Paid ✓</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    {/* Action Toolbar Layout Buttons */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center justify-end space-x-1.5">
                        {/* Email Action Button */}
                        <button
                          type="button"
                          onClick={() => openEmailModal(inv.number, inv.client.email, 'invoice')}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] transition-all shadow-2xs"
                          title="Dispatch Tax Invoice Email"
                        >
                          <Mail className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Email</span>
                        </button>

                        {/* Record Payment Action Button */}
                        {inv.amountDue > 0 && (
                          <button
                            type="button"
                            onClick={() => setActivePaymentInvoiceId(inv.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[11px] transition-all shadow-2xs active:scale-98"
                            title="Record Payment for Invoice"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Payment</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">No matching invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activePaymentInvoiceId && (
        <PaymentModal
          isOpen={!!activePaymentInvoiceId}
          onClose={() => setActivePaymentInvoiceId(null)}
          invoiceId={activePaymentInvoiceId}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
