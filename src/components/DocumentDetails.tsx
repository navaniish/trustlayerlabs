import React from 'react';
import { Quotation, Invoice, BusinessProfile } from '../types';

interface DocumentDetailsProps {
  document: Quotation | Invoice;
  businessProfile: BusinessProfile;
  type?: 'quotation' | 'invoice';
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  businessProfile,
  type = 'quotation',
}) => {
  const isQuotation = type === 'quotation' || 'validUntil' in document;

  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
        {isQuotation ? 'QUOTATION DETAILS' : 'INVOICE DETAILS'}
      </div>

      <div className="p-3 space-y-1 text-[9.5px]">
        {/* Document Number */}
        <div className="grid grid-cols-12 border-b border-slate-100 pb-1">
          <span className="col-span-4 font-bold text-slate-700">
            {isQuotation ? 'Quote Number' : 'Invoice Number'}
          </span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-black text-slate-900 font-mono text-[10px]">
            {document.number}
          </span>
        </div>

        {/* Issue Date */}
        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">
            {isQuotation ? 'Issue Date' : 'Invoice Date'}
          </span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-semibold text-slate-800">{document.issueDate}</span>
        </div>

        {/* Valid Until / Due Date */}
        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">
            {isQuotation ? 'Valid Until' : 'Due Date'}
          </span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-bold text-amber-700">
            {isQuotation ? (document as Quotation).validUntil : (document as Invoice).dueDate}
          </span>
        </div>

        {isQuotation ? (
          <>
            <div className="grid grid-cols-12 border-b border-slate-100 py-1">
              <span className="col-span-4 font-bold text-slate-700">Prepared By</span>
              <span className="col-span-1 font-bold text-slate-400">:</span>
              <span className="col-span-7 font-semibold text-slate-800">
                {document.preparedBy || document.salesperson || 'Security Architect'}
              </span>
            </div>
            <div className="grid grid-cols-12 border-b border-slate-100 py-1">
              <span className="col-span-4 font-bold text-slate-700">Designation</span>
              <span className="col-span-1 font-bold text-slate-400">:</span>
              <span className="col-span-7 text-slate-700">
                {document.preparedByDesignation || 'Lead Security Specialist'}
              </span>
            </div>
            <div className="grid grid-cols-12 border-b border-slate-100 py-1">
              <span className="col-span-4 font-bold text-slate-700">Email</span>
              <span className="col-span-1 font-bold text-slate-400">:</span>
              <span className="col-span-7 font-medium text-blue-600">{businessProfile.email}</span>
            </div>
            <div className="grid grid-cols-12 border-b border-slate-100 py-1">
              <span className="col-span-4 font-bold text-slate-700">Phone</span>
              <span className="col-span-1 font-bold text-slate-400">:</span>
              <span className="col-span-7 text-slate-800">{businessProfile.phone}</span>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-12 border-b border-slate-100 py-1">
              <span className="col-span-4 font-bold text-slate-700">Payment Terms</span>
              <span className="col-span-1 font-bold text-slate-400">:</span>
              <span className="col-span-7 font-semibold text-slate-800">
                {(document as Invoice).paymentTerms || 'Net 30'}
              </span>
            </div>
            <div className="grid grid-cols-12 border-b border-slate-100 py-1">
              <span className="col-span-4 font-bold text-slate-700">Reference</span>
              <span className="col-span-1 font-bold text-slate-400">:</span>
              <span className="col-span-7 font-mono text-slate-700">
                {document.reference || `PO-${document.number}`}
              </span>
            </div>
          </>
        )}

        {/* Currency */}
        <div className="grid grid-cols-12 pt-1">
          <span className="col-span-4 font-bold text-slate-700">Currency</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-extrabold text-blue-600">
            {document.currency} ({document.currencySymbol || (document.currency === 'INR' ? '₹' : '$')})
          </span>
        </div>
      </div>
    </div>
  );
};
