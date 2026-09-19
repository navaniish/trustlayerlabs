import React from 'react';

interface TermsConditionsProps {
  terms?: string[];
  defaultPaymentTerms?: string;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({
  terms,
  defaultPaymentTerms,
}) => {
  const defaultTermsList = [
    defaultPaymentTerms || 'Payment Terms: 40% Advance upon acceptance, balance within 15 days of invoice.',
    'Taxes: All prices listed are subject to statutory GST rates applicable at the time of invoicing.',
    'Validity: Quotation validity is 30 calendar days from the date of issue.',
    'Intellectual Property: All custom methodology, audit tools, and assessment models remain exclusive property of TrustLayerLabs.',
    'Confidentiality: Strict non-disclosure obligations govern all vulnerability data, report findings, and client architecture.',
    'Cancellation: Project cancellation after execution commencement incurs a 25% administrative fee.',
    'Governing Law: This agreement shall be governed by and construed in accordance with the laws of India.',
  ];

  const termsToDisplay = terms && terms.length > 0 ? terms : defaultTermsList;

  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="bg-slate-900 text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider">
          TERMS & CONDITIONS
        </div>

        <div className="p-3 space-y-1.5 text-[8.5px] text-slate-700 leading-tight">
          {termsToDisplay.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-slate-900 text-white flex items-center justify-center text-[7.5px] font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
