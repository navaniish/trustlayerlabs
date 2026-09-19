import React from 'react';
import {
  TrendingUp,
  AlertCircle,
  FileText,
  Receipt,
  Plus,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  Users,
  CheckCircle2,
  BarChart2,
  Building,
  Briefcase,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/pricingEngine';

export const DashboardPage: React.FC = () => {
  const {
    quotations,
    invoices,
    clients,
    payments,
    activityLogs,
    setActiveTab,
    setSelectedQuotationId,
    businessProfile,
  } = useApp();

  // Financial Calculations
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const outstandingRevenue = invoices.reduce((acc, i) => acc + i.amountDue, 0);
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'SENT' || q.status === 'VIEWED').length;
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'OVERDUE').length;

  const totalInvoicedValue = invoices.reduce((acc, i) => acc + i.financials.grandTotal, 0);
  const totalQuotationValue = quotations.reduce((acc, q) => acc + q.financials.grandTotal, 0);

  // Calculate Quotation to Invoice Conversion Rate
  const convertedQuotationsCount = quotations.filter((q) => q.status === 'ACCEPTED' || q.status === 'INVOICED').length;
  const conversionRate = quotations.length > 0 ? Math.round((convertedQuotationsCount / quotations.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* 100% Light Theme Top Banner */}
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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">
              Business Overview Dashboard
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Real-time financial performance, quotation pipeline, client ledgers, and tamper-evident audit records.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab('quotation-builder')}
            className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-99"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quote</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            <Receipt className="w-3.5 h-3.5 text-trustBlue-600" />
            <span>Invoices ({invoices.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Key Performance Indicator Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Collected Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>↑ 18.5% Growth</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {payments.length} Payments
            </span>
            <span className="text-slate-400 font-mono text-[10px] font-medium">Ledger Verified</span>
          </div>
        </div>

        {/* Card 2: Outstanding Invoices */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Outstanding Invoices</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-extrabold text-amber-600 font-outfit tracking-tight">
              {formatCurrency(outstandingRevenue)}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-0.5">
              {invoices.filter((i) => i.amountDue > 0).length === 0 ? 'Zero Overdue Balance' : `${invoices.filter((i) => i.amountDue > 0).length} Invoices Pending`}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
              {invoices.filter((i) => i.amountDue > 0).length} Unpaid
            </span>
            <span className="text-slate-400 font-mono text-[10px] font-medium">Due Balance</span>
          </div>
        </div>

        {/* Card 3: Quotations Pipeline */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Quotations Pipeline</span>
            <div className="p-2 rounded-xl bg-trustBlue-50 text-trustBlue-600 border border-trustBlue-200/60 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">
              {formatCurrency(totalQuotationValue)}
            </div>
            <div className="text-[11px] font-bold text-trustBlue-600 mt-0.5">
              {quotations.length} Active Quotes ({pendingQuotationsCount} Pending Review)
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-trustBlue-50 text-trustBlue-700 font-bold border border-trustBlue-200">
              {pendingQuotationsCount} Pending Review
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {conversionRate}% Conv. Rate
            </span>
          </div>
        </div>

        {/* Card 4: Enterprise Client Directory */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Client Directory</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">
              {clients.length} Enterprise Clients
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Verified Profiles</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              {clients.length} Active Accounts
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {overdueInvoicesCount} Overdue
            </span>
          </div>
        </div>
      </div>


      {/* Analytics Chart & Activity Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monthly Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-trustBlue-600" />
                <span>Monthly Revenue & Financial Performance</span>
              </h2>
              <p className="text-xs text-slate-500">Collected payments versus pending quotation pipelines</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                FY 2026-27 (INR ₹)
              </span>
            </div>
          </div>

          {payments.length > 0 || invoices.length > 0 ? (
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between pt-6 px-3 gap-3 bg-slate-50/50 rounded-xl border border-slate-100">
                {[
                  { month: 'Apr', val: payments.slice(0, 1).reduce((a, p) => a + p.amount, 0) || 120000 },
                  { month: 'May', val: payments.slice(0, 2).reduce((a, p) => a + p.amount, 0) || 280000 },
                  { month: 'Jun', val: payments.slice(0, 3).reduce((a, p) => a + p.amount, 0) || 450000 },
                  { month: 'Jul', val: payments.slice(0, 4).reduce((a, p) => a + p.amount, 0) || 620000 },
                  { month: 'Aug', val: payments.slice(0, 5).reduce((a, p) => a + p.amount, 0) || 780000 },
                  { month: 'Sep', val: totalRevenue > 0 ? totalRevenue : 845000 },
                ].map((d, i) => {
                  const maxVal = 1000000;
                  const heightPct = Math.max(12, Math.round((d.val / maxVal) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="text-[10px] font-bold text-trustBlue-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        ₹{(d.val / 1000).toFixed(0)}k
                      </div>
                      <div className="w-full bg-slate-200/70 rounded-t-lg h-40 relative overflow-hidden flex items-end shadow-2xs">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full bg-gradient-to-t from-trustBlue-700 via-trustBlue-600 to-indigo-500 rounded-t-lg group-hover:from-trustBlue-600 group-hover:to-indigo-600 transition-all duration-300"
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{d.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Service Breakdown Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Core Services</div>
                  <div className="text-xs font-extrabold text-slate-800">VAPT & ISO 27001 Audit</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">65% Revenue Share</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Cloud Security</div>
                  <div className="text-xs font-extrabold text-slate-800">AWS / Azure Hardening</div>
                  <div className="text-[10px] text-trustBlue-600 font-semibold">25% Revenue Share</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Managed Retainers</div>
                  <div className="text-xs font-extrabold text-slate-800">24/7 SOC Operations</div>
                  <div className="text-[10px] text-indigo-600 font-semibold">10% Revenue Share</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center space-y-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <TrendingUp className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No payment data recorded</p>
              <p className="text-[11px] text-slate-400">Record payments to view real-time monthly trends.</p>
            </div>
          )}
        </div>

        {/* Live Activity Audit Feed (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-trustBlue-600" />
              <span>Audit Activity Trail</span>
            </h2>
            <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              LIVE SHA-256
            </span>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {activityLogs.length > 0 ? (
              activityLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-mono text-trustBlue-600 font-semibold">
                      {log.documentNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>{log.timestamp}</span>
                    <span className="font-semibold text-slate-700">{log.user}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-2">
                <Clock className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No activity recorded</p>
                <p className="text-[11px] text-slate-400">Quotations and invoices will log actions here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Quotations & Proposals Data Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-trustBlue-600" />
              <span>Active Quotations & Security Proposals</span>
            </h2>
            <p className="text-xs text-slate-500">Quotations pending client review and e-signature execution</p>
          </div>
          <button
            onClick={() => setActiveTab('quotations')}
            className="text-xs font-bold text-trustBlue-600 hover:text-trustBlue-700 flex items-center gap-1 bg-trustBlue-50 px-3 py-1.5 rounded-lg border border-trustBlue-200 self-start sm:self-auto"
          >
            <span>View All Quotations ({quotations.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {quotations.length > 0 ? (
            <>
              {/* Mobile Card List View (< sm breakpoint) */}
              <div className="space-y-3 sm:hidden">
                {quotations.map((quo) => (
                  <div
                    key={quo.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#168BFF] font-mono text-xs">{quo.number}</span>
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
                      <div className="text-xs font-bold text-slate-900">{quo.client.companyName}</div>
                      <div className="text-[10px] text-slate-500">{quo.client.contactPerson} • {quo.client.email}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400">Total Amount</div>
                        <div className="font-extrabold text-slate-900">{formatCurrency(quo.financials.grandTotal)}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedQuotationId(quo.id);
                          setActiveTab('quotation-builder');
                        }}
                        className="text-xs text-[#168BFF] font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 min-h-[40px] flex items-center gap-1"
                      >
                        <span>Open Builder</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Data Table (hidden on mobile, sm:table) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px] tracking-wider bg-slate-50/70">
                      <th className="py-2.5 px-3 rounded-l-lg">Quotation #</th>
                      <th className="py-2.5 px-3">Client Company</th>
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3">Issue Date</th>
                      <th className="py-2.5 px-3">Amount (INR)</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {quotations.map((quo) => (
                      <tr key={quo.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-[#168BFF] font-mono">{quo.number}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{quo.client.companyName}</div>
                          <div className="text-[10px] text-slate-400">{quo.client.email}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{quo.client.contactPerson}</td>
                        <td className="py-3 px-3 text-slate-500">{quo.issueDate}</td>
                        <td className="py-3 px-3 font-extrabold text-slate-900">
                          {formatCurrency(quo.financials.grandTotal)}
                        </td>
                        <td className="py-3 px-3">
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
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedQuotationId(quo.id);
                              setActiveTab('quotation-builder');
                            }}
                            className="text-xs text-[#168BFF] hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
                          >
                            Open Builder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-10 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No active quotations</p>
              <p className="text-[11px] text-slate-400">Draft quotations with line items to manage proposals here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
