import React from 'react';
import { ESignatureData } from '../types';

interface SignatureSectionProps {
  companySignatoryName?: string;
  companySignatoryTitle?: string;
  clientName: string;
  clientTitle?: string;
  signatureData?: ESignatureData;
  issueDate: string;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  companySignatoryName = 'Alex Rivera',
  companySignatoryTitle = 'Solutions Consultant',
  clientName,
  clientTitle = 'Authorized Representative',
  signatureData,
  issueDate,
}) => {
  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider">
        AUTHORIZED SIGNATURE
      </div>

      <div className="p-3.5 bg-white grid grid-cols-2 gap-6 text-[9px] text-slate-900">
        {/* For TrustLayerLabs */}
        <div className="space-y-1.5 border-r border-slate-200 pr-4">
          <div className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
            For TrustLayerLabs
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold text-slate-500">Name</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 font-bold text-slate-900">{companySignatoryName}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold text-slate-500">Title</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 text-slate-700">{companySignatoryTitle}</span>
          </div>
          <div className="grid grid-cols-12 pt-1">
            <span className="col-span-3 font-semibold text-slate-500">Signature</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 border-b border-slate-400 pb-0.5 font-serif italic font-bold text-blue-900">
              {companySignatoryName}
            </span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold text-slate-500">Date</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 border-b border-slate-300 font-mono text-[8.5px]">
              {issueDate}
            </span>
          </div>
        </div>

        {/* For Client */}
        <div className="space-y-1.5 pl-2">
          <div className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
            For Client
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold text-slate-500">Name</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 font-bold text-slate-900">{clientName}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold text-slate-500">Title</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 text-slate-700">{clientTitle}</span>
          </div>
          <div className="grid grid-cols-12 pt-1">
            <span className="col-span-3 font-semibold text-slate-500">Signature</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 border-b border-slate-400 pb-0.5">
              {signatureData ? (
                <span className="font-serif italic font-bold text-emerald-700">
                  {signatureData.signedByName} ✓
                </span>
              ) : (
                <span className="text-slate-400 font-mono">____________________</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold text-slate-500">Date</span>
            <span className="col-span-1 font-bold text-slate-400">:</span>
            <span className="col-span-8 border-b border-slate-300 font-mono text-[8.5px]">
              {signatureData?.signedAt
                ? signatureData.signedAt.split('T')[0]
                : '____________________'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
