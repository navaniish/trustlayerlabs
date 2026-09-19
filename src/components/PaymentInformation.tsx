import React from 'react';
import { BusinessProfile } from '../types';

interface PaymentInformationProps {
  businessProfile: BusinessProfile;
  paymentReference?: string;
}

export const PaymentInformation: React.FC<PaymentInformationProps> = ({
  businessProfile,
  paymentReference,
}) => {
  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider">
        PAYMENT INFORMATION
      </div>

      <div className="p-3 bg-white space-y-1 text-[9.5px]">
        <div className="grid grid-cols-12 border-b border-slate-100 pb-1">
          <span className="col-span-4 font-bold text-slate-700">Bank Name</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-bold text-slate-900">
            {businessProfile.bankDetails?.bankName || 'HDFC Bank Ltd.'}
          </span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">Account Name</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-semibold text-slate-800">
            {businessProfile.bankDetails?.accountName || 'TrustLayerLabs Private Limited'}
          </span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">Account Number</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-mono font-bold text-slate-900">
            {businessProfile.bankDetails?.accountNumber || '50200088991122'}
          </span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">IFSC / SWIFT</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-mono font-bold text-blue-600">
            {businessProfile.bankDetails?.ifscCode || 'HDFC0001234'}
          </span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">UPI ID</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-medium text-slate-800">
            {businessProfile.upiId || 'trustlayerlabs@hdfcbank'}
          </span>
        </div>

        <div className="grid grid-cols-12 pt-1">
          <span className="col-span-4 font-bold text-slate-700">Payment Reference</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-mono font-bold text-slate-900">
            {paymentReference || 'Quote/Invoice #'}
          </span>
        </div>
      </div>
    </div>
  );
};
