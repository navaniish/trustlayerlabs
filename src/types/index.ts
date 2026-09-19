export type DocumentType = 'quotation' | 'invoice';

export type PaperSize = 'a4' | 'a3' | 'legal';

export type QuotationStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'INVOICED' | 'CANCELLED';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Cash' | 'Card' | 'Online Payment' | 'Cheque' | 'Other';

export type TemplateId = 'trustlayer-labs';

export interface ClientAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  country: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  billingAddress: ClientAddress;
  shippingAddress?: ClientAddress;
  gstin?: string;
  pan?: string;
  outstandingBalance: number;
  status: 'Active' | 'Inactive';
  notes?: string;
  createdAt: string;
}

export interface ProductService {
  id: string;
  name: string;
  description: string;
  unit: 'Hour' | 'Day' | 'Project' | 'Month' | 'License' | 'Unit' | 'Custom';
  unitPrice: number;
  taxPercent: number;
  deliverables?: string;
}

export interface DocumentItem {
  id: string;
  serviceId?: string;
  name: string;
  description: string;
  deliverables?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  totalPrice: number;
}

export interface PricingSummary {
  subtotal: number;
  itemDiscounts: number;
  globalDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  additionalCharges?: number;
  roundOff: number;
  grandTotal: number;
}

export interface ESignatureData {
  type: 'draw' | 'type' | 'upload';
  signatureDataUrl: string;
  signedByName: string;
  signedByDesignation: string;
  signedAt: string;
  ipAddress?: string;
}

export interface DocumentVerification {
  verificationId: string;
  verificationUrl: string;
  hash: string;
  isVerified: boolean;
  timestamp: string;
}

export interface Quotation {
  id: string;
  number: string; // e.g. TL-Q-2026-0001
  clientId: string;
  client: Client;
  issueDate: string;
  validUntil: string;
  currency: string; // INR, USD, EUR, GBP
  currencySymbol: string;
  reference?: string;
  salesperson?: string;
  preparedBy?: string;
  preparedByDesignation?: string;
  paymentTerms: string;
  items: DocumentItem[];
  financials: PricingSummary;
  globalDiscount: number;
  additionalCharges?: number;
  notes?: string;
  terms?: string[];
  templateId: TemplateId;
  status: QuotationStatus;
  headerImageUrl?: string;
  signature?: ESignatureData;
  verification: DocumentVerification;
  convertedInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string; // e.g. INV-2026-0001
  quotationId?: string;
  clientId: string;
  client: Client;
  issueDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  reference?: string;
  salesperson?: string;
  preparedBy?: string;
  preparedByDesignation?: string;
  paymentTerms?: string;
  items: DocumentItem[];
  financials: PricingSummary;
  globalDiscount: number;
  additionalCharges?: number;
  amountPaid: number;
  amountDue: number;
  notes?: string;
  terms?: string[];
  paymentInstructions?: string;
  templateId: TemplateId;
  status: InvoiceStatus;
  headerImageUrl?: string;
  signature?: ESignatureData;
  verification: DocumentVerification;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  paymentDate: string;
  amount: number;
  method: PaymentMethod;
  transactionId: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface BusinessProfile {
  companyName: string;
  legalName: string;
  logoUrl?: string;
  headerImageUrl?: string;
  address: ClientAddress;
  gstin: string;
  pan: string;
  cin?: string;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    accountName: string;
  };
  upiId: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    slogan: string;
    footerText: string;
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  documentNumber: string;
  documentType: 'quotation' | 'invoice' | 'client' | 'payment';
  user: string;
  details: string;
}
