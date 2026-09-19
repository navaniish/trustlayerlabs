import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';

interface VerificationQRCodeProps {
  documentNumber: string;
  verificationUrl?: string;
}

export const VerificationQRCode: React.FC<VerificationQRCodeProps> = ({
  documentNumber,
  verificationUrl,
}) => {
  const qrTarget =
    verificationUrl || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/q/${documentNumber}`;

  return (
    <div className="rounded-sm border-2 border-slate-900 bg-white overflow-hidden p-2 flex flex-col items-center justify-between text-center h-full shadow-xs">
      <div className="bg-slate-900 text-white w-full py-1 text-[8px] font-extrabold tracking-wider uppercase rounded-xs flex items-center justify-center space-x-1">
        <ShieldCheck className="w-3 h-3 text-blue-400" />
        <span>VERIFY DOCUMENT</span>
      </div>

      <div className="p-2 bg-white border border-slate-200 rounded my-1.5 flex items-center justify-center">
        <QRCodeSVG
          value={qrTarget}
          size={64}
          level="H"
          includeMargin={false}
        />
      </div>

      <div className="space-y-0.5 w-full">
        <div className="text-[8px] font-black text-slate-900 tracking-wider uppercase">
          SCAN TO VERIFY
        </div>
        <div className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[7.5px] font-bold tracking-widest uppercase">
          AUTHENTIC DOCUMENT
        </div>
      </div>
    </div>
  );
};
