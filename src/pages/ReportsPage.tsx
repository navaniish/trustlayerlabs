import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, Users, FileText, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/pricingEngine';

export const ReportsPage: React.FC = () => {
  const { quotations, invoices, payments, clients, businessProfile } = useApp();

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalQuotedValue = quotations.reduce((acc, q) => acc + q.financials.grandTotal, 0);
  const acceptedQuotes = quotations.filter((q) => q.status === 'ACCEPTED' || q.status === 'INVOICED').length;
  const conversionRate = quotations.length > 0 ? Math.round((acceptedQuotes / quotations.length) * 100) : 0;

  // Calculate service revenue breakdown dynamically from invoices/quotations items
  const serviceRevenueMap: Record<string, number> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const name = item.name || 'Security Service';
      serviceRevenueMap[name] = (serviceRevenueMap[name] || 0) + item.totalPrice;
    });
  });

  const totalServiceRevenue = Object.values(serviceRevenueMap).reduce((a, b) => a + b, 0);
  const serviceBreakdown = Object.entries(serviceRevenueMap).map(([name, val]) => ({
    name,
    val,
    pct: totalServiceRevenue > 0 ? Math.round((val / totalServiceRevenue) * 100) : 0,
  }));

  // Calculate client revenue contribution dynamically
  const clientRevenueMap: Record<string, number> = {};
  invoices.forEach((inv) => {
    if (inv.client && inv.client.id) {
      clientRevenueMap[inv.client.id] = (clientRevenueMap[inv.client.id] || 0) + (inv.financials?.grandTotal || 0);
    }
  });

  const clientContributions = clients
    .map((c) => ({
      client: c,
      totalSpent: clientRevenueMap[c.id] || 0,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);

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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Revenue &amp; Sales Analytics</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Track quotation conversion, revenue by client, and service metrics in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-trustBlue-50 text-trustBlue-700 border border-trustBlue-200 shadow-2xs">
            FY 2026-27 Reports
          </span>
        </div>
      </div>


      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Total Billed & Collected</div>
          <div className="text-xl font-extrabold text-slate-900 font-outfit">{formatCurrency(totalCollected)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            {payments.length === 0 ? 'No payments collected yet' : `${payments.length} verified transactions`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Total Quotations Value</div>
          <div className="text-xl font-extrabold text-trustBlue-600 font-outfit">{formatCurrency(totalQuotedValue)}</div>
          <div className="text-[10px] text-slate-500">{quotations.length} total quotes generated</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Quotation Conversion Rate</div>
          <div className="text-xl font-extrabold text-amber-600 font-outfit">{conversionRate}%</div>
          <div className="text-[10px] text-slate-500">
            {acceptedQuotes} accepted / {quotations.length} quotes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Service Breakdown */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-trustBlue-600" />
            <span>Revenue Breakdown by Service</span>
          </h3>
          {serviceBreakdown.length > 0 ? (
            <div className="space-y-2.5 text-xs">
              {serviceBreakdown.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                    <span>{s.name}</span>
                    <span>{formatCurrency(s.val)} ({s.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${s.pct}%` }} className="h-full bg-trustBlue-600 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <PieChart className="w-5 h-5 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No Service Sales Data</p>
              <p className="text-[10px] text-slate-400">Issued invoices will populate revenue by service automatically.</p>
            </div>
          )}
        </div>

        {/* Client Revenue Contributors */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-trustBlue-600" />
            <span>Top Client Revenue Contributors</span>
          </h3>
          {clientContributions.length > 0 ? (
            <div className="space-y-2 text-xs">
              {clientContributions.map(({ client, totalSpent }) => (
                <div key={client.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-[11px]">
                  <div>
                    <div className="font-bold text-slate-900">{client.companyName}</div>
                    <div className="text-[9px] text-slate-500">{client.contactPerson}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-trustBlue-600">{formatCurrency(totalSpent)}</div>
                    <span className="text-[9px] text-slate-500 font-medium">Billed Revenue</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Users className="w-5 h-5 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No Client Contributions Yet</p>
              <p className="text-[10px] text-slate-400">Add clients and create invoices to track top revenue contributors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
