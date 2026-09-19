import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  User,
  FileText,
  Layers,
  Calculator,
  PenTool,
  Building2,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar,
  Clock,
  UserCheck,
  Quote,
} from 'lucide-react';
import { Quotation, Invoice, BusinessProfile } from '../types';
import { formatCurrency } from '../utils/pricingEngine';
import { DocumentFooter } from './DocumentFooter';

export type PaperSize = 'a4' | 'a3' | 'legal';

export const PAPER_SIZE_CONFIG: Record<PaperSize, { label: string; dims: string; cssClass: string }> = {
  a4:    { label: 'A4',       dims: '210mm × 297mm (2 Pages)', cssClass: 'doc-a4' },
  a3:    { label: 'A3',       dims: '297mm × 420mm (1 Page)',  cssClass: 'doc-a3' },
  legal: { label: 'US Legal', dims: '215.9mm × 355.6mm',       cssClass: 'doc-legal' },
};

interface DocumentPreviewProps {
  document: Quotation | Invoice;
  businessProfile: BusinessProfile;
  type?: 'quotation' | 'invoice';
  paperSize?: PaperSize;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  businessProfile,
  type = 'quotation',
  paperSize = 'a4',
}) => {
  const isQuotation = type === 'invoice' ? false : (type === 'quotation' || 'validUntil' in document);
  const docTitle = isQuotation ? 'QUOTATION' : 'INVOICE';
  const { cssClass } = PAPER_SIZE_CONFIG[paperSize];
  const docNumber = document.number;
  const fmt = (val: number) => formatCurrency(val, document.currency);

  // 1. TOP HEADER BANNER
  const renderHeaderBanner = () => {
    const headerSrc = !isQuotation
      ? '/invoice.png'
      : (document.headerImageUrl || businessProfile.headerImageUrl || '/header.png');

    return headerSrc ? (
      <div className="w-full relative border-b-2 border-blue-200 bg-white overflow-hidden">
        <img
          src={headerSrc}
          alt="Header Banner"
          className="w-full h-auto block"
        />
        {/* Perfectly aligned QR code overlay matching shield vector placeholder */}
        <div className="absolute top-[12%] right-[13.3%] flex flex-col items-center z-20">
          <div className="border-2 border-[#07111C] rounded-lg overflow-hidden bg-white shadow-xl">
            <div className="bg-[#07111C] text-white w-full py-0.5 px-2.5 text-center text-[7px] font-black tracking-[0.15em] uppercase border-b border-[#07111C]">
              SCAN TO VERIFY
            </div>
            <div className="p-1 bg-white flex items-center justify-center">
              <QRCodeSVG
                value={`https://verify.trustlayerlabs.com/${docNumber}`}
                size={52}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
          <div className="mt-0.5 text-center leading-tight">
            <div className="text-[6.5px] font-black text-[#07111C] uppercase tracking-[0.14em]">AUTHENTIC</div>
            <div className="text-[6.5px] font-black text-[#168BFF] uppercase tracking-[0.14em]">{docTitle}</div>
          </div>
        </div>
      </div>
    ) : (
      <div className="relative px-7 pt-5 pb-5 border-b-2 border-blue-200 bg-white">
        <div className="flex justify-between items-start relative z-10">
          <div className="text-[9px] font-extrabold text-[#0f2044] tracking-wider uppercase leading-snug min-w-[65px]">
            <div>SECURE</div>
            <div>TODAY</div>
            <div>BRIGHTER</div>
            <div className="text-blue-600">TOMORROW</div>
            <div className="h-0.5 w-7 bg-blue-500 mt-1" />
          </div>

          <div className="flex flex-col items-center text-center flex-1 px-4">
            <img
              src="/ttlslogo.png"
              alt="TrustLayerLabs"
              className="h-20 w-auto object-contain mb-1 max-w-[280px]"
            />
            <div className="flex items-center space-x-2 mt-1 mb-1">
              <div className="h-px w-10 bg-blue-400" />
              <span className="text-[8px] font-extrabold tracking-[0.2em] text-[#0f2044] uppercase">
                OFFICIAL {docTitle}
              </span>
              <div className="h-px w-10 bg-blue-400" />
            </div>
            <h1 className="text-[34px] font-black tracking-[0.18em] text-[#0f2044] uppercase leading-none">
              {docTitle}
            </h1>
            <p className="text-[8px] font-bold tracking-[0.15em] text-slate-500 uppercase mt-1">
              SECURE SOLUTIONS FOR A SAFER TOMORROW
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="border-2 border-[#07111C] rounded-lg overflow-hidden bg-white shadow-xl">
              <div className="bg-[#07111C] text-white w-full py-1 px-3 text-center text-[7.5px] font-black tracking-[0.15em] uppercase border-b border-[#07111C]">
                SCAN TO VERIFY
              </div>
              <div className="p-1.5 bg-white flex items-center justify-center">
                <QRCodeSVG
                  value={`https://verify.trustlayerlabs.com/${docNumber}`}
                  size={58}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
            <div className="mt-1 text-center leading-tight">
              <div className="text-[7px] font-black text-[#07111C] uppercase tracking-[0.16em]">AUTHENTIC</div>
              <div className="text-[7px] font-black text-[#168BFF] uppercase tracking-[0.16em]">{docTitle}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. CLIENT INFORMATION & DOCUMENT DETAILS
  const renderClientAndDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* CLIENT INFORMATION */}
      <div className="rounded-lg border border-[#D6E3EF] overflow-hidden bg-white shadow-xs">
        <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex items-center space-x-2 text-[9.5px] font-bold uppercase tracking-wider border-b border-[#0B4F8A]">
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-white" />
          </div>
          <span>CLIENT INFORMATION</span>
        </div>
        <div className="divide-y divide-[#D6E3EF]">
          {[
            { icon: <Building2 className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Company Name', value: document.client.companyName },
            { icon: <User className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Contact Person', value: document.client.contactPerson },
            { icon: <Briefcase className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Designation', value: document.client.designation || 'Authorized Executive' },
            { icon: <Mail className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Official Email', value: document.client.email },
            { icon: <Phone className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Phone Number', value: document.client.phone },
            {
              icon: <MapPin className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />,
              label: 'Billing Address',
              value: [document.client.billingAddress?.line1, document.client.billingAddress?.city, document.client.billingAddress?.state]
                .filter(Boolean)
                .join(', '),
            },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex items-center px-3 py-2 text-[8.5px] leading-relaxed min-h-[30px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F9FD]'}`}
            >
              <div className="w-[40%] flex items-center space-x-1.5 font-semibold text-[#172B4D] shrink-0">
                {row.icon}
                <span>{row.label}</span>
              </div>
              <span className="w-[4%] text-[#667085] text-center font-bold shrink-0">:</span>
              <span className="w-[56%] font-medium text-[#172B4D] break-words pl-1">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* QUOTATION / INVOICE DETAILS */}
      <div className="rounded-lg border border-[#D6E3EF] overflow-hidden bg-white shadow-xs">
        <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex items-center space-x-2 text-[9.5px] font-bold uppercase tracking-wider border-b border-[#0B4F8A]">
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0">
            <FileText className="w-3 h-3 text-white" />
          </div>
          <span>{isQuotation ? 'QUOTATION DETAILS' : 'INVOICE DETAILS'}</span>
        </div>
        <div className="divide-y divide-[#D6E3EF]">
          {[
            { icon: <Hash className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Document Number', value: docNumber },
            { icon: <Calendar className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Issue Date', value: document.issueDate },
            {
              icon: <Clock className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />,
              label: isQuotation ? 'Valid Until' : 'Due Date',
              value: isQuotation ? (document as Quotation).validUntil : (document as Invoice).dueDate,
            },
            {
              icon: <UserCheck className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />,
              label: 'Prepared By',
              value: document.preparedBy || document.salesperson || 'Solutions Consultant',
            },
            { icon: <Mail className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Official Email', value: businessProfile.email },
            { icon: <Phone className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />, label: 'Phone Number', value: businessProfile.phone },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex items-center px-3 py-2 text-[8.5px] leading-relaxed min-h-[30px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F9FD]'}`}
            >
              <div className="w-[40%] flex items-center space-x-1.5 font-semibold text-[#172B4D] shrink-0">
                {row.icon}
                <span>{row.label}</span>
              </div>
              <span className="w-[4%] text-[#667085] text-center font-bold shrink-0">:</span>
              <span className="w-[56%] font-medium text-[#172B4D] break-words pl-1">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 3. SCOPE OF WORK / SERVICES TABLE
  const renderScopeTable = () => (
    <div className="rounded-lg border border-[#D6E3EF] overflow-hidden bg-white shadow-xs">
      <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wider border-b border-[#0B4F8A]">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0">
            <Layers className="w-3 h-3 text-white" />
          </div>
          <span>SCOPE OF WORK / SERVICES</span>
        </div>
        <span className="text-[8px] font-mono text-blue-200 hidden sm:inline">SWIPE FOR FULL COLUMNS →</span>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[620px] text-left border-collapse text-[8.5px] leading-relaxed">
          <thead>
            <tr className="bg-[#07111C] text-white font-bold uppercase border-b border-[#D6E3EF]">
              <th className="py-2.5 px-2 text-center w-8 border-r border-white/20 align-middle">#</th>
              {isQuotation ? (
                <>
                  <th className="py-2.5 px-3 border-r border-white/20 w-36 align-middle">SERVICE / SOLUTION</th>
                  <th className="py-2.5 px-3 border-r border-white/20 align-middle">DESCRIPTION</th>
                  <th className="py-2.5 px-3 border-r border-white/20 w-32 align-middle">DELIVERABLES</th>
                  <th className="py-2.5 px-2 text-center w-10 border-r border-white/20 align-middle">QTY</th>
                  <th className="py-2.5 px-3 text-right w-24 border-r border-white/20 align-middle">UNIT PRICE ({document.currency})</th>
                  <th className="py-2.5 px-3 text-right w-26 bg-[#0B4F8A] align-middle">TOTAL ({document.currency})</th>
                </>
              ) : (
                <>
                  <th className="py-2.5 px-3 border-r border-white/20 align-middle">DESCRIPTION</th>
                  <th className="py-2.5 px-2 text-center w-10 border-r border-white/20 align-middle">QTY</th>
                  <th className="py-2.5 px-3 text-right w-24 border-r border-white/20 align-middle">UNIT PRICE ({document.currency})</th>
                  <th className="py-2.5 px-2 text-center w-12 border-r border-white/20 align-middle">TAX</th>
                  <th className="py-2.5 px-3 text-right w-26 bg-[#0B4F8A] align-middle">AMOUNT ({document.currency})</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D6E3EF]">
            {document.items.length === 0 ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F9FD]'}>
                  <td className="py-3 px-2 border-r border-[#D6E3EF] text-center text-[#667085]">{String(idx + 1).padStart(2, '0')}</td>
                  {isQuotation ? (
                    <>
                      <td className="py-3 px-3 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-3 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-3 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-2 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-3 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-3 bg-[#F5F9FD]" />
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-3 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-2 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-3 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-2 border-r border-[#D6E3EF]" />
                      <td className="py-3 px-3 bg-[#F5F9FD]" />
                    </>
                  )}
                </tr>
              ))
            ) : (
              document.items.map((item, idx) => {
                const lineTotal = item.unitPrice * item.quantity;
                const lineTax = lineTotal * ((item.taxPercent || 0) / 100);
                return (
                  <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-white hover:bg-[#EAF4FF]' : 'bg-[#F5F9FD] hover:bg-[#EAF4FF]'}>
                    <td className="py-3 px-2 text-center font-bold text-[#667085] border-r border-[#D6E3EF] align-middle">{String(idx + 1).padStart(2, '0')}</td>
                    {isQuotation ? (
                      <>
                        <td className="py-3 px-3 font-bold text-[#07111C] border-r border-[#D6E3EF] align-middle">{item.name}</td>
                        <td className="py-3 px-3 text-[#172B4D] leading-relaxed border-r border-[#D6E3EF] align-middle">{item.description}</td>
                        <td className="py-3 px-3 text-[#667085] border-r border-[#D6E3EF] text-[8px] leading-relaxed align-middle">{item.deliverables || 'Full scope documentation'}</td>
                        <td className="py-3 px-2 text-center font-bold text-[#172B4D] border-r border-[#D6E3EF] align-middle">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-semibold text-[#07111C] border-r border-[#D6E3EF] align-middle">{fmt(item.unitPrice)}</td>
                        <td className="py-3 px-3 text-right font-semibold text-[#07111C] bg-[#F5F9FD] align-middle">{fmt(lineTotal)}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-3 border-r border-[#D6E3EF] align-middle">
                          <div className="font-bold text-[#07111C]">{item.name}</div>
                          <div className="text-[#667085] text-[8px] leading-relaxed">{item.description}</div>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-[#172B4D] border-r border-[#D6E3EF] align-middle">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-semibold text-[#07111C] border-r border-[#D6E3EF] align-middle">{fmt(item.unitPrice)}</td>
                        <td className="py-3 px-2 text-center text-[#172B4D] border-r border-[#D6E3EF] align-middle">{item.taxPercent || 18}%</td>
                        <td className="py-3 px-3 text-right font-semibold text-[#07111C] bg-[#F5F9FD] align-middle">{fmt(lineTotal + lineTax)}</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 4. TERMS & CONDITIONS & FINANCIAL SUMMARY
  const renderTermsAndFinancials = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
      {/* LEFT: Terms & Conditions */}
      <div className="lg:col-span-7 rounded-lg border border-[#D6E3EF] overflow-hidden flex flex-col bg-white shadow-xs">
        <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex items-center space-x-2 text-[9.5px] font-bold uppercase tracking-wider border-b border-[#0B4F8A]">
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
          <span>TERMS &amp; CONDITIONS</span>
        </div>
        <div className="p-3 space-y-2 text-[8px] text-[#172B4D] leading-relaxed flex-1 bg-white divide-y divide-[#F5F9FD]">
          {(document.terms && document.terms.length > 0
            ? document.terms
            : [
                (document.paymentTerms || 'Payment Terms: 40% Advance upon acceptance, balance within 15 days of invoice.'),
                'Taxes: All prices listed are subject to statutory GST rates applicable at the time of invoicing.',
                'Validity: Quotation validity is 30 calendar days from the date of issue.',
                'Intellectual Property: All custom methodology, audit tools, and assessment models remain exclusive property of TrustLayerLabs.',
                'Confidentiality: Strict non-disclosure obligations govern all vulnerability data, report findings, and client architecture.',
                'Cancellation: Project cancellation after execution commencement incurs a 25% administrative fee.',
                'Governing Law: This agreement shall be governed by and construed in accordance with the laws of India.',
              ]
          ).map((t, i) => (
            <div key={i} className="flex items-start space-x-2.5 pt-2 first:pt-0">
              <svg className="w-4 h-4 min-w-[16px] shrink-0 mt-0.5" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8" fill="#168BFF" />
                <text
                  x="8"
                  y="8.5"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="800"
                  fontFamily="'Inter', system-ui, sans-serif"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {i + 1}
                </text>
              </svg>
              <span className="font-medium text-[#172B4D] leading-relaxed flex-1">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Financial Summary */}
      <div className="lg:col-span-5 space-y-2.5">
        <div className="rounded-lg border border-[#D6E3EF] overflow-hidden bg-white shadow-xs">
          <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex items-center space-x-2 text-[9.5px] font-bold uppercase tracking-wider border-b border-[#0B4F8A]">
            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0">
              <Calculator className="w-3.5 h-3.5 text-white" />
            </div>
            <span>FINANCIAL SUMMARY</span>
          </div>
          <div className="p-2.5 bg-white space-y-1.5 text-[8.5px]">
            <div className="flex justify-between border-b border-[#D6E3EF] pb-1.5 bg-white px-1">
              <span className="text-[#172B4D] font-semibold">Subtotal</span>
              <span className="font-bold text-[#07111C]">{fmt(document.financials.subtotal)}</span>
            </div>
            {document.financials.globalDiscount > 0 && (
              <div className="flex justify-between border-b border-[#D6E3EF] pb-1.5 bg-[#F5F9FD] px-1 py-1 rounded-sm">
                <span className="text-[#172B4D] font-semibold">Discount</span>
                <span className="text-[#168BFF] font-bold">- {fmt(document.financials.globalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-[#D6E3EF] pb-1.5 bg-white px-1">
              <span className="text-[#172B4D] font-semibold">Tax ({document.items[0]?.taxPercent || 18}%)</span>
              <span className="font-bold text-[#07111C]">{fmt(document.financials.cgst + document.financials.sgst + document.financials.igst)}</span>
            </div>
            {(document.financials.additionalCharges || 0) > 0 && (
              <div className="flex justify-between border-b border-[#D6E3EF] pb-1.5 bg-[#F5F9FD] px-1 py-1 rounded-sm">
                <span className="text-[#172B4D] font-semibold">Additional Charges</span>
                <span className="font-bold text-[#07111C]">{fmt(document.financials.additionalCharges || 0)}</span>
              </div>
            )}
            {/* Grand Total Row */}
            <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex justify-between items-center rounded-md mt-1.5 shadow-xs border border-[#0B4F8A]">
              <span className="font-black text-[10px] uppercase tracking-wider">Grand Total ({document.currency})</span>
              <span className="font-black text-[14px] text-white">{fmt(document.financials.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Quote box */}
        <div className="p-2.5 rounded-lg bg-[#F5F9FD] border border-[#D6E3EF] flex items-start space-x-2 text-[8.5px]">
          <Quote className="w-4 h-4 text-[#168BFF] shrink-0 mt-0.5" />
          <div>
            <p className="italic font-bold text-[#07111C]">&ldquo;Trusted technology for a safer tomorrow.&rdquo;</p>
            <p className="text-[8px] text-[#667085] font-semibold mt-0.5">&mdash; TrustLayerLabs</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 5. ACCEPTANCE & SIGN-OFF
  const renderAcceptance = () => (
    <div className="rounded-lg border border-[#D6E3EF] overflow-hidden flex flex-col sm:flex-row bg-white shadow-xs">
      <div className="w-full sm:w-4/5 border-b sm:border-b-0 sm:border-r border-[#D6E3EF]">
        <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-3 py-2 flex items-center space-x-2 text-[9.5px] font-bold uppercase tracking-wider border-b border-[#0B4F8A]">
          <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0">
            <PenTool className="w-3.5 h-3.5 text-white" />
          </div>
          <span>ACCEPTANCE &amp; SIGN-OFF</span>
        </div>
        <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-5 text-[8.5px]">
          {/* For TrustLayerLabs */}
          <div className="space-y-1.5">
            <div className="font-black text-[#07111C] text-[9.5px] uppercase tracking-wider border-b border-[#D6E3EF] pb-1">For TrustLayerLabs</div>
            {[
              { label: 'Name', value: document.preparedBy || document.salesperson || 'Alex Rivera' },
              { label: 'Title', value: document.preparedByDesignation || 'Solutions Consultant' },
              { label: 'Signature', value: <span className="font-serif italic font-bold text-[#0B4F8A] border-b border-[#0B4F8A] pb-0.5 inline-block">{document.preparedBy || 'Alex Rivera'}</span> },
              { label: 'Date', value: document.issueDate },
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-12 items-center">
                <span className="col-span-4 text-[#667085] font-semibold">{r.label}</span>
                <span className="col-span-1 text-[#667085] font-bold text-center">:</span>
                <span className="col-span-7 text-[#172B4D] font-medium">{r.value}</span>
              </div>
            ))}
          </div>

          {/* For Client */}
          <div className="space-y-1.5">
            <div className="font-black text-[#07111C] text-[9.5px] uppercase tracking-wider border-b border-[#D6E3EF] pb-1">For Client</div>
            {[
              { label: 'Name', value: document.client.contactPerson },
              { label: 'Title', value: document.client.designation || 'Authorized Representative' },
              {
                label: 'Signature',
                value: 'signature' in document && (document as Quotation).signature ? (
                  <span className="font-serif italic font-bold text-[#168BFF] border-b border-[#168BFF] pb-0.5 inline-block">{(document as Quotation).signature?.signedByName} ✓</span>
                ) : (
                  <span className="text-[#667085] border-b border-[#667085] pb-0.5 inline-block min-w-[120px]">&nbsp;</span>
                ),
              },
              {
                label: 'Date',
                value: 'signature' in document && (document as Quotation).signature?.signedAt
                  ? (document as Quotation).signature?.signedAt.split('T')[0]
                  : '____________________',
              },
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-12 items-center">
                <span className="col-span-4 text-[#667085] font-semibold">{r.label}</span>
                <span className="col-span-1 text-[#667085] font-bold text-center">:</span>
                <span className="col-span-7 text-[#172B4D] font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-1/5 bg-[#F5F9FD] p-3 flex flex-col justify-center items-center text-center shrink-0">
        <span className="text-[8.5px] font-black text-[#07111C] tracking-wider leading-snug uppercase">
          LET&rsquo;S BUILD A SAFER TOMORROW TOGETHER.
        </span>
        <div className="h-0.5 w-7 bg-[#168BFF] mt-2" />
      </div>
    </div>
  );

  // ==================================================================
  // MODE 1: A4 MULTI-PAGE RENDER (EXACT PAGE 1 & PAGE 2 BREAK)
  // ==================================================================
  if (paperSize === 'a4') {
    return (
      <div id="document-preview-a4" className="flex flex-col items-center space-y-6 font-sans">
        {/* PAGE 1 */}
        <div
          id="doc-preview-page-1"
          className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden border border-[#D0E1F9] mx-auto"
          style={{ color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeaderBanner()}
              <div className="px-5 py-4 space-y-3.5 bg-white">
                {renderClientAndDetails()}
                {renderScopeTable()}
              </div>
            </div>

            <div className="px-5 py-2.5 bg-[#F5F9FD] border-t border-[#D6E3EF] flex justify-between items-center text-[8px] font-bold text-[#667085] uppercase">
              <span>TrustLayerLabs — Official {docTitle} ({docNumber})</span>
              <span className="text-[#168BFF] font-extrabold">Page 1 of 2</span>
            </div>
          </div>
        </div>

        {/* VISUAL PAGE BREAK INDICATOR */}
        <div className="no-print my-1 py-1.5 px-6 bg-[#07111C] text-[#168BFF] text-[8.5px] font-bold text-center tracking-widest uppercase rounded-full flex items-center justify-center space-x-3 border border-[#0B4F8A] shadow-md">
          <span className="text-white font-extrabold">PAGE 1 END</span>
          <span className="text-[#168BFF]">━━━ A4 2-PAGE PRINT / PDF BREAK ━━━</span>
          <span className="text-white font-extrabold">PAGE 2 START</span>
        </div>

        {/* PAGE 2 */}
        <div
          id="doc-preview-page-2"
          className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden border border-[#D0E1F9] mx-auto"
          style={{ color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex-1 flex flex-col justify-between">
            <div className="bg-gradient-to-r from-[#07111C] to-[#0B4F8A] text-white px-5 py-2 flex justify-between items-center text-[8.5px] border-b border-[#0B4F8A]">
              <div className="flex items-center space-x-2">
                <img
                  src="/ttlslogo-dark.png"
                  alt="TrustLayerLabs"
                  className="h-5 w-auto object-contain"
                  style={{ height: '20px', maxHeight: '20px' }}
                />
                <span className="font-extrabold text-white uppercase tracking-wider pl-2 border-l border-white/20">
                  {docTitle} — {docNumber}
                </span>
              </div>
              <span className="text-[#168BFF] font-black uppercase tracking-wider">Page 2 of 2</span>
            </div>

            <div className="px-5 py-4 space-y-3.5 bg-white flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                {renderTermsAndFinancials()}
                {renderAcceptance()}
              </div>
            </div>
          </div>

          <DocumentFooter businessProfile={businessProfile} />
        </div>
      </div>
    );
  }

  // ==================================================================
  // MODE 2: A3 / SINGLE PAGE FIT RENDER
  // ==================================================================
  return (
    <div
      id="document-preview-a4"
      className={`${cssClass} p-0 flex flex-col justify-between text-xs font-sans bg-white overflow-hidden relative mx-auto border border-[#D0E1F9] shadow-2xl`}
      style={{ color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
    >
      <div>
        {renderHeaderBanner()}
        <div className="px-5 py-4 space-y-3.5 bg-white">
          {renderClientAndDetails()}
          {renderScopeTable()}
          {renderTermsAndFinancials()}
          {renderAcceptance()}
        </div>
      </div>
      <DocumentFooter businessProfile={businessProfile} />
    </div>
  );
};
