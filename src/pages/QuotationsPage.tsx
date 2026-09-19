import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  FileCheck,
  Globe,
  Trash2,
  Edit3,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/pricingEngine';

export const QuotationsPage: React.FC = () => {
  const {
    quotations,
    setActiveTab,
    setSelectedQuotationId,
    convertQuotationToInvoice,
    deleteQuotation,
    openEmailModal,
    businessProfile,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredQuotes = quotations.filter((q) => {
    const matchesStatus = filterStatus === 'ALL' || q.status === filterStatus;
    const matchesSearch =
      q.number.toLowerCase().includes(search.toLowerCase()) ||
      q.client.companyName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConvertToInvoice = (quotationId: string, quotationNumber: string, clientEmail: string) => {
    const inv = convertQuotationToInvoice(quotationId);
    setActionNotice(`Quotation ${quotationNumber} converted to Invoice ${inv.number}!`);
    setTimeout(() => setActionNotice(null), 3500);

    // Open email modal specifically for the new invoice
    openEmailModal(inv.number, clientEmail, 'invoice');
  };

  const handleDeleteQuotation = (quotationId: string, quotationNumber: string) => {
    if (window.confirm(`Are you sure you want to delete quotation ${quotationNumber}? This action cannot be undone.`)) {
      deleteQuotation(quotationId);
      setActionNotice(`Quotation ${quotationNumber} deleted successfully.`);
      setTimeout(() => setActionNotice(null), 3000);
    }
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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Quotations Management</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Create, send, track, and convert client proposals to official invoices.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <button
            onClick={() => {
              setSelectedQuotationId(null);
              setActiveTab('quotation-builder');
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-99"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quote</span>
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

      {/* Toolbar & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotation # or client name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-trustBlue-600 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'INVOICED'].map((st) => (
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

      {/* Main Quotations Data & Cards Layout */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        {/* Mobile Responsive Cards View (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quo) => (
              <div
                key={quo.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-trustBlue-600 font-mono text-xs">
                    {quo.number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      quo.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : quo.status === 'INVOICED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {quo.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-outfit">
                    {quo.client.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {quo.client.contactPerson} • {quo.client.email}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Date: {quo.issueDate}</span>
                  <span className="font-extrabold text-slate-900 font-outfit text-sm">
                    {formatCurrency(quo.financials.grandTotal, quo.currency)}
                  </span>
                </div>

                {/* Touch-Friendly Action Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuotationId(quo.id);
                      setActiveTab('quotation-builder');
                    }}
                    className="min-h-[44px] touch-target flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-trustBlue-700 font-bold text-xs transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-trustBlue-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEmailModal(quo.number, quo.client.email, 'quotation')}
                    className="min-h-[44px] touch-target flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition-colors"
                  >
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuotationId(quo.id);
                      setActiveTab('client-portal');
                    }}
                    className="min-h-[44px] touch-target flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs transition-colors"
                  >
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>Portal</span>
                  </button>

                  {quo.status !== 'INVOICED' ? (
                    <button
                      type="button"
                      onClick={() => handleConvertToInvoice(quo.id, quo.number, quo.client.email)}
                      className="min-h-[44px] touch-target flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      <span>To Invoice</span>
                    </button>
                  ) : (
                    <div className="min-h-[44px] flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-100 rounded-xl border border-slate-200">
                      Invoiced
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No matching quotations found</p>
            </div>
          )}
        </div>

        {/* Desktop Data Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9.5px] tracking-wider bg-slate-50/70">
                <th className="py-3 px-3 rounded-l-xl">Quotation #</th>
                <th className="py-3 px-3">Client Company</th>
                <th className="py-3 px-3">Issue / Expiry Date</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quo) => (
                  <tr key={quo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-trustBlue-600 font-mono">
                      {quo.number}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{quo.client.companyName}</div>
                      <div className="text-[10px] text-slate-400">{quo.client.contactPerson} • {quo.client.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <div className="font-semibold">{quo.issueDate}</div>
                      <div className="text-[10px] text-slate-400">Valid: {quo.validUntil}</div>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-slate-900">
                      {formatCurrency(quo.financials.grandTotal, quo.currency)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          quo.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : quo.status === 'INVOICED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {quo.status}
                      </span>
                    </td>

                    {/* Styled Action Layout Toolbar Buttons */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center justify-end space-x-1.5">
                        {/* Edit Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuotationId(quo.id);
                            setActiveTab('quotation-builder');
                          }}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-trustBlue-700 font-bold text-[11px] transition-all shadow-2xs"
                          title="Edit Quotation in Builder"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-trustBlue-600" />
                          <span>Edit</span>
                        </button>

                        {/* Email Action Button */}
                        <button
                          type="button"
                          onClick={() => openEmailModal(quo.number, quo.client.email, 'quotation')}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] transition-all shadow-2xs"
                          title="Dispatch Quotation Email"
                        >
                          <Mail className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Email</span>
                        </button>

                        {/* Portal View Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuotationId(quo.id);
                            setActiveTab('client-portal');
                          }}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] transition-all shadow-2xs"
                          title="Open Client Signature Portal"
                        >
                          <Globe className="w-3.5 h-3.5 text-amber-600" />
                          <span>Portal</span>
                        </button>

                        {/* To Invoice Action Button */}
                        {quo.status !== 'INVOICED' ? (
                          <button
                            type="button"
                            onClick={() => handleConvertToInvoice(quo.id, quo.number, quo.client.email)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[11px] transition-all shadow-2xs active:scale-98"
                            title="Convert Quotation to Tax Invoice & Dispatch Email"
                          >
                            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                            <span>To Invoice</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                            Invoiced
                          </span>
                        )}

                        {/* Delete Action Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteQuotation(quo.id, quo.number)}
                          className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-[11px] transition-all shadow-2xs"
                          title="Delete Quotation"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">No matching quotations found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotationsPage;
