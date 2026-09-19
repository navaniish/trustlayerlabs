import { DocumentItem, PricingSummary } from '../types';

export interface TaxConfig {
  taxType: 'GST_INTRA' | 'GST_INTER' | 'EXEMPT';
  defaultCgstRate: number; // e.g. 9
  defaultSgstRate: number; // e.g. 9
  defaultIgstRate: number; // e.g. 18
}

export const calculateItemTotal = (
  unitPrice: number,
  quantity: number,
  discountPercent: number = 0,
  taxPercent: number = 0
): { itemSubtotal: number; discountAmount: number; taxableAmount: number; taxAmount: number; total: number } => {
  const itemSubtotal = unitPrice * quantity;
  const discountAmount = itemSubtotal * (discountPercent / 100);
  const taxableAmount = itemSubtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const total = taxableAmount + taxAmount;

  return {
    itemSubtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  };
};

export const calculatePricingSummary = (
  items: DocumentItem[],
  globalDiscount: number = 0,
  additionalCharges: number = 0,
  taxConfig: TaxConfig = { taxType: 'GST_INTRA', defaultCgstRate: 9, defaultSgstRate: 9, defaultIgstRate: 18 }
): PricingSummary => {
  let subtotal = 0;
  let itemDiscounts = 0;
  let totalTaxable = 0;
  let totalTax = 0;

  items.forEach((item) => {
    const calc = calculateItemTotal(item.unitPrice, item.quantity, item.discountPercent, item.taxPercent);
    subtotal += calc.itemSubtotal;
    itemDiscounts += calc.discountAmount;
    totalTaxable += calc.taxableAmount;
    totalTax += calc.taxAmount;
  });

  const netTaxableAmount = Math.max(0, totalTaxable - globalDiscount);

  // Calculate India GST components based on netTaxableAmount ratio if global discount exists
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (taxConfig.taxType === 'GST_INTRA') {
    cgst = Math.round(totalTax / 2);
    sgst = Math.round(totalTax / 2);
  } else if (taxConfig.taxType === 'GST_INTER') {
    igst = Math.round(totalTax);
  }

  const rawGrandTotal = netTaxableAmount + cgst + sgst + igst + (additionalCharges || 0);
  const roundedGrandTotal = Math.round(rawGrandTotal);
  const roundOff = parseFloat((roundedGrandTotal - rawGrandTotal).toFixed(2));

  return {
    subtotal: Math.round(subtotal),
    itemDiscounts: Math.round(itemDiscounts),
    globalDiscount: Math.round(globalDiscount),
    taxableAmount: Math.round(netTaxableAmount),
    cgst,
    sgst,
    igst,
    additionalCharges: Math.round(additionalCharges || 0),
    roundOff,
    grandTotal: roundedGrandTotal,
  };
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const curr = currency ? currency.toUpperCase() : 'INR';
  
  if (curr === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } else if (curr === 'EUR') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  } else if (curr === 'GBP') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};
