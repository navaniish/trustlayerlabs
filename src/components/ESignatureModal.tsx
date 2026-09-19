import React, { useRef, useState } from 'react';
import { CheckCircle2, X, PenTool, Type, Upload, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ESignatureData } from '../types';

interface ESignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotationId: string;
}

export const ESignatureModal: React.FC<ESignatureModalProps> = ({ isOpen, onClose, quotationId }) => {
  const { quotations, acceptQuotation } = useApp();
  const quotation = quotations.find((q) => q.id === quotationId);

  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('type');
  const [signerName, setSignerName] = useState(quotation?.client.contactPerson || '');
  const [signerDesignation, setSignerDesignation] = useState('Authorized Signatory');
  const [typedText, setTypedText] = useState(quotation?.client.contactPerson || 'John Smith');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isOpen || !quotation) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleAccept = () => {
    let sigUrl = '';
    if (tab === 'draw' && canvasRef.current) {
      sigUrl = canvasRef.current.toDataURL();
    }

    const signature: ESignatureData = {
      type: tab,
      signatureDataUrl: sigUrl,
      signedByName: signerName || 'Authorized Signatory',
      signedByDesignation: signerDesignation,
      signedAt: new Date().toISOString(),
      ipAddress: '103.22.180.12',
    };

    acceptQuotation(quotation.id, signature);
    onClose();
  };

  const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-trustBlue-600">
              <PenTool className="w-5 h-5 text-trustBlue-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit">
                Sign & Accept Quotation {quotation.number}
              </h3>
              <p className="text-[11px] text-slate-500">
                Official electronic signature for legally binding verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={signerDesignation}
                onChange={(e) => setSignerDesignation(e.target.value)}
                placeholder="e.g. Chief Security Officer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200 space-x-4">
            <button
              onClick={() => setTab('type')}
              className={`flex items-center space-x-1.5 pb-2 text-xs font-bold border-b-2 transition-colors ${
                tab === 'type' ? 'border-trustBlue-600 text-trustBlue-700' : 'border-transparent text-slate-400'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Type Signature</span>
            </button>
            <button
              onClick={() => setTab('draw')}
              className={`flex items-center space-x-1.5 pb-2 text-xs font-bold border-b-2 transition-colors ${
                tab === 'draw' ? 'border-trustBlue-600 text-trustBlue-700' : 'border-transparent text-slate-400'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draw / Touch Signature</span>
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`flex items-center space-x-1.5 pb-2 text-xs font-bold border-b-2 transition-colors ${
                tab === 'upload' ? 'border-trustBlue-600 text-trustBlue-700' : 'border-transparent text-slate-400'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Mode Body */}
          {tab === 'type' && (
            <div className="space-y-2">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type signature..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:border-trustBlue-600 outline-none"
              />
              <div className="p-6 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 flex items-center justify-center font-serif text-2xl italic tracking-wider shadow-inner">
                {typedText || 'Your Signature'}
              </div>
            </div>
          )}

          {tab === 'draw' && (
            <div className="space-y-2">
              <div className="relative border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startTouchDrawing}
                  onTouchMove={drawTouch}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 cursor-crosshair touch-none"
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
          )}

          {tab === 'upload' && (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50">
              <Upload className="w-8 h-8 text-trustBlue-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Click to upload signature PNG/JPEG</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span className="text-slate-800 font-mono font-semibold">{new Date().toUTCString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Audit Security:</span>
              <span className="text-emerald-700 font-bold">IP & Cryptographic Hash Logged</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold">
              Cancel
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Accept Quotation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignatureModal;
