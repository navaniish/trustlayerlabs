import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Key, User, ArrowRight, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { useApp, UserProfile } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { login, businessProfile } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'Admin / Security Architect' | 'Sales Engineer' | 'Finance Auditor' | 'Client Portal Guest'>('Admin / Security Architect');
  
  const [email, setEmail] = useState('alex.rivera@trustlayerlabs.com');
  const [password, setPassword] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState('849201');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const presetAccounts: { role: UserProfile['role']; name: string; email: string; desc: string }[] = [
    {
      role: 'Admin / Security Architect',
      name: 'Alex Rivera',
      email: 'alex.rivera@trustlayerlabs.com',
      desc: 'Full administrative access & cryptographic verification controls',
    },
    {
      role: 'Sales Engineer',
      name: 'Priya Sharma',
      email: 'priya.sharma@trustlayerlabs.com',
      desc: 'Create quotations, client proposals & e-signature requests',
    },
    {
      role: 'Finance Auditor',
      name: 'Rohan Mehta',
      email: 'finance@trustlayerlabs.com',
      desc: 'Invoice tracking, payments reconciliation & GST ledgers',
    },
    {
      role: 'Client Portal Guest',
      name: 'Enterprise Client Guest',
      email: 'guest@clientportal.com',
      desc: 'Read-only document review & e-signature signing portal',
    },
  ];

  const handleRoleSelect = (acc: typeof presetAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedAccount = presetAccounts.find((a) => a.role === selectedRole);
    login({
      name: matchedAccount?.name || 'Verified User',
      email: email || 'user@trustlayerlabs.com',
      role: selectedRole,
    });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-2 sm:p-4 max-w-6xl mx-auto">
      <div className="w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Side: Humanized Cybersecurity Hero Showcase */}
        <div className="lg:col-span-6 relative bg-gradient-to-br from-trustBlue-50 via-slate-50 to-blue-100/50 p-8 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#168BFF_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-extrabold text-slate-900 tracking-tight">
                TrustLayer<span className="text-trustBlue-600">Verified</span> Portal
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-outfit leading-tight pt-1">
              Human-Centric Security & Digital Trust Platform
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              Enterprise security assessment documentation, cryptographic SHA-256 verification, and client portal authentication.
            </p>
          </div>

          {/* Center Humanized Hero Image Container */}
          <div className="relative z-10 my-4 flex justify-center items-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-slate-200/90 shadow-md group">
              <img
                src="/auth_hero.png"
                alt="TrustLayer Cybersecurity Specialist"
                className="w-full h-80 object-cover object-top transform group-hover:scale-102 transition-transform duration-500"
              />
              {/* Glassmorphic Overlay Badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sarah Jenkins — Lead Auditor</span>
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    2FA Verified
                  </span>
                </div>
                <p className="text-[10px] text-slate-600">
                  "Trust is not assumed. Trust is cryptographically verified."
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security Credentials Bar */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/80">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5 text-trustBlue-600" />
              <span>{businessProfile.website}</span>
            </span>
            <span className="font-mono text-slate-600">GSTIN: {businessProfile.gstin}</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            {/* Header & Mode Switch */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 px-2.5 py-1 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-xs">
                  <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-6 w-auto object-contain" />
                </div>
              </div>

              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-outfit">
                {authMode === 'signin' ? 'Welcome back to TrustLayerDocs' : 'Register Enterprise Account'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {authMode === 'signin'
                  ? 'Select your workspace role and authenticate with multi-factor security'
                  : 'Setup your enterprise security account for quotation and invoice workflows'}
              </p>
            </div>

            {/* Preset Role Picker */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Workspace Persona / Role
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {presetAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleRoleSelect(acc)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedRole === acc.role
                        ? 'bg-trustBlue-50 border-trustBlue-300 text-trustBlue-950 font-bold shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate flex items-center justify-between">
                      <span>{acc.role.split('/')[0]}</span>
                      {selectedRole === acc.role && <CheckCircle2 className="w-3 h-3 text-trustBlue-600 shrink-0" />}
                    </div>
                    <div className="text-[9px] text-slate-500 truncate">{acc.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Corporate Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@trustlayerlabs.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-trustBlue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Password</label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-trustBlue-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 font-bold"
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-[11px]">2FA Security OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="849201"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono tracking-widest text-center focus:bg-white focus:border-trustBlue-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-trustBlue-600 focus:ring-trustBlue-500"
                  />
                  <span>Remember this device (30 Days)</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('OTP verification code sent to registered billing email!'); }} className="font-semibold text-trustBlue-600 hover:text-trustBlue-700">
                  Forgot Password?
                </a>
              </div>

              {/* Main Submit CTA */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-trustBlue-600 to-indigo-600 hover:from-trustBlue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center space-x-2"
              >
                <span>Authenticate & Access Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* SSO Providers */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
                Or Authenticate with Single Sign-On (SSO)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => login({ name: 'Google SSO User', email: 'user@google.com', role: 'Admin / Security Architect' })}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 text-center transition-colors"
                >
                  Google Workspace
                </button>
                <button
                  type="button"
                  onClick={() => login({ name: 'Microsoft SSO User', email: 'user@microsoft.com', role: 'Admin / Security Architect' })}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 text-center transition-colors"
                >
                  Microsoft Entra ID
                </button>
                <button
                  type="button"
                  onClick={() => login({ name: 'Zoho SSO User', email: 'user@zoho.com', role: 'Admin / Security Architect' })}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 text-center transition-colors"
                >
                  Zoho One
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center text-[10px] text-slate-400 border-t border-slate-100">
            Protected by TrustLayer Shield™ • ISO 27001 Certified • 256-Bit TLS Encryption
          </div>
        </div>
      </div>
    </div>
  );
};
