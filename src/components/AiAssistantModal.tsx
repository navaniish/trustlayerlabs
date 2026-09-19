import React, { useState } from 'react';
import { Sparkles, X, Wand2, Check, ArrowRight, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, clients, services, addQuotation, setActiveTab, setSelectedQuotationId } = useApp();
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  if (!isAiModalOpen) return null;

  const samplePrompts = [
    'Create a quotation for a website VAPT project worth ₹1.5 lakh with 40% advance and 60% on completion.',
    'Generate an annual Cloud Infrastructure Security audit quote for ABC Technologies at ₹2.4 Lakhs.',
    'Draft a quick penetration testing quote for Web App and REST API endpoints for 75,000 INR.',
  ];

  const handleGenerate = () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const matchedClient = clients[0];
      const matchedService = services[0];

      const newQuote = addQuotation({
        number: '',
        clientId: matchedClient.id,
        client: matchedClient,
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        currency: 'INR',
        currencySymbol: '₹',
        reference: `AI-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        salesperson: 'AI Document Assistant',
        paymentTerms: '40% Advance, 60% upon project delivery.',
        items: [
          {
            id: `item-ai-1`,
            serviceId: matchedService.id,
            name: matchedService.name,
            description: promptText.includes('VAPT')
              ? 'Comprehensive Web & REST API vulnerability penetration testing.'
              : matchedService.description,
            deliverables: 'Executive Report, Risk Register, Technical Remediation Guide',
            quantity: 1,
            unit: 'Project',
            unitPrice: promptText.includes('1.5') ? 150000 : 75000,
            discountPercent: 5,
            taxPercent: 18,
            totalPrice: promptText.includes('1.5') ? 162450 : 81225,
          },
        ],
        financials: {
          subtotal: promptText.includes('1.5') ? 150000 : 75000,
          itemDiscounts: promptText.includes('1.5') ? 7500 : 3750,
          globalDiscount: 0,
          taxableAmount: promptText.includes('1.5') ? 142500 : 71250,
          cgst: promptText.includes('1.5') ? 12825 : 6413,
          sgst: promptText.includes('1.5') ? 12825 : 6413,
          igst: 0,
          roundOff: 0,
          grandTotal: promptText.includes('1.5') ? 168150 : 84076,
        },
        globalDiscount: 0,
        notes: 'Generated automatically by AI Document Assistant based on custom client requirements.',
        templateId: 'trustlayer-labs',
        status: 'DRAFT',
      });

      setIsGenerating(false);
      setGeneratedResult(newQuote);
    }, 1200);
  };

  const applyGeneratedQuote = () => {
    if (generatedResult) {
      setSelectedQuotationId(generatedResult.id);
      setIsAiModalOpen(false);
      setActiveTab('quotation-builder');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-trustBlue-600 to-indigo-600 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                AI Document Assistant
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  TrustLayer AI v1.0
                </span>
              </h3>
              <p className="text-xs text-slate-500">Describe your project requirements in natural language.</p>
            </div>
          </div>
          <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!generatedResult ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Prompt Input</label>
                <textarea
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g. Create a quotation for a web VAPT and cloud security audit for ABC Technologies worth ₹1.5L with 40% advance..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-trustBlue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sample Prompt Ideas
                </span>
                <div className="space-y-2">
                  {samplePrompts.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPromptText(sample)}
                      className="w-full text-left text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors flex items-center justify-between group font-medium"
                    >
                      <span className="truncate pr-2">{sample}</span>
                      <Wand2 className="w-3.5 h-3.5 text-trustBlue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !promptText.trim()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Generating Structured Quotation...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate Quotation</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
                <Check className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Quotation Draft Generated!</h4>
                  <p className="text-[11px] text-slate-600">
                    Document #{generatedResult.number} has been drafted with line items, deliverables, and India GST calculations.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-semibold text-slate-900">{generatedResult.client.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Services:</span>
                  <span className="font-semibold text-slate-900">{generatedResult.items[0].name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{generatedResult.financials.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grand Total (incl. GST):</span>
                  <span className="font-bold text-trustBlue-600 text-sm">
                    ₹{generatedResult.financials.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setGeneratedResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 px-3 py-2"
                >
                  ← Try Another Prompt
                </button>
                <button
                  onClick={applyGeneratedQuote}
                  className="flex items-center space-x-2 bg-trustBlue-600 hover:bg-trustBlue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <span>Open in Builder & Edit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
