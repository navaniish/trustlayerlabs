import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActivityLog,
  BusinessProfile,
  Client,
  Invoice,
  Payment,
  ProductService,
  Quotation,
  QuotationStatus,
  InvoiceStatus,
  ESignatureData,
} from '../types';
import {
  initialActivityLogs,
  initialBusinessProfile,
  initialClients,
  initialInvoices,
  initialPayments,
  initialQuotations,
  initialServices,
} from '../utils/initialData';
import { dbService, STORES } from '../services/db';



export type ActiveTab =
  | 'dashboard'
  | 'quotations'
  | 'quotation-builder'
  | 'invoices'
  | 'clients'
  | 'services'
  | 'payments'
  | 'verification'
  | 'client-portal'
  | 'reports'
  | 'settings'
  | 'security-dashboard'
  | 'sessions'
  | 'auth';

export interface UserProfile {
  name: string;
  email: string;
  role: 'Admin / Security Architect' | 'Sales Engineer' | 'Finance Auditor' | 'Client Portal Guest';
  avatarUrl?: string;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  jwtToken: string | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  businessProfile: BusinessProfile;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  services: ProductService[];
  addService: (service: Omit<ProductService, 'id'>) => ProductService;
  updateService: (id: string, service: Partial<ProductService>) => void;
  deleteService: (id: string) => void;
  quotations: Quotation[];
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt' | 'verification'>) => Quotation;
  updateQuotation: (id: string, quotation: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  acceptQuotation: (id: string, signature: ESignatureData) => void;

  convertQuotationToInvoice: (quotationId: string) => Invoice;
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'verification'>) => Invoice;
  recordPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Payment;
  payments: Payment[];
  activityLogs: ActivityLog[];
  selectedQuotationId: string | null;
  setSelectedQuotationId: (id: string | null) => void;
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (open: boolean) => void;
  emailModalData: { documentNumber: string; clientEmail: string; type: string } | null;
  openEmailModal: (documentNumber: string, clientEmail: string, type: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('auth');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Listen for auth expiry on mount
  useEffect(() => {
    const handleAuthExpired = () => {
      setJwtToken(null);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveTab('auth');
    };

    window.addEventListener('trustlayer:auth_expired', handleAuthExpired);
    return () => window.removeEventListener('trustlayer:auth_expired', handleAuthExpired);
  }, []);

  const login = (user: UserProfile) => {
    let formattedEmail = user.email;
    if (formattedEmail.includes('@trustlayerlabs.com')) {
      formattedEmail = formattedEmail.replace('@trustlayerlabs.com', '@trustlayerlabs.co.in');
    } else if (!formattedEmail.includes('@')) {
      formattedEmail = `${formattedEmail}@trustlayerlabs.co.in`;
    }

    const updatedUser: UserProfile = {
      ...user,
      email: formattedEmail,
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const logout = () => {
    setJwtToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('auth');
  };

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(initialBusinessProfile);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [services, setServices] = useState<ProductService[]>(initialServices);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailModalData, setEmailModalData] = useState<{ documentNumber: string; clientEmail: string; type: string } | null>(null);

  // Initialize and load persistent IndexedDB data on mount
  useEffect(() => {
    dbService.initDatabase().then((dbData) => {
      setBusinessProfile(dbData.businessProfile);
      setClients(dbData.clients);
      setServices(dbData.services);
      setQuotations(dbData.quotations);
      setInvoices(dbData.invoices);
      setPayments(dbData.payments);
      setActivityLogs(dbData.activityLogs);
    });
  }, []);

  // Listen for /q/{documentNumber} URL path on load or navigation
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path.includes('/q/')) {
        const docNum = path.split('/q/')[1]?.replace(/\/$/, '').trim();
        if (docNum) {
          const matchQuo = quotations.find(
            (q) =>
              q.number.toLowerCase() === docNum.toLowerCase() ||
              q.number.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === docNum.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          );
          if (matchQuo) {
            setSelectedQuotationId(matchQuo.id);
            setActiveTab('client-portal');
          }
        }
      }
    };
    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [quotations]);

  const logActivity = (action: string, documentNumber: string, documentType: 'quotation' | 'invoice' | 'client' | 'payment', user: string, details: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action,
      documentNumber,
      documentType,
      user,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    dbService.putOne(STORES.ACTIVITY_LOGS, newLog).catch(console.error);
  };

  const updateBusinessProfile = (profile: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => {
      const updated = { ...prev, ...profile };
      dbService.putOne(STORES.BUSINESS_PROFILE, updated).catch(console.error);
      return updated;
    });
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    dbService.putOne(STORES.CLIENTS, newClient).catch(console.error);
    logActivity('Client Added', newClient.companyName, 'client', 'Admin', `Added new client ${newClient.companyName}`);
    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...clientData };
          dbService.putOne(STORES.CLIENTS, updated).catch(console.error);
          return updated;
        }
        return c;
      })
    );
  };

  const addService = (serviceData: Omit<ProductService, 'id'>): ProductService => {
    const newService: ProductService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    dbService.putOne(STORES.SERVICES, newService).catch(console.error);
    return newService;
  };

  const updateService = (id: string, sData: Partial<ProductService>) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...sData };
          dbService.putOne(STORES.SERVICES, updated).catch(console.error);
          return updated;
        }
        return s;
      })
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    dbService.deleteOne(STORES.SERVICES, id).catch(console.error);
  };

  const getVerificationUrl = (docNum: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
    return `${origin}/q/${docNum}`;
  };

  const addQuotation = (qData: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt' | 'verification'>): Quotation => {
    const nextSeq = String(quotations.length + 1).padStart(4, '0');
    const defaultNum = `TLQ-2026-${nextSeq}`;
    const num = qData.number && qData.number.trim() ? qData.number : defaultNum;
    const newQuotation: Quotation = {
      ...qData,
      id: `quo-${Date.now()}`,
      number: num,
      verification: {
        verificationId: num,
        verificationUrl: getVerificationUrl(num),
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        isVerified: true,
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [newQuotation, ...prev]);
    dbService.putOne(STORES.QUOTATIONS, newQuotation).catch(console.error);
    logActivity('Quotation Created', num, 'quotation', 'Sales Team', `Created quotation ${num} for ${newQuotation.client?.companyName || 'Client'}`);
    return newQuotation;
  };

  const updateQuotation = (id: string, qData: Partial<Quotation>) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = { ...q, ...qData, updatedAt: new Date().toISOString().split('T')[0] };
          dbService.putOne(STORES.QUOTATIONS, updated).catch(console.error);
          return updated;
        }
        return q;
      })
    );
  };

  const deleteQuotation = (id: string) => {
    const target = quotations.find((q) => q.id === id);
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    dbService.deleteOne(STORES.QUOTATIONS, id).catch(console.error);
    if (target) {
      logActivity('Quotation Deleted', target.number, 'quotation', 'Admin', `Deleted quotation ${target.number}`);
    }
  };


  const acceptQuotation = (id: string, signature: ESignatureData) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          logActivity('Quotation Accepted & Signed', q.number, 'quotation', signature.signedByName, `Accepted via E-Signature (${signature.type})`);
          const updated = {
            ...q,
            status: 'ACCEPTED' as QuotationStatus,
            signature,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          dbService.putOne(STORES.QUOTATIONS, updated).catch(console.error);
          return updated;
        }
        return q;
      })
    );
  };

  const convertQuotationToInvoice = (quotationId: string): Invoice => {
    const quo = quotations.find((q) => q.id === quotationId);
    if (!quo) throw new Error('Quotation not found');

    const nextSeq = String(invoices.length + 1).padStart(4, '0');
    const invNum = `INV-2026-${nextSeq}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: invNum,
      quotationId: quo.id,
      clientId: quo.clientId,
      client: quo.client,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      currency: quo.currency,
      currencySymbol: quo.currencySymbol,
      items: quo.items,
      financials: quo.financials,
      globalDiscount: quo.globalDiscount,
      amountPaid: 0,
      amountDue: quo.financials.grandTotal,
      notes: quo.notes || 'Thank you for choosing TrustLayerLabs.',
      paymentInstructions: 'Direct NEFT/RTGS to HDFC Account 50200084729104 or scan UPI QR code.',
      templateId: quo.templateId,
      status: 'SENT' as InvoiceStatus,
      verification: {
        verificationId: invNum,
        verificationUrl: getVerificationUrl(invNum),
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        isVerified: true,
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    dbService.putOne(STORES.INVOICES, newInvoice).catch(console.error);

    // Mark quotation as invoiced
    updateQuotation(quo.id, { status: 'INVOICED', convertedInvoiceId: newInvoice.id });

    // Update client balance
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === quo.clientId) {
          const updated = { ...c, outstandingBalance: c.outstandingBalance + quo.financials.grandTotal };
          dbService.putOne(STORES.CLIENTS, updated).catch(console.error);
          return updated;
        }
        return c;
      })
    );

    logActivity('Converted to Invoice', invNum, 'invoice', 'Sales/Finance', `Converted quotation ${quo.number} to Invoice ${invNum}`);
    return newInvoice;
  };

  const addInvoice = (iData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'verification'>): Invoice => {
    const nextSeq = String(invoices.length + 1).padStart(4, '0');
    const defaultNum = `INV-2026-${nextSeq}`;
    const num = iData.number && iData.number.trim() ? iData.number : defaultNum;
    const newInvoice: Invoice = {
      ...iData,
      id: `inv-${Date.now()}`,
      number: num,
      verification: {
        verificationId: num,
        verificationUrl: getVerificationUrl(num),
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        isVerified: true,
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    dbService.putOne(STORES.INVOICES, newInvoice).catch(console.error);
    logActivity('Invoice Created', num, 'invoice', 'Finance Team', `Created invoice ${num} for ${newInvoice.client?.companyName || 'Client'}`);
    return newInvoice;
  };

  const recordPayment = (pData: Omit<Payment, 'id' | 'createdAt'>): Payment => {
    const newPayment: Payment = {
      ...pData,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPayments((prev) => [newPayment, ...prev]);
    dbService.putOne(STORES.PAYMENTS, newPayment).catch(console.error);

    // Update corresponding invoice status and balances
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === pData.invoiceId) {
          const newAmountPaid = inv.amountPaid + pData.amount;
          const newAmountDue = Math.max(0, inv.financials.grandTotal - newAmountPaid);
          const newStatus: InvoiceStatus = newAmountDue === 0 ? 'PAID' : 'PARTIALLY_PAID';

          const updatedInv = {
            ...inv,
            amountPaid: newAmountPaid,
            amountDue: newAmountDue,
            status: newStatus,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          dbService.putOne(STORES.INVOICES, updatedInv).catch(console.error);
          return updatedInv;
        }
        return inv;
      })
    );

    logActivity('Payment Logged', pData.invoiceNumber, 'payment', 'Finance Team', `Received ${pData.amount} via ${pData.method} (Txn: ${pData.transactionId})`);
    return newPayment;
  };

  const openEmailModal = (documentNumber: string, clientEmail: string, type: string) => {
    setEmailModalData({ documentNumber, clientEmail, type });
    setIsEmailModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isAuthenticated,
        currentUser,
        jwtToken,
        login,
        logout,
        businessProfile,
        updateBusinessProfile,
        clients,
        addClient,
        updateClient,
        services,
        addService,
        updateService,
        deleteService,
        quotations,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        acceptQuotation,
        convertQuotationToInvoice,

        invoices,
        addInvoice,
        recordPayment,
        payments,
        activityLogs,
        selectedQuotationId,
        setSelectedQuotationId,
        selectedInvoiceId,
        setSelectedInvoiceId,
        searchQuery,
        setSearchQuery,
        isAiModalOpen,
        setIsAiModalOpen,
        isEmailModalOpen,
        setIsEmailModalOpen,
        emailModalData,
        openEmailModal,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
