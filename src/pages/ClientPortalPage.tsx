import React, { useState } from 'react';
import { Download, CheckCircle2, MessageSquare, Phone, Globe, Shield, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

import { exportToPdf } from '../utils/pdfGenerator';
import { PaperSize } from '../types';
import { ESignatureModal } from '../components/ESignatureModal';
import { DocumentPreview } from '../components/DocumentPreview';

export const ClientPortalPage: React.FC = () => {
  const { quotations, selectedQuotationId, businessProfile, setActiveTab } = useApp();
  const quotation = quotations.find((q) => q.id === selectedQuotationId) || quotations[0];
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [requestChangeText, setRequestChangeText] = useState('');

  const [paperSize, setPaperSize] = useState<PaperSize>('a4');

  if (!quotation) {
    return (
      <div className="space-y-4 pb-8 max-w-3xl mx-auto">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-trustBlue-50 text-trustBlue-600 mx-auto flex items-center justify-center border border-trustBlue-200 shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900 font-outfit">No Active Quotation Selected</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Create a new quotation in the Quotation Builder or select an existing quotation to preview the Client Portal view with live electronic signatures.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('quotation-builder')}
              className="bg-trustBlue-600 hover:bg-trustBlue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              + Create Quotation
            </button>
            <button
              onClick={() => setActiveTab('quotations')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              View Quotations
            </button>
          </div>
        </div>
      </div>
    );
  }

  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/q/${quotation.number}` : `http://localhost:3001/q/${quotation.number}`;

  return (
    <div className="space-y-4 pb-8 max-w-5xl mx-auto font-sans">
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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Online Client Signature &amp; Review Portal</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Client portal link:{' '}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(portalUrl);
                  alert(`Copied Client Proposal Portal link to clipboard:\n${portalUrl}`);
                }}
                className="font-mono text-trustBlue-600 font-bold hover:underline inline-flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-xl border border-blue-200/80 cursor-pointer text-xs"
                title="Click to copy verified proposal link"
              >
                <span>{portalUrl}</span>
                <span className="text-[10px] uppercase font-bold text-trustBlue-700 bg-white px-1.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">Copy</span>
              </button>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value as PaperSize)}
            className="text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none shadow-2xs"
          >
            <option value="a4">A4 (2 Pages)</option>
            <option value="a3">A3 (1 Page)</option>
          </select>

          <button
            onClick={() => exportToPdf('document-preview-a4', quotation.number, paperSize)}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-trustBlue-600" />
            <span>Download PDF</span>
          </button>

          {quotation.status !== 'ACCEPTED' && (
            <button
              onClick={() => setIsSigModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-99"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>E-Sign &amp; Accept Proposal</span>
            </button>
          )}
        </div>
      </div>


      {/* Main Document Layout Container */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 shadow-xs flex justify-center">
        <DocumentPreview document={quotation} businessProfile={businessProfile} type="quotation" paperSize={paperSize} />
      </div>

      {/* Action Footer for Client */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900">Client Response Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accept & Sign Electronically</span>
            </h4>
            <p className="text-slate-600 text-[11px]">
              Clicking accept allows drawing or typing your signature with IP logging.
            </p>
            <button
              onClick={() => setIsSigModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 rounded-md text-xs transition-colors shadow-xs"
            >
              {quotation.status === 'ACCEPTED' ? '✓ Quotation Already Accepted' : 'Sign & Accept Quotation'}
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Request Modifications</span>
            </h4>
            <textarea
              rows={2}
              value={requestChangeText}
              onChange={(e) => setRequestChangeText(e.target.value)}
              placeholder="What changes would you like to request?"
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 text-xs font-medium"
            />
            <button
              onClick={() => {
                if (requestChangeText.trim()) {
                  alert('Change request submitted to sales team!');
                }
              }}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-1.5 rounded-md text-xs transition-colors"
            >
              Submit Change Request
            </button>
          </div>
        </div>
      </div>

      {isSigModalOpen && (
        <ESignatureModal
          isOpen={isSigModalOpen}
          onClose={() => setIsSigModalOpen(false)}
          quotationId={quotation.id}
        />
      )}
    </div>
  );
};
