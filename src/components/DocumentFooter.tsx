import React from 'react';
import { BusinessProfile } from '../types';
import { Shield, Cloud, Cpu, BarChart3 } from 'lucide-react';

interface DocumentFooterProps {
  businessProfile: BusinessProfile;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({ businessProfile }) => {
  return (
    <div className="bg-[#07111C] text-white px-6 py-2.5 flex items-center justify-between text-[8px] border-t border-[#0B4F8A]">
      {/* Left: Brand Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="/ttlslogo-dark.png"
          alt="TrustLayerLabs"
          className="h-7 w-auto object-contain"
        />
      </div>

      {/* Center: 4 Core Capabilities / Service Pillars */}
      <div className="flex items-center space-x-5 text-slate-300 border-x border-slate-700/60 px-5 py-0.5">
        <div className="flex flex-col items-center space-y-0.5">
          <Shield className="w-3.5 h-3.5 text-[#168BFF]" />
          <span className="font-extrabold text-[7px] text-white tracking-wider uppercase">CYBERSECURITY</span>
        </div>
        <div className="flex flex-col items-center space-y-0.5">
          <Cloud className="w-3.5 h-3.5 text-[#168BFF]" />
          <span className="font-extrabold text-[7px] text-white tracking-wider uppercase text-center leading-none">
            CLOUD<br />INFRASTRUCTURE
          </span>
        </div>
        <div className="flex flex-col items-center space-y-0.5">
          <Cpu className="w-3.5 h-3.5 text-[#168BFF]" />
          <span className="font-extrabold text-[7px] text-white tracking-wider uppercase">AI SECURITY</span>
        </div>
        <div className="flex flex-col items-center space-y-0.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#168BFF]" />
          <span className="font-extrabold text-[7px] text-white tracking-wider uppercase">GRC &amp; COMPLIANCE</span>
        </div>
      </div>

      {/* Right: Tagline & Website */}
      <div className="text-right leading-tight">
        <div className="font-extrabold text-white text-[8px] uppercase tracking-wider">
          TRUST TODAY.
        </div>
        <div className="font-extrabold text-white text-[8px] uppercase tracking-wider">
          A BRIGHTER TOMORROW.
        </div>
        <div className="text-[#168BFF] text-[7.5px] font-bold mt-0.5 tracking-wide">
          {businessProfile.website || 'www.trustlayerlabs.co.in'}
        </div>
      </div>
    </div>
  );
};

