import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Smartphone,
  CheckCircle2,
  User,
  UserPlus,
  Briefcase,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const { login: appLogin, setActiveTab } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // Register State
  const [fullName, setFullName] = useState('');
  const [regRole, setRegRole] = useState<'ADMIN' | 'SALES' | 'FINANCE' | 'STAFF' | 'CLIENT'>('STAFF');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await login(email.trim(), password, showMfaInput ? totpCode : undefined);

      const emailLower = email.trim().toLowerCase();
      let roleLabel: 'Admin / Security Architect' | 'Sales Engineer' | 'Finance Auditor' | 'Client Portal Guest' = 'Admin / Security Architect';
      let nameLabel = 'Verified Corporate User';

      if (emailLower === 'ceo@trustlayerlabs.co.in') {
        nameLabel = 'Executive Director & CEO';
        roleLabel = 'Admin / Security Architect';
      } else if (emailLower.includes('sales')) {
        nameLabel = 'Lead Sales Engineer';
        roleLabel = 'Sales Engineer';
      } else if (emailLower.includes('finance')) {
        nameLabel = 'Finance Auditor';
        roleLabel = 'Finance Auditor';
      }

      appLogin({
        name: nameLabel,
        email: email.trim(),
        role: roleLabel,
      });

      setActiveTab('dashboard');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 428) {
        setShowMfaInput(true);
        setErrorMessage('2FA Authenticator Code required. Enter 6-digit TOTP code below.');
      } else {
        setErrorMessage(detail || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    try {
      let formattedEmail = email.trim();
      if (!formattedEmail.includes('@')) {
        formattedEmail = `${formattedEmail}@trustlayerlabs.co.in`;
      }

      await register(fullName.trim(), formattedEmail, password, regRole);

      let mappedRoleLabel: 'Admin / Security Architect' | 'Sales Engineer' | 'Finance Auditor' | 'Client Portal Guest' = 'Admin / Security Architect';
      if (regRole === 'SALES') mappedRoleLabel = 'Sales Engineer';
      if (regRole === 'FINANCE') mappedRoleLabel = 'Finance Auditor';
      if (regRole === 'CLIENT') mappedRoleLabel = 'Client Portal Guest';

      appLogin({
        name: fullName.trim(),
        email: formattedEmail,
        role: mappedRoleLabel,
      });

      setActiveTab('dashboard');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setErrorMessage(detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data } = await apiClient.post('/api/v1/auth/forgot-password', { email: forgotEmail.trim() });
      setForgotStep(2);
      if (data?.reset_token) {
        setResetToken(data.reset_token);
      }
      setSuccessMessage(data?.message || 'Password reset request dispatched. Enter your reset token and new password below.');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setErrorMessage(detail || 'Failed to process password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data } = await apiClient.post('/api/v1/auth/reset-password', {
        token: resetToken.trim(),
        new_password: newPassword,
      });
      setSuccessMessage(data?.message || 'Password successfully reset! Please sign in with your new password.');
      setPassword(newPassword);
      setEmail(forgotEmail);
      setMode('login');
      setForgotStep(1);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setErrorMessage(detail || 'Invalid or expired password reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans justify-between">
      {/* Top Header Bar */}
      <header className="h-20 border-b border-slate-200/80 px-4 sm:px-8 md:px-12 flex items-center justify-between bg-white sticky top-0 z-20 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="h-14 px-3.5 py-1.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-xs">
            <img src="/ttlslogo.png" alt="TrustLayerLabs" className="h-11 sm:h-12 w-auto object-contain" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="font-extrabold tracking-tight text-[#07111C] text-xl font-sans">
              TrustLayer<span className="text-[#168BFF]">Labs</span>
            </span>
            <span className="inline-flex items-center text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-[#EAF4FF] text-[#168BFF] uppercase tracking-wider border border-blue-100 self-start sm:self-auto">
              THE VERIFIED TRUST LAYER
            </span>
          </div>
        </div>

        {/* Security Indicators Bar */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200/80 text-[10px] font-extrabold tracking-wider text-slate-600 uppercase shadow-2xs">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SECURE ACCESS</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-[#168BFF]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#168BFF]" />
            <span>VERIFIED IDENTITY</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <span>PROTECTED SESSION</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header Title & Big Brand Showcase */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs inline-flex items-center justify-center">
                <img
                  src="/ttlslogo.png"
                  alt="TrustLayerLabs Logo"
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain transition-transform hover:scale-105 duration-300"
                />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-[#07111C] font-outfit tracking-tight">
              {mode === 'login'
                ? 'Sign In to TrustLayerLabs'
                : mode === 'register'
                ? 'Create New Corporate Account'
                : 'Reset Account Password'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {mode === 'login'
                ? 'Enter your corporate credentials to generate your authenticated session.'
                : mode === 'register'
                ? 'Register your official @trustlayerlabs.co.in identity for verified access.'
                : 'Request password reset token or set a new password.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-extrabold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#168BFF] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#168BFF] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              NEW ACCOUNT
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#07111C] mb-1">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@trustlayerlabs.co.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#07111C]">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-slate-500 hover:text-[#168BFF] font-extrabold flex items-center gap-1 uppercase tracking-wider"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'HIDE' : 'SHOW'} PASSWORD</span>
                  </button>
                </div>

                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {showMfaInput && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#168BFF]" />
                    <span>2FA Authenticator Code</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-blue-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono tracking-widest text-center focus:bg-white focus:border-[#168BFF] outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowMfaInput(!showMfaInput)}
                  className="text-[10px] text-slate-500 hover:text-[#168BFF] font-semibold"
                >
                  {showMfaInput ? 'Hide Authenticator' : '[ USE AUTHENTICATOR ]'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-bold text-[#168BFF] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#168BFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-99 disabled:opacity-70"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <>
                    <span>[ SIGN IN ]</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#07111C] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#07111C] mb-1">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@trustlayerlabs.co.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#07111C] mb-1">
                  Assign Account Role Persona
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="ADMIN">Admin / Security Architect</option>
                    <option value="SALES">Sales Engineer</option>
                    <option value="FINANCE">Finance Auditor</option>
                    <option value="STAFF">Corporate Staff</option>
                    <option value="CLIENT">Client Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#07111C]">Set Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-slate-500 hover:text-[#168BFF] font-extrabold flex items-center gap-1 uppercase tracking-wider"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'HIDE' : 'SHOW'} PASSWORD</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#168BFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-99 disabled:opacity-70"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>[ REGISTER NEW ACCOUNT ]</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 1 ? (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#07111C] mb-1">
                      Registered Corporate Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@trustlayerlabs.co.in"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#168BFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-99 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4" />
                        <span>[ REQUEST RESET TOKEN ]</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#07111C] mb-1">
                      Reset Token
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Enter reset token"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#07111C]">New Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] text-slate-500 hover:text-[#168BFF] font-extrabold flex items-center gap-1 uppercase tracking-wider"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'HIDE' : 'SHOW'} PASSWORD</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 8 chars)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#168BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-99 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>[ SAVE NEW PASSWORD & SIGN IN ]</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setForgotStep(1);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                >
                  ← Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* Footer Security Badges */}
          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
            <span>Argon2id Encrypted</span>
            <span>Rotating Refresh Cookies</span>
            <span>TLS 256-Bit</span>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} TrustLayer Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
