import React from 'react';
import {
  Plus,
  Trash2,
  Save,
  Download,
  Printer,
  FileCheck,
  FileText,
  User,
  Calendar,
  DollarSign,
  ShieldCheck,
  ListPlus,
  Building,
} from 'lucide-react';
import { Client, DocumentItem, Quotation, Invoice, BusinessProfile } from '../types';

interface DocumentEditorProps {
  documentType: 'quotation' | 'invoice';
  setDocumentType: (type: 'quotation' | 'invoice') => void;
  documentNumber: string;
  setDocumentNumber: (num: string) => void;
  clientId: string;
  setClientId: (id: string) => void;
  clients: Client[];
  issueDate: string;
  setIssueDate: (date: string) => void;
  dueDateOrValidUntil: string;
  setDueDateOrValidUntil: (date: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  preparedBy: string;
  setPreparedBy: (name: string) => void;
  preparedByDesignation: string;
  setPreparedByDesignation: (title: string) => void;
  paymentTerms: string;
  setPaymentTerms: (terms: string) => void;
  reference: string;
  setReference: (ref: string) => void;
  items: DocumentItem[];
  setItems: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  globalDiscount: number;
  setGlobalDiscount: (val: number) => void;
  additionalCharges: number;
  setAdditionalCharges: (val: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  terms: string[];
  setTerms: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onNewDocument: () => void;
  onConvertToInvoice?: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  documentType,
  setDocumentType,
  documentNumber,
  setDocumentNumber,
  clientId,
  setClientId,
  clients,
  issueDate,
  setIssueDate,
  dueDateOrValidUntil,
  setDueDateOrValidUntil,
  currency,
  setCurrency,
  preparedBy,
  setPreparedBy,
  preparedByDesignation,
  setPreparedByDesignation,
  paymentTerms,
  setPaymentTerms,
  reference,
  setReference,
  items,
  setItems,
  globalDiscount,
  setGlobalDiscount,
  additionalCharges,
  setAdditionalCharges,
  notes,
  setNotes,
  terms,
  setTerms,
  onSave,
  onExportPdf,
  onPrint,
  onNewDocument,
  onConvertToInvoice,
}) => {
  const selectedClient = clients.find((c) => c.id === clientId) || clients[0];

  const handleAddItem = () => {
    const newItem: DocumentItem = {
      id: `item-${Date.now()}`,
      name: 'Security Assessment Service',
      description: 'Comprehensive vulnerability audit & penetration testing',
      deliverables: 'Executive summary report, technical findings log & remediation roadmap',
      quantity: 1,
      unit: 'Project',
      unitPrice: 50000,
      discountPercent: 0,
      taxPercent: 18,
      totalPrice: 59000,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof DocumentItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.totalPrice = (Number(updated.unitPrice) || 0) * (Number(updated.quantity) || 1);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddTerm = () => {
    setTerms((prev) => [...prev, 'New term condition item']);
  };

  const handleTermChange = (index: number, val: string) => {
    setTerms((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveTerm = (index: number) => {
    setTerms((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 text-xs font-sans">
      {/* Top Controls & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        {/* Document Type Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setDocumentType('quotation')}
            className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
              documentType === 'quotation'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quotation Mode
          </button>
          <button
            type="button"
            onClick={() => setDocumentType('invoice')}
            className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
              documentType === 'invoice'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoice Mode
          </button>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onNewDocument}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>New Document</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onExportPdf}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Download PDF</span>
          </button>

          {documentType === 'quotation' && onConvertToInvoice && (
            <button
              type="button"
              onClick={onConvertToInvoice}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Convert to Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Document Metadata */}
      <div className="space-y-3">
        <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
          <Building className="w-3.5 h-3.5" />
          <span>1. Document & Client Metadata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Client Selection */}
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Select Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.contactPerson})
                </option>
              ))}
            </select>
          </div>

          {/* Document Number */}
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">
              {documentType === 'quotation' ? 'Quote Number' : 'Invoice Number'}
            </label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">
              {documentType === 'quotation' ? 'Issue Date' : 'Invoice Date'}
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Valid Until / Due Date */}
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">
              {documentType === 'quotation' ? 'Valid Until' : 'Due Date'}
            </label>
            <input
              type="date"
              value={dueDateOrValidUntil}
              onChange={(e) => setDueDateOrValidUntil(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Reference / PO Number</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. REF-TL-2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Services / Line Items */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
            <ListPlus className="w-3.5 h-3.5" />
            <span>2. Scope of Services & Items</span>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative"
            >
              <div className="flex items-center justify-between font-bold text-slate-700 text-[11px]">
                <span>Item #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 flex items-center space-x-0.5 text-[10.5px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-5">
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Service Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Unit Price ({currency})</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">QTY</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Tax %</label>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) => handleItemChange(item.id, 'taxPercent', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-12">
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                  />
                </div>

                {documentType === 'quotation' && (
                  <div className="md:col-span-12">
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Deliverables</label>
                    <input
                      type="text"
                      value={item.deliverables || ''}
                      onChange={(e) => handleItemChange(item.id, 'deliverables', e.target.value)}
                      placeholder="e.g. Audit Report, Executive Deck, Re-test Window"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Financial Adjustments */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
          <DollarSign className="w-3.5 h-3.5" />
          <span>3. Financial Adjustments</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Global Discount ({currency})</label>
            <input
              type="number"
              value={globalDiscount}
              onChange={(e) => setGlobalDiscount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Additional Charges ({currency})</label>
            <input
              type="number"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Signatory & Notes & Terms */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
          <User className="w-3.5 h-3.5" />
          <span>4. Signatory, Terms & Notes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Prepared By Name</label>
            <input
              type="text"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1 text-[11px]">Prepared By Title</label>
            <input
              type="text"
              value={preparedByDesignation}
              onChange={(e) => setPreparedByDesignation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-bold mb-1 text-[11px]">Payment Terms Summary</label>
          <input
            type="text"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-bold mb-1 text-[11px]">Additional Notes / Client Message</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thank you for partnering with TrustLayerLabs."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
};
