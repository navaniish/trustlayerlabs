import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentItem, TemplateId, Quotation, Invoice } from '../types';
import { calculatePricingSummary } from '../utils/pricingEngine';
import { exportToPdf } from '../utils/pdfGenerator';
import { DocumentEditor } from '../components/DocumentEditor';
import { DocumentPreview, PaperSize, PAPER_SIZE_CONFIG } from '../components/DocumentPreview';

export const QuotationBuilderPage: React.FC = () => {
  const {
    quotations,
    selectedQuotationId,
    clients,
    services,
    businessProfile,
    addQuotation,
    updateQuotation,
    addInvoice,
    convertQuotationToInvoice,
    setSelectedInvoiceId,
    setSelectedQuotationId,
    setActiveTab,
  } = useApp();


  const currentQuote = quotations.find((q) => q.id === selectedQuotationId) || quotations[0];

  const fallbackClient = {
    id: '',
    companyName: 'Select or Add Client',
    contactPerson: 'Primary Contact',
    email: 'contact@client.com',
    phone: '+91 98000 00000',
    billingAddress: {
      line1: 'Corporate Park',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500081',
      country: 'India',
    },
    gstin: '',
    outstandingBalance: 0,
    status: 'Active' as const,
  };

  const [documentType, setDocumentType] = useState<'quotation' | 'invoice'>('quotation');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [documentNumber, setDocumentNumber] = useState<string>(
    currentQuote?.number || 'TL-Q-2026-001'
  );
  const [clientId, setClientId] = useState<string>(currentQuote?.clientId || clients[0]?.id || '');
  const [issueDate, setIssueDate] = useState<string>(
    currentQuote?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDateOrValidUntil, setDueDateOrValidUntil] = useState<string>(
    currentQuote?.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [currency, setCurrency] = useState<string>(currentQuote?.currency || 'INR');
  const [reference, setReference] = useState<string>(currentQuote?.reference || 'REF-TL-2026');
  const [preparedBy, setPreparedBy] = useState<string>(
    currentQuote?.preparedBy || currentQuote?.salesperson || 'Alex Rivera'
  );
  const [preparedByDesignation, setPreparedByDesignation] = useState<string>(
    currentQuote?.preparedByDesignation || 'Solutions Architect'
  );
  const [paymentTerms, setPaymentTerms] = useState<string>(
    currentQuote?.paymentTerms || '40% Advance upon acceptance, balance within 15 days of invoice.'
  );
  const [items, setItems] = useState<DocumentItem[]>(currentQuote?.items || []);
  const [globalDiscount, setGlobalDiscount] = useState<number>(currentQuote?.globalDiscount || 0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(
    currentQuote?.additionalCharges || 0
  );
  const [notes, setNotes] = useState<string>(
    currentQuote?.notes || 'Thank you for choosing TrustLayerLabs for your enterprise security.'
  );
  const [terms, setTerms] = useState<string[]>(
    currentQuote?.terms || [
      'Payment Terms: 40% Advance upon acceptance, balance within 15 days of invoice.',
      'Taxes: All prices listed are subject to statutory GST rates applicable at the time of invoicing.',
      'Validity: Quotation validity is 30 calendar days from the date of issue.',
      'Intellectual Property: All custom methodology, audit tools, and assessment models remain exclusive property of TrustLayerLabs.',
      'Confidentiality: Strict non-disclosure obligations govern all vulnerability data, report findings, and client architecture.',
      'Cancellation: Project cancellation after execution commencement incurs a 25% administrative fee.',
      'Governing Law: This agreement shall be governed by and construed in accordance with the laws of India.',
    ]
  );
  const templateId: TemplateId = 'trustlayer-labs';

  useEffect(() => {
    if (currentQuote) {
      setDocumentNumber(currentQuote.number);
      setClientId(currentQuote.clientId);
      setIssueDate(currentQuote.issueDate);
      setDueDateOrValidUntil(currentQuote.validUntil);
      setCurrency(currentQuote.currency || 'INR');
      setReference(currentQuote.reference || 'REF-TL-2026');
      setPreparedBy(currentQuote.preparedBy || currentQuote.salesperson || 'Alex Rivera');
      setPreparedByDesignation(currentQuote.preparedByDesignation || 'Solutions Architect');
      setPaymentTerms(currentQuote.paymentTerms || '40% Advance upon acceptance, balance within 15 days.');
      setItems(currentQuote.items);
      setGlobalDiscount(currentQuote.globalDiscount || 0);
      setAdditionalCharges(currentQuote.additionalCharges || 0);
      setNotes(currentQuote.notes || '');
      if (currentQuote.terms) setTerms(currentQuote.terms);
    }
  }, [selectedQuotationId]);

  const selectedClient = clients.find((c) => c.id === clientId) || clients[0] || fallbackClient;
  const financials = calculatePricingSummary(items, globalDiscount, additionalCharges);

  const currencySymbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const previewDoc: Quotation | Invoice =
    documentType === 'quotation'
      ? ({
          ...currentQuote,
          number: documentNumber,
          clientId,
          client: selectedClient,
          issueDate,
          validUntil: dueDateOrValidUntil,
          currency,
          currencySymbol: currencySymbolMap[currency] || '$',
          reference,
          salesperson: preparedBy,
          preparedBy,
          preparedByDesignation,
          paymentTerms,
          items,
          financials,
          globalDiscount,
          additionalCharges,
          notes,
          terms,
          templateId,
          headerImageUrl: '/header.png',
          verification: {
            verificationId: documentNumber,
            verificationUrl: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/q/${documentNumber}`,
            hash: 'SEC-8921-HASH-TL',
            isVerified: true,
            timestamp: issueDate,
          },
        } as Quotation)
      : ({
          id: `inv-${Date.now()}`,
          number: documentNumber.startsWith('INV') ? documentNumber : `INV-${documentNumber.replace(/^TL-Q-/, '')}`,
          clientId,
          client: selectedClient,
          issueDate,
          dueDate: dueDateOrValidUntil,
          currency,
          currencySymbol: currencySymbolMap[currency] || '$',
          reference,
          salesperson: preparedBy,
          preparedBy,
          preparedByDesignation,
          paymentTerms,
          items,
          financials,
          globalDiscount,
          additionalCharges,
          amountPaid: 0,
          amountDue: financials.grandTotal,
          notes,
          terms,
          templateId,
          headerImageUrl: '/invoice.png',
          status: 'DRAFT',
          verification: {
            verificationId: documentNumber,
            verificationUrl: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/q/${documentNumber}`,
            hash: 'SEC-8921-HASH-TL',
            isVerified: true,
            timestamp: issueDate,
          },
          createdAt: issueDate,
          updatedAt: issueDate,
        } as Invoice);

  const handleSave = () => {
    if (documentType === 'quotation') {
      if (selectedQuotationId && quotations.some((q) => q.id === selectedQuotationId)) {
        updateQuotation(selectedQuotationId, {
          number: documentNumber,
          clientId,
          client: selectedClient,
          issueDate,
          validUntil: dueDateOrValidUntil,
          currency,
          currencySymbol: currencySymbolMap[currency] || '₹',
          reference,
          salesperson: preparedBy,
          preparedBy,
          preparedByDesignation,
          paymentTerms,
          items,
          financials,
          globalDiscount,
          additionalCharges,
          notes,
          terms,
          templateId,
          headerImageUrl: '/header.png',
        });
        alert(`Quotation ${documentNumber} updated and saved to database successfully!`);
      } else {
        const createdQuo = addQuotation({
          number: documentNumber,
          clientId,
          client: selectedClient,
          issueDate,
          validUntil: dueDateOrValidUntil,
          currency,
          currencySymbol: currencySymbolMap[currency] || '₹',
          reference,
          salesperson: preparedBy,
          preparedBy,
          preparedByDesignation,
          paymentTerms,
          items,
          financials,
          globalDiscount,
          additionalCharges,
          notes,
          terms,
          templateId,
          headerImageUrl: '/header.png',
          status: 'DRAFT',
        });
        setSelectedQuotationId(createdQuo.id);
        alert(`Quotation ${createdQuo.number} created and saved to database successfully!`);
      }
    } else {
      // Invoice document type
      const createdInv = addInvoice({
        number: documentNumber.startsWith('INV') ? documentNumber : `INV-${documentNumber.replace(/^(TL-Q-|TLQ-)/, '')}`,
        clientId,
        client: selectedClient,
        issueDate,
        dueDate: dueDateOrValidUntil,
        currency,
        currencySymbol: currencySymbolMap[currency] || '₹',
        reference,
        salesperson: preparedBy,
        preparedBy,
        preparedByDesignation,
        paymentTerms,
        items,
        financials,
        globalDiscount,
        additionalCharges,
        amountPaid: 0,
        amountDue: financials.grandTotal,
        notes,
        terms,
        templateId,
        headerImageUrl: '/invoice.png',
        status: 'DRAFT',
      });
      setSelectedInvoiceId(createdInv.id);
      alert(`Invoice ${createdInv.number} created and saved to database successfully!`);
    }
  };

  const handleExportPdf = () => {
    exportToPdf('document-preview-a4', documentNumber, paperSize);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewDocument = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setDocumentNumber(documentType === 'quotation' ? `TL-Q-${randomSuffix}` : `INV-${randomSuffix}`);
    setItems([
      {
        id: `item-${Date.now()}`,
        name: 'Enterprise Cybersecurity Audit & Assessment',
        description: 'Black-box penetration testing and cloud infrastructure posture review',
        deliverables: 'Executive summary report, detailed vulnerability matrix, and 14-day re-test',
        quantity: 1,
        unit: 'Project',
        unitPrice: 125000,
        discountPercent: 0,
        taxPercent: 18,
        totalPrice: 147500,
      },
    ]);
    setGlobalDiscount(0);
    setAdditionalCharges(0);
    setNotes('Thank you for partnering with TrustLayerLabs.');
  };

  const handleConvertToInvoice = () => {
    if (currentQuote) {
      setDocumentType('invoice');
      if (!documentNumber.startsWith('INV')) {
        setDocumentNumber(`INV-${documentNumber.replace(/^TL-Q-/, '')}`);
      }
      alert('Document mode updated to Invoice!');
    }
  };

  const [zoomScale, setZoomScale] = useState<number>(100);
  const [mobileMode, setMobileMode] = useState<'editor' | 'preview'>('editor');

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 15, 45));
  const handleZoomReset = () => setZoomScale(100);

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* Signature Reference Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-50/60 border border-slate-200/90 shadow-2xs relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="h-11 w-11 bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-full w-auto object-contain" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#168BFF] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{businessProfile.legalName}</span>
              </span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                GST VERIFIED ({businessProfile.gstin})
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
              TrustLayerLabs Document Suite
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10 justify-between sm:justify-end">
          <span className="text-xs font-mono font-bold text-[#168BFF] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
            {documentNumber}
          </span>
          <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#168BFF] to-indigo-600 text-white uppercase tracking-wider shadow-2xs">
            {documentType}
          </span>
        </div>
      </div>

      {/* Mobile Tab View Selector (Editor vs Live Preview) */}
      <div className="flex lg:hidden bg-slate-200 p-1 rounded-xl border border-slate-300">
        <button
          onClick={() => setMobileMode('editor')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all min-h-[44px] ${
            mobileMode === 'editor'
              ? 'bg-white text-[#168BFF] shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          DOCUMENT EDITOR
        </button>
        <button
          onClick={() => setMobileMode('preview')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all min-h-[44px] ${
            mobileMode === 'preview'
              ? 'bg-white text-[#168BFF] shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          LIVE PREVIEW &amp; ZOOM
        </button>
      </div>

      {/* Two-Column Editor & Live Preview Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Document Editor */}
        <div className={`lg:col-span-5 space-y-4 ${mobileMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <DocumentEditor
            documentType={documentType}
            setDocumentType={setDocumentType}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
            clientId={clientId}
            setClientId={setClientId}
            clients={clients}
            issueDate={issueDate}
            setIssueDate={setIssueDate}
            dueDateOrValidUntil={dueDateOrValidUntil}
            setDueDateOrValidUntil={setDueDateOrValidUntil}
            currency={currency}
            setCurrency={setCurrency}
            preparedBy={preparedBy}
            setPreparedBy={setPreparedBy}
            preparedByDesignation={preparedByDesignation}
            setPreparedByDesignation={setPreparedByDesignation}
            paymentTerms={paymentTerms}
            setPaymentTerms={setPaymentTerms}
            reference={reference}
            setReference={setReference}
            items={items}
            setItems={setItems}
            globalDiscount={globalDiscount}
            setGlobalDiscount={setGlobalDiscount}
            additionalCharges={additionalCharges}
            setAdditionalCharges={setAdditionalCharges}
            notes={notes}
            setNotes={setNotes}
            terms={terms}
            setTerms={setTerms}
            onSave={handleSave}
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
            onNewDocument={handleNewDocument}
            onConvertToInvoice={handleConvertToInvoice}
          />
        </div>

        {/* Right Column: Live Document Preview */}
        <div className={`lg:col-span-7 sticky top-4 space-y-2 ${mobileMode === 'editor' ? 'hidden lg:block' : 'block'}`}>
          {/* Preview toolbar */}
          <div className="bg-slate-900 text-white px-3 py-2 rounded-t-xl text-xs font-bold flex flex-wrap justify-between items-center gap-2 shadow-xs">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE DOCUMENT PREVIEW</span>
            </span>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={handleZoomOut}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-blue-300 w-10 text-center">{zoomScale}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[9px] font-mono text-slate-300"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>

            {/* Paper size selector pills */}
            <div className="flex items-center space-x-1">
              {(Object.entries(PAPER_SIZE_CONFIG) as [PaperSize, typeof PAPER_SIZE_CONFIG[PaperSize]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPaperSize(key)}
                  title={cfg.dims}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    paperSize === key
                      ? 'bg-[#168BFF] border-blue-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-200/90 p-2 sm:p-4 rounded-b-xl border border-slate-300 max-h-[calc(100vh-6rem)] overflow-auto flex justify-center">
            <div
              style={{
                transform: `scale(${zoomScale / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="w-full flex justify-center"
            >
              <DocumentPreview
                document={previewDoc}
                businessProfile={businessProfile}
                type={documentType}
                paperSize={paperSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
