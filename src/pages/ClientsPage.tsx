import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  Edit3,
  Trash2,
  Receipt,
  Globe,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dbService, STORES } from '../services/db';

export const ClientsPage: React.FC = () => {
  const { clients, addClient, updateClient, openEmailModal, setActiveTab, businessProfile } = useApp();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('Hyderabad');

  const filteredClients = clients.filter(
    (c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingClientId(null);
    setCompanyName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setGstin('');
    setCity('Hyderabad');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: (typeof clients)[0]) => {
    setEditingClientId(client.id);
    setCompanyName(client.companyName);
    setContactPerson(client.contactPerson);
    setEmail(client.email);
    setPhone(client.phone);
    setGstin(client.gstin || '');
    setCity(client.billingAddress.city || 'Hyderabad');
    setIsModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    if (editingClientId) {
      updateClient(editingClientId, {
        companyName,
        contactPerson: contactPerson || 'Primary Contact',
        email: email || 'contact@client.com',
        phone: phone || '+91 98000 00000',
        billingAddress: {
          line1: 'Corporate Park',
          city,
          state: 'Telangana',
          pin: '500001',
          country: 'India',
        },
        gstin,
      });
    } else {
      addClient({
        companyName,
        contactPerson: contactPerson || 'Primary Contact',
        email: email || 'contact@client.com',
        phone: phone || '+91 98000 00000',
        billingAddress: {
          line1: 'Corporate Park',
          city,
          state: 'Telangana',
          pin: '500001',
          country: 'India',
        },
        gstin,
        outstandingBalance: 0,
        status: 'Active',
      });
    }

    setIsModalOpen(false);
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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Client Directory & Management</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Maintain enterprise customer details, billing profiles, and GSTIN records.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-99"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>


      {/* Search Toolbar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or contact person..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-trustBlue-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-outfit">{client.companyName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {client.contactPerson} ({client.designation || 'Primary Contact'})
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {client.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {client.billingAddress.city}, {client.billingAddress.state}
                  </span>
                </div>
                {client.gstin && (
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5">GSTIN: {client.gstin}</div>
                )}
              </div>
            </div>

            {/* Micro Action Toolbar Layout */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Due: <span className="text-amber-600 font-mono">₹{client.outstandingBalance.toLocaleString()}</span>
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(client)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-trustBlue-700 font-bold text-[11px] transition-all shadow-2xs"
                  title="Edit Client Information"
                >
                  <Edit3 className="w-3.5 h-3.5 text-trustBlue-600" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEmailModal('CLIENT-DOC', client.email, 'quotation')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] transition-all shadow-2xs"
                  title="Email Client"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl font-sans">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit">
                {editingClientId ? 'Edit Client Profile' : 'Add Enterprise Client'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Cyber Systems Pvt Ltd"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@acme.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">GSTIN</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="36AABCA1234F1ZM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs"
                >
                  {editingClientId ? 'Update Client' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
