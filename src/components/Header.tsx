import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Search,
  Sparkles,
  Plus,
  Bell,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Laptop,
  Settings,
  FileText,
  Receipt,
  Users,
  Briefcase,
  X,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    setIsAiModalOpen,
    setActiveTab,
    quotations,
    invoices,
    clients,
    services,
    setSelectedQuotationId,
    setSelectedInvoiceId,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const { user, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search matches using types/index.ts schema
  const qClean = searchQuery.trim().toLowerCase();
  
  const matchedQuotations = qClean
    ? quotations.filter(
        (q) =>
          q.number.toLowerCase().includes(qClean) ||
          (q.client?.companyName || '').toLowerCase().includes(qClean) ||
          (q.items?.[0]?.name || q.reference || '').toLowerCase().includes(qClean) ||
          q.status.toLowerCase().includes(qClean)
      )
    : [];

  const matchedInvoices = qClean
    ? invoices.filter(
        (inv) =>
          inv.number.toLowerCase().includes(qClean) ||
          (inv.client?.companyName || '').toLowerCase().includes(qClean) ||
          inv.status.toLowerCase().includes(qClean)
      )
    : [];

  const matchedClients = qClean
    ? clients.filter(
        (c) =>
          c.companyName.toLowerCase().includes(qClean) ||
          (c.contactPerson || '').toLowerCase().includes(qClean) ||
          c.email.toLowerCase().includes(qClean) ||
          (c.gstin && c.gstin.toLowerCase().includes(qClean))
      )
    : [];

  const matchedServices = qClean
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(qClean) ||
          s.description.toLowerCase().includes(qClean)
      )
    : [];

  const totalMatches =
    matchedQuotations.length +
    matchedInvoices.length +
    matchedClients.length +
    matchedServices.length;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Security Session Verified',
      desc: 'Argon2id session active for ' + (user?.email || 'ceo@trustlayerlabs.co.in'),
      time: 'Just now',
      type: 'security',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Pending Quotation Action',
      desc: `${quotations.filter((q) => q.status === 'SENT').length} quotations awaiting client signature`,
      time: '15 mins ago',
      type: 'quotation',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Audit Trail Timestamped',
      desc: 'SHA-256 cryptographic verification logged',
      time: '1 hour ago',
      type: 'audit',
      unread: false,
    },
  ];

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    setActiveTab('auth');
  };

  const currentUserName = user?.name || 'Executive Director & CEO';
  const currentUserEmail = user?.email || 'ceo@trustlayerlabs.co.in';
  const currentUserRole = user?.role || 'SUPER_ADMIN';

  return (
    <header className="h-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-2xs font-sans">
      {/* Mobile Top-Left: Menu Drawer Button */}
      <div className="flex md:hidden items-center space-x-2 shrink-0">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 touch-target flex items-center space-x-2 font-bold text-xs shadow-2xs"
          title="Open Workspace Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-[#168BFF]" /> : <Menu className="w-5 h-5 text-slate-700" />}
          <span className="font-outfit font-extrabold text-slate-900 text-xs">MENU</span>
        </button>
      </div>

      {/* Desktop/Tablet Left: Brand Logo & Title */}
      <div className="hidden md:flex items-center space-x-3 shrink-0">
        <div
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => {
            setSearchQuery('');
            setIsSearchOpen(false);
            setActiveTab('dashboard');
          }}
          title="Return to Dashboard"
        >
          <div className="h-12 flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs group-hover:border-blue-400 transition-colors">
            <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg font-sans">
                TrustLayer<span className="text-[#168BFF]">Docs</span>
              </span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#168BFF] border border-blue-200 uppercase tracking-wider">
                VERIFIED
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tight">
              TrustLayerLabs Enterprise Suite
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Live Search Bar in Middle */}
      <div className="flex-1 max-w-xl mx-4 hidden md:flex justify-center" ref={searchRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSearchOpen(false);
              }
            }}
            placeholder="Search quotations, invoices, clients, or services..."
            className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#168BFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Live Search Results Overlay Dropdown */}
          {isSearchOpen && qClean.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans animate-fadeIn">
              {/* Dropdown Header */}
              <div className="p-3 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#168BFF]" />
                  <span>Search Results ({totalMatches})</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Press Esc to close</span>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {/* Quotations Section */}
                {matchedQuotations.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#168BFF]" />
                      <span>Quotations ({matchedQuotations.length})</span>
                    </div>
                    {matchedQuotations.slice(0, 3).map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          setSelectedQuotationId(q.id);
                          setActiveTab('quotation-builder');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#168BFF] flex items-center gap-1.5">
                            <span>{q.number}</span>
                            <span className="text-[10px] font-mono text-slate-500">• {q.client?.companyName || 'Client'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[260px]">
                            {q.items?.[0]?.name || q.reference || 'Quotation'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-slate-900">
                            ₹{(q.financials?.grandTotal || 0).toLocaleString('en-IN')}
                          </div>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-50 text-[#168BFF] uppercase">
                            {q.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Invoices Section */}
                {matchedInvoices.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Receipt className="w-3 h-3 text-emerald-600" />
                      <span>Invoices ({matchedInvoices.length})</span>
                    </div>
                    {matchedInvoices.slice(0, 3).map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setActiveTab('invoices');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50/70 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                            <span>{inv.number}</span>
                            <span className="text-[10px] font-mono text-slate-500">• {inv.client?.companyName || 'Client'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">Issued: {inv.issueDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-slate-900">
                            ₹{(inv.financials?.grandTotal || 0).toLocaleString('en-IN')}
                          </div>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                              inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clients Section */}
                {matchedClients.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-600" />
                      <span>Clients ({matchedClients.length})</span>
                    </div>
                    {matchedClients.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveTab('clients');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/70 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                            {c.companyName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.contactPerson} • {c.email}
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">{c.gstin || 'GST Unregistered'}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products & Services Section */}
                {matchedServices.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-purple-600" />
                      <span>Products & Services ({matchedServices.length})</span>
                    </div>
                    {matchedServices.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveTab('services');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-purple-50/70 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[260px]">{s.description}</div>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900">
                          ₹{(s.unitPrice || 0).toLocaleString('en-IN')}/{s.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {totalMatches === 0 && (
                  <div className="p-8 text-center text-slate-400 space-y-1">
                    <Search className="w-6 h-6 mx-auto text-slate-300" />
                    <p className="text-xs font-bold text-slate-700">No matching records found for "{searchQuery}"</p>
                    <p className="text-[10px] text-slate-400">Try searching by client name, quotation ID, or GST number.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
          className="p-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 md:hidden touch-target flex items-center justify-center"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#168BFF] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* New Quote Action */}
        <button
          onClick={() => setActiveTab('quotation-builder')}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#168BFF]" />
          <span className="hidden sm:inline">New Quote</span>
        </button>

        {/* Interactive Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-all relative"
            title="Notifications & Security Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#168BFF] text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn font-sans">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#168BFF]" />
                  <span className="text-xs font-extrabold text-slate-900">Notifications & Alerts</span>
                </div>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[10px] font-bold text-[#168BFF] hover:underline uppercase tracking-wider"
                >
                  Mark All Read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#168BFF] shrink-0">
                      {n.type === 'security' ? (
                        <ShieldAlert className="w-4 h-4 text-[#168BFF]" />
                      ) : n.type === 'quotation' ? (
                        <FileText className="w-4 h-4 text-[#168BFF]" />
                      ) : (
                        <Shield className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{n.title}</span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setActiveTab('security-dashboard');
                  }}
                  className="text-xs font-bold text-[#168BFF] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Security Audit Logs</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account Profile & Security Dropdown */}
        <div className="relative pl-3 border-l border-slate-200" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-all text-left border border-transparent hover:border-slate-200 group"
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 p-0.5 border border-slate-200 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-[#168BFF] transition-colors">
              <img src="/ttlslogo.png" alt="User Avatar" className="w-full h-full object-contain" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                {currentUserName}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                {currentUserEmail}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn font-sans space-y-1 p-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs font-extrabold text-slate-900 truncate">{currentUserName}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{currentUserEmail}</div>
                <div className="inline-flex items-center text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#168BFF] border border-blue-200 uppercase tracking-wider">
                  ROLE: {currentUserRole}
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveTab('security-dashboard');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#168BFF] transition-all"
                >
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  <span>Security & Audit Logs</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveTab('sessions');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#168BFF] transition-all"
                >
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <span>Active Device Sessions</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#168BFF] transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings & Branding</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out & Revoke JWT</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Input Bar */}
      {isMobileSearchVisible && (
        <div className="absolute top-full left-0 right-0 p-3 bg-white border-b border-slate-200 shadow-lg md:hidden z-40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotations, invoices, clients..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#168BFF]"
            />
            <button
              onClick={() => setIsMobileSearchVisible(false)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

