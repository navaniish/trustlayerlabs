import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Receipt,
  Users,
  Briefcase,
  CreditCard,
  ShieldCheck,
  Globe,
  BarChart3,
  Settings,
  ShieldAlert,
  Laptop,
  X,
  LogOut,
  Shield,
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, quotations, invoices, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const { user, logout } = useAuth();

  const pendingQuotesCount = quotations.filter((q) => q.status === 'SENT' || q.status === 'VIEWED').length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'SENT' || i.status === 'PARTIALLY_PAID').length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText, badge: pendingQuotesCount },
    { id: 'quotation-builder', label: 'Quotation Builder', icon: PlusCircle },
    { id: 'invoices', label: 'Invoices', icon: Receipt, badge: pendingInvoicesCount },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'services', label: 'Products & Services', icon: Briefcase },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'verification', label: 'Verification Portal', icon: ShieldCheck },
    { id: 'client-portal', label: 'Client Portal View', icon: Globe },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'security-dashboard', label: 'Security & Audit Logs', icon: ShieldAlert },
    { id: 'sessions', label: 'Active Devices', icon: Laptop },
    { id: 'settings', label: 'Settings & Branding', icon: Settings },
  ];

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Lock body scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    setActiveTab('auth');
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-56 lg:w-64 border-r border-slate-200 bg-white p-3 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-5rem)] shadow-2xs font-sans">
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Core Workspace Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all touch-target ${
                  isActive
                    ? 'bg-blue-50 text-[#168BFF] border border-blue-200 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#168BFF]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#168BFF] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Verification System Badge Footer */}
        <div className="mt-6 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-emerald-700 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VERIFIED TRUST SYSTEM</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug font-medium">
            Tamper-evident signatures & QR verification active.
          </p>
        </div>
      </aside>

      {/* Mobile Slide-In Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex font-sans animate-fadeIn">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-slideRight">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center">
                  <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">TrustLayerDocs</div>
                  <div className="text-[10px] text-slate-500 font-mono">Workspace Menu</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 touch-target flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation List */}
            <div className="p-3 space-y-1 flex-1 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Menu Options
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all min-h-[48px] ${
                      isActive
                        ? 'bg-blue-50 text-[#168BFF] border border-blue-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#168BFF]' : 'text-slate-400'}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#168BFF] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer & Logout */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-900 truncate">
                  {user?.name || 'Executive Director & CEO'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {user?.email || 'ceo@trustlayerlabs.co.in'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 min-h-[48px]"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out & Revoke Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

