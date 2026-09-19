import React, { useState, useEffect } from 'react';
import { Mail, X, Paperclip, Send, CheckCircle2, Download, FileText, Receipt } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToPdf } from '../utils/pdfGenerator';

export const EmailModal: React.FC = () => {
  const { isEmailModalOpen, setIsEmailModalOpen, emailModalData, businessProfile } = useApp();
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (emailModalData && businessProfile) {
      const isInvoice =
        emailModalData.type === 'invoice' || emailModalData.documentNumber.toLowerCase().includes('inv');

      const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/q/` : 'http://localhost:3001/q/';

      if (isInvoice) {
        setSubject(`Tax Invoice ${emailModalData.documentNumber} from ${businessProfile.companyName}`);
        setBody(
          `Dear Client,\n\nPlease find attached Official Tax Invoice ${emailModalData.documentNumber} for your security project from ${businessProfile.legalName}.\n\nVerified Document Portal Link:\n${baseUrl}${emailModalData.documentNumber}\n\nGSTIN: ${businessProfile.gstin}\nBank Account: ${businessProfile.bankDetails.bankName} - Account: ${businessProfile.bankDetails.accountNumber} (IFSC: ${businessProfile.bankDetails.ifscCode})\nUPI ID: ${businessProfile.upiId}\n\nPlease let us know if you have any billing queries.\n\nBest regards,\nFinance & Accounts Team\n${businessProfile.companyName}\n${businessProfile.website}`
        );
      } else {
        setSubject(`Quotation ${emailModalData.documentNumber} from ${businessProfile.companyName}`);
        setBody(
          `Dear Client,\n\nThank you for giving us the opportunity to submit our proposal.\n\nPlease find attached Quotation ${emailModalData.documentNumber} for your security assessment project.\n\nVerified Document Portal Link:\n${baseUrl}${emailModalData.documentNumber}\n\nPlease review and let us know if you have any questions or require modifications.\n\nBest regards,\nSales & Engineering Team\n${businessProfile.companyName}\n${businessProfile.website}`
        );
      }
    }
  }, [emailModalData, businessProfile]);

  if (!isEmailModalOpen || !emailModalData) return null;

  const isInvoice =
    emailModalData.type === 'invoice' || emailModalData.documentNumber.toLowerCase().includes('inv');

  const openEmailProvider = (provider: 'gmail' | 'zoho' | 'outlook' | 'mailto') => {
    // Automatically trigger PDF file generation & download into user's Downloads folder
    exportToPdf('document-preview-a4', emailModalData.documentNumber, 'a4');

    const to = encodeURIComponent(emailModalData.clientEmail);
    const su = encodeURIComponent(subject);
    const bo = encodeURIComponent(body);

    let url = '';
    if (provider === 'gmail') {
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${bo}`;
    } else if (provider === 'zoho') {
      url = `https://mail.zoho.in/zm/#mail/folder/inbox`;
    } else if (provider === 'outlook') {
      url = `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${su}&body=${bo}`;
    } else {
      url = `mailto:${emailModalData.clientEmail}?subject=${su}&body=${bo}`;
    }

    window.open(url, '_blank');
    handleSend();
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsEmailModalOpen(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl font-sans">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-trustBlue-50 text-trustBlue-600 border border-trustBlue-200">
              {isInvoice ? <Receipt className="w-5 h-5 text-trustBlue-600" /> : <Mail className="w-5 h-5 text-trustBlue-600" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit">
                {isInvoice ? `Send Invoice ${emailModalData.documentNumber} via Email` : `Send Quotation ${emailModalData.documentNumber} via Email`}
              </h3>
              <p className="text-[11px] text-slate-500">
                Dispatch verified PDF document to client contact email
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {!isSent ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email Address</label>
                <input
                  type="email"
                  value={emailModalData.clientEmail}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:border-trustBlue-600 focus:ring-2 focus:ring-trustBlue-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Body Message</label>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 font-normal leading-relaxed focus:bg-white focus:border-trustBlue-600 focus:ring-2 focus:ring-trustBlue-500/20 outline-none transition-all"
                />
              </div>

              {/* Attachment Download & Security Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-amber-700" />
                    <span className="font-extrabold text-slate-900">{emailModalData.documentNumber}_A4.pdf</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => exportToPdf('document-preview-a4', emailModalData.documentNumber, 'a4')}
                    className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Attachment</span>
                  </button>
                </div>
                <p className="text-[10.5px] leading-relaxed text-amber-900/90">
                  <strong className="text-amber-950 font-bold">📌 Webmail Portal Note:</strong> When you click any email client button below, <strong>{emailModalData.documentNumber}_A4.pdf automatically downloads to your Downloads folder</strong> — simply drag it into your email compose draft!
                </p>
              </div>

              {/* Email Provider Direct Action Choices */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Select Email Portal / Provider</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => openEmailProvider('gmail')}
                    className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <span className="font-black text-rose-600">G</span>
                    <span>Gmail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEmailProvider('zoho')}
                    className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all shadow-2xs"
                  >
                    <span className="font-black text-amber-700">Z</span>
                    <span>Zoho Mail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEmailProvider('outlook')}
                    className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <span className="font-black text-sky-600">O</span>
                    <span>Outlook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEmailProvider('mailto')}
                    className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <span>Mail App</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-99"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Dispatching...' : 'Quick Dispatch & Mark Sent'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-base font-extrabold text-slate-900 font-outfit">Email Dispatched Successfully!</h4>
              <p className="text-xs text-slate-600">
                {isInvoice ? 'Tax Invoice' : 'Quotation'} {emailModalData.documentNumber} dispatched to {emailModalData.clientEmail}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
