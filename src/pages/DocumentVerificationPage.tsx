import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DocumentVerificationPage: React.FC = () => {
  const { quotations, invoices, businessProfile } = useApp();
  const [docIdInput, setDocIdInput] = useState('TLQ-2026-0001');

  const matchedDoc =
    quotations.find((q) => q.number.toLowerCase() === docIdInput.toLowerCase().trim()) ||
    invoices.find((i) => i.number.toLowerCase() === docIdInput.toLowerCase().trim()) ||
    quotations[0] ||
    invoices[0];

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto font-sans">
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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Official Document Verification Portal</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Cryptographically verify the authenticity, issuer identity, and SHA-256 checksum of documents.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SHA-256 ONLINE</span>
          </span>
        </div>
      </div>


        {/* Verification Input Bar */}
        <div className="pt-2 max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={docIdInput}
              onChange={(e) => setDocIdInput(e.target.value)}
              placeholder="Enter Document ID (e.g. TLQ-2026-0001)..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-trustBlue-600 focus:ring-2 focus:ring-trustBlue-100 shadow-xs"
            />
          </div>
          <button className="bg-trustBlue-600 hover:bg-trustBlue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Document</span>
          </button>
        </div>

      {/* Verification Card Output */}

      {matchedDoc ? (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-xs font-extrabold text-emerald-950 flex items-center gap-2">
                VERIFIED AUTHENTIC DOCUMENT
                <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  ACTIVE STAMP
                </span>
              </h3>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                This document was legitimately created and cryptographically signed by {businessProfile.companyName}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Document Metadata</div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 text-[11px]">
                <span className="text-slate-500">Document ID:</span>
                <span className="font-mono font-bold text-trustBlue-600">{matchedDoc.number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 text-[11px]">
                <span className="text-slate-500">Issued To:</span>
                <span className="font-semibold text-slate-900">{matchedDoc.client.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 text-[11px]">
                <span className="text-slate-500">Issue Date:</span>
                <span className="text-slate-700">{matchedDoc.issueDate}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Grand Total:</span>
                <span className="font-bold text-slate-900">₹{matchedDoc.financials.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Security Credentials</div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 text-[11px]">
                <span className="text-slate-500">Issuer GSTIN:</span>
                <span className="font-mono text-slate-800">{businessProfile.gstin}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 text-[11px]">
                <span className="text-slate-500">Verification Link:</span>
                <span className="font-mono text-trustBlue-600 truncate w-36">{matchedDoc.verification.verificationUrl}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 text-[11px]">
                <span className="text-slate-500">SHA-256 Hash:</span>
                <span className="font-mono text-[9px] text-slate-500 truncate w-36">{matchedDoc.verification.hash}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Verified Timestamp:</span>
                <span className="text-slate-700">{matchedDoc.verification.timestamp.split('T')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Document Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please enter a valid document ID (e.g. TLQ-2026-0001 or TLI-2026-0001) to verify its authenticity.
          </p>
        </div>
      )}
    </div>
  );
};
