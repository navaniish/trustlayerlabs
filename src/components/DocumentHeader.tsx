import React from 'react';

export const DocumentHeader: React.FC = () => {
  return (
    <div className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/ttlslogo.png"
          alt="TrustLayerLabs Logo"
          className="h-20 w-auto object-contain max-w-[320px]"
        />
      </div>
    </div>
  );
};
