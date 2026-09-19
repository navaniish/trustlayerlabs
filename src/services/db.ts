import {
  ActivityLog,
  BusinessProfile,
  Client,
  Invoice,
  Payment,
  ProductService,
  Quotation,
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

const DB_NAME = 'TrustLayerLabsDB';
const DB_VERSION = 1;

export const STORES = {
  CLIENTS: 'clients',
  SERVICES: 'services',
  QUOTATIONS: 'quotations',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  BUSINESS_PROFILE: 'business_profile',
  ACTIVITY_LOGS: 'activity_logs',
};

class DatabaseService {
  private db: IDBDatabase | null = null;
  private isInitializing = false;

  public async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
          db.createObjectStore(STORES.CLIENTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SERVICES)) {
          db.createObjectStore(STORES.SERVICES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.QUOTATIONS)) {
          db.createObjectStore(STORES.QUOTATIONS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.INVOICES)) {
          db.createObjectStore(STORES.INVOICES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
          db.createObjectStore(STORES.PAYMENTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.BUSINESS_PROFILE)) {
          db.createObjectStore(STORES.BUSINESS_PROFILE, { keyPath: 'companyName' });
        }
        if (!db.objectStoreNames.contains(STORES.ACTIVITY_LOGS)) {
          db.createObjectStore(STORES.ACTIVITY_LOGS, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public async initDatabase(): Promise<{
    businessProfile: BusinessProfile;
    clients: Client[];
    services: ProductService[];
    quotations: Quotation[];
    invoices: Invoice[];
    payments: Payment[];
    activityLogs: ActivityLog[];
  }> {
    if (this.isInitializing) {
      await new Promise((res) => setTimeout(res, 200));
    }
    this.isInitializing = true;

    try {
      const db = await this.getDB();

      // Ensure business profile and default catalog services exist
      const existingProfile = await this.getOne<BusinessProfile>(STORES.BUSINESS_PROFILE, initialBusinessProfile.companyName);
      if (!existingProfile) {
        await this.putOne(STORES.BUSINESS_PROFILE, initialBusinessProfile);
      }

      const existingServices = await this.getAll<ProductService>(STORES.SERVICES);
      if (existingServices.length === 0) {
        for (const s of initialServices) await this.putOne(STORES.SERVICES, s);
      }

      // Check and wipe legacy mock items if present
      const clients = await this.getAll<Client>(STORES.CLIENTS);
      const legacyClient = clients.find((c) => c.id === 'cli-001' || c.id === 'cli-002' || c.id === 'cli-003');
      if (legacyClient) {
        for (const store of [STORES.CLIENTS, STORES.QUOTATIONS, STORES.INVOICES, STORES.PAYMENTS, STORES.ACTIVITY_LOGS]) {
          await this.clearStore(store);
        }
      }

      const finalProfile = (await this.getOne<BusinessProfile>(STORES.BUSINESS_PROFILE, initialBusinessProfile.companyName)) || initialBusinessProfile;
      const finalClients = await this.getAll<Client>(STORES.CLIENTS);
      const finalServices = await this.getAll<ProductService>(STORES.SERVICES);
      const finalQuotations = await this.getAll<Quotation>(STORES.QUOTATIONS);
      const finalInvoices = await this.getAll<Invoice>(STORES.INVOICES);
      const finalPayments = await this.getAll<Payment>(STORES.PAYMENTS);
      const finalLogs = await this.getAll<ActivityLog>(STORES.ACTIVITY_LOGS);

      this.isInitializing = false;
      return {
        businessProfile: finalProfile,
        clients: finalClients,
        services: finalServices.length > 0 ? finalServices : initialServices,
        quotations: finalQuotations,
        invoices: finalInvoices,
        payments: finalPayments,
        activityLogs: finalLogs,
      };
    } catch (error) {
      console.warn('Database access error:', error);
      this.isInitializing = false;
      return {
        businessProfile: initialBusinessProfile,
        clients: [],
        services: initialServices,
        quotations: [],
        invoices: [],
        payments: [],
        activityLogs: [],
      };
    }
  }

  public async clearStore(storeName: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  public async getOne<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve((request.result as T) || null);
      request.onerror = () => reject(request.error);
    });
  }

  public async putOne<T>(storeName: string, item: T): Promise<T> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteOne(storeName: string, key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async exportDatabaseJSON(): Promise<string> {
    const data = {
      businessProfile: await this.getOne<BusinessProfile>(STORES.BUSINESS_PROFILE, initialBusinessProfile.companyName),
      clients: await this.getAll<Client>(STORES.CLIENTS),
      services: await this.getAll<ProductService>(STORES.SERVICES),
      quotations: await this.getAll<Quotation>(STORES.QUOTATIONS),
      invoices: await this.getAll<Invoice>(STORES.INVOICES),
      payments: await this.getAll<Payment>(STORES.PAYMENTS),
      activityLogs: await this.getAll<ActivityLog>(STORES.ACTIVITY_LOGS),
      exportedAt: new Date().toISOString(),
      dbName: DB_NAME,
      version: DB_VERSION,
    };
    return JSON.stringify(data, null, 2);
  }

  public async importDatabaseJSON(jsonString: string): Promise<void> {
    const parsed = JSON.parse(jsonString);
    if (parsed.businessProfile) await this.putOne(STORES.BUSINESS_PROFILE, parsed.businessProfile);
    if (Array.isArray(parsed.clients)) {
      for (const c of parsed.clients) await this.putOne(STORES.CLIENTS, c);
    }
    if (Array.isArray(parsed.services)) {
      for (const s of parsed.services) await this.putOne(STORES.SERVICES, s);
    }
    if (Array.isArray(parsed.quotations)) {
      for (const q of parsed.quotations) await this.putOne(STORES.QUOTATIONS, q);
    }
    if (Array.isArray(parsed.invoices)) {
      for (const i of parsed.invoices) await this.putOne(STORES.INVOICES, i);
    }
    if (Array.isArray(parsed.payments)) {
      for (const p of parsed.payments) await this.putOne(STORES.PAYMENTS, p);
    }
    if (Array.isArray(parsed.activityLogs)) {
      for (const a of parsed.activityLogs) await this.putOne(STORES.ACTIVITY_LOGS, a);
    }
  }
}

export const dbService = new DatabaseService();
