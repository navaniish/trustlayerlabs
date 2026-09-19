import React, { useState } from 'react';
import { Briefcase, Plus, Search, Tag, DollarSign, Layers, Pencil, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/pricingEngine';
import { ProductService } from '../types';

export const ServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService, businessProfile } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(50000);
  const [unit, setUnit] = useState<ProductService['unit']>('Project');
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [deliverables, setDeliverables] = useState('');

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setName('');
    setDescription('');
    setUnitPrice(50000);
    setUnit('Project');
    setTaxPercent(18);
    setDeliverables('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv: ProductService) => {
    setEditingServiceId(srv.id);
    setName(srv.name);
    setDescription(srv.description || '');
    setUnitPrice(srv.unitPrice);
    setUnit(srv.unit || 'Project');
    setTaxPercent(srv.taxPercent || 18);
    setDeliverables(srv.deliverables || '');
    setIsModalOpen(true);
  };

  const handleDeleteService = (srv: ProductService) => {
    if (window.confirm(`Are you sure you want to delete "${srv.name}" from the services catalog?`)) {
      deleteService(srv.id);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingServiceId) {
      updateService(editingServiceId, {
        name,
        description: description || 'Standard security assessment service.',
        unit: unit || 'Project',
        unitPrice,
        taxPercent: taxPercent || 18,
        deliverables: deliverables || 'Executive Report, Risk Register',
      });
    } else {
      addService({
        name,
        description: description || 'Standard security assessment service.',
        unit: unit || 'Project',
        unitPrice,
        taxPercent: taxPercent || 18,
        deliverables: deliverables || 'Executive Report, Risk Register',
      });
    }

    setIsModalOpen(false);
    setEditingServiceId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-4 pb-8 font-sans">
      {/* Signature Reference Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-br from-trustBlue-50 via-white to-blue-50/60 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-trustBlue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="h-12 w-12 bg-white rounded-2xl border border-slate-200/90 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-full w-auto object-contain" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-trustBlue-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{businessProfile.legalName}</span>
              </span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                GST VERIFIED ({businessProfile.gstin})
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Products &amp; Services Catalog</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Maintain reusable security assessment catalog items, default pricing, deliverables, and tax rates.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-99"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>


      {/* Search Toolbar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name or scope..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-2.5 py-1 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-trustBlue-600"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredServices.map((srv) => (
            <div key={srv.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{srv.name}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-trustBlue-50 text-trustBlue-700 border border-trustBlue-200 inline-block mt-0.5">
                      {srv.unit}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-slate-900 text-sm font-outfit">
                      {formatCurrency(srv.unitPrice)}
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">+ {srv.taxPercent || 18}% GST</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">{srv.description}</p>

                {srv.deliverables && (
                  <div className="p-2 rounded-lg bg-trustBlue-50/60 border border-trustBlue-100 text-[10px] text-trustBlue-800">
                    <span className="font-bold text-slate-900">Deliverables:</span> {srv.deliverables}
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditModal(srv)}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-trustBlue-600 hover:text-trustBlue-700 hover:bg-trustBlue-50 px-2 py-1 rounded transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteService(srv)}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
            <Briefcase className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Services Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Add Service" to create custom cybersecurity products, pricing, and scope deliverables in your catalog.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="bg-trustBlue-600 hover:bg-trustBlue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900">
                {editingServiceId ? 'Edit Product / Service' : 'Add Product / Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveService} className="p-4 space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Service Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VAPT (Web & API Penetration Testing)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive web application security assessment..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Unit Type</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as ProductService['unit'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                  >
                    <option value="Project">Project</option>
                    <option value="Month">Month</option>
                    <option value="Hour">Hour</option>
                    <option value="Day">Day</option>
                    <option value="License">License</option>
                    <option value="Unit">Unit</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Scope Deliverables</label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="Executive Report, Vulnerability Matrix, Remediation Guide"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-trustBlue-600 hover:bg-trustBlue-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                >
                  {editingServiceId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
