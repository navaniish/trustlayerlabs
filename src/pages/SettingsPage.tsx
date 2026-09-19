import React, { useState } from 'react';
import { Settings, Shield, Building2, Save, CheckCircle2, Palette, Landmark, MapPin, Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';


export const SettingsPage: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useApp();

  // 1. Organization & Legal Identifiers
  const [companyName, setCompanyName] = useState(businessProfile.companyName);
  const [legalName, setLegalName] = useState(businessProfile.legalName);
  const [gstin, setGstin] = useState(businessProfile.gstin);
  const [pan, setPan] = useState(businessProfile.pan);
  const [cin, setCin] = useState(businessProfile.cin || '');
  const [email, setEmail] = useState(businessProfile.email);
  const [phone, setPhone] = useState(businessProfile.phone);
  const [whatsapp, setWhatsapp] = useState(businessProfile.whatsapp || '');
  const [website, setWebsite] = useState(businessProfile.website || '');

  // 2. Office Address
  const [addressLine1, setAddressLine1] = useState(businessProfile.address?.line1 || '');
  const [addressCity, setAddressCity] = useState(businessProfile.address?.city || '');
  const [addressState, setAddressState] = useState(businessProfile.address?.state || '');
  const [addressPin, setAddressPin] = useState(businessProfile.address?.pin || '');
  const [addressCountry, setAddressCountry] = useState(businessProfile.address?.country || 'India');

  // 3. Banking & Payment Instructions
  const [bankName, setBankName] = useState(businessProfile.bankDetails?.bankName || '');
  const [accountName, setAccountName] = useState(businessProfile.bankDetails?.accountName || '');
  const [accountNumber, setAccountNumber] = useState(businessProfile.bankDetails?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(businessProfile.bankDetails?.ifscCode || '');
  const [branch, setBranch] = useState(businessProfile.bankDetails?.branch || '');
  const [upiId, setUpiId] = useState(businessProfile.upiId || '');

  // 4. Branding & Media
  const [logoUrl, setLogoUrl] = useState(businessProfile.logoUrl || '');
  const [headerImageUrl, setHeaderImageUrl] = useState(businessProfile.headerImageUrl || '');
  const [slogan, setSlogan] = useState(businessProfile.branding?.slogan || '');
  const [footerText, setFooterText] = useState(businessProfile.branding?.footerText || '');

  const [isSaved, setIsSaved] = useState(false);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHeaderImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      companyName,
      legalName,
      gstin,
      pan,
      cin,
      email,
      phone,
      whatsapp,
      website,
      logoUrl,
      headerImageUrl,
      address: {
        line1: addressLine1,
        city: addressCity,
        state: addressState,
        pin: addressPin,
        country: addressCountry,
      },
      bankDetails: {
        bankName,
        accountName,
        accountNumber,
        ifscCode,
        branch,
      },
      upiId,
      branding: {
        ...businessProfile.branding,
        slogan,
        footerText,
      },
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-4 pb-8 font-sans max-w-5xl mx-auto">
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
            <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Business Profile &amp; Branding Settings</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Edit company details, GST registration, registered address, banking instructions, and brand assets.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          {isSaved && (
            <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings Saved!</span>
            </span>
          )}
        </div>
      </div>


      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* 1. Company Identity & Registration */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-[11px] font-bold text-trustBlue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Organization Information & Identifiers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Company Display Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Legal Registered Name</label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="e.g. 36AAACT8451A1ZQ"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">PAN Number</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="e.g. AAACT8451A"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">CIN (Corporate Identity No.)</label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="e.g. U72900TG2024PTC184920"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Official Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.trustlayerlabs.co.in"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Official Billing Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">WhatsApp Business Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98490 12345"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Office Address */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-[11px] font-bold text-trustBlue-600 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>2. Registered Office Address</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Street / Building Address</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Building 4B, Mindspace IT Park, Hitec City"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">City</label>
              <input
                type="text"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                placeholder="Hyderabad"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">State</label>
              <input
                type="text"
                value={addressState}
                onChange={(e) => setAddressState(e.target.value)}
                placeholder="Telangana"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">PIN Code</label>
              <input
                type="text"
                value={addressPin}
                onChange={(e) => setAddressPin(e.target.value)}
                placeholder="500081"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Country</label>
              <input
                type="text"
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
                placeholder="India"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Banking & Payment Instructions */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-[11px] font-bold text-trustBlue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" />
            <span>3. Banking & Payment Instructions (Editable)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="HDFC Bank Ltd"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Account Beneficiary Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="TrustLayer Technologies Pvt Ltd"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="50200084729104"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">IFSC Code</label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="HDFC0000045"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Bank Branch Name</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Hitec City Branch, Hyderabad"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">UPI VPA / UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="trustlayerlabs@hdfcbank"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Brand Identity & Document Images */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-[11px] font-bold text-trustBlue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            <span>4. Brand Identity & Document Banner Assets</span>
          </h3>

          <div className="space-y-3">
            {/* Logo Image */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-slate-800 font-bold text-[11px]">Company Logo Image</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-trustBlue-600 file:text-white hover:file:bg-trustBlue-700 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-bold self-center">OR</span>
                <input
                  type="text"
                  placeholder="Enter Logo URL (e.g. /ttlslogo.png)"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 text-[11px] outline-none"
                />
              </div>

              {logoUrl && (
                <div className="mt-2 p-2 border border-slate-200 rounded bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={logoUrl} alt="Logo Preview" className="h-8 w-auto object-contain" />
                    <span className="text-[10px] text-slate-500 font-medium">Active Logo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700"
                  >
                    Clear Logo
                  </button>
                </div>
              )}
            </div>

            {/* Header Image */}
            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 space-y-2">
              <label className="block text-slate-800 font-bold text-[11px]">
                Quotation / Invoice Document Header Image
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderFileUpload}
                  className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-trustBlue-600 file:text-white hover:file:bg-trustBlue-700 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-bold self-center">OR</span>
                <input
                  type="text"
                  placeholder="Enter Header Image URL (e.g. /header.png or /invoice.png)"
                  value={headerImageUrl}
                  onChange={(e) => setHeaderImageUrl(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 text-[11px] outline-none"
                />
              </div>

              {headerImageUrl && (
                <div className="mt-2 p-2 border border-slate-200 rounded bg-white relative">
                  <div className="text-[9px] font-bold text-slate-400 mb-1 uppercase">Header Banner Preview:</div>
                  <img
                    src={headerImageUrl}
                    alt="Header Banner Preview"
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setHeaderImageUrl('')}
                    className="mt-1 text-[10px] font-bold text-rose-600 hover:text-rose-700"
                  >
                    Clear Header Banner
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Brand Slogan</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-0.5 text-[11px]">Document Footer Philosophy</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:bg-white focus:border-trustBlue-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. Database Management & Local Storage Backup */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-[11px] font-bold text-trustBlue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>5. Database Storage & Backup Engine (IndexedDB)</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Database Engine: <span className="font-mono font-bold text-slate-800">TrustLayerLabsDB (v1)</span> — 7 Object Stores Active (clients, services, quotations, invoices, payments, business_profile, activity_logs).
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                const { dbService } = await import('../services/db');
                const json = await dbService.exportDatabaseJSON();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `TrustLayerLabsDB_Backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              Export Database Backup (.json)
            </button>

            <label className="bg-trustBlue-50 hover:bg-trustBlue-100 text-trustBlue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-trustBlue-200 cursor-pointer transition-colors">
              Import / Restore Database (.json)
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const text = await file.text();
                    const { dbService } = await import('../services/db');
                    await dbService.importDatabaseJSON(text);
                    alert('Database backup restored successfully! Reloading...');
                    window.location.reload();
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-1.5 bg-trustBlue-600 hover:bg-trustBlue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
