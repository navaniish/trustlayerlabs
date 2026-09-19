import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { QuotationBuilderPage } from './pages/QuotationBuilderPage';
import { QuotationsPage } from './pages/QuotationsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { ClientsPage } from './pages/ClientsPage';
import { ServicesPage } from './pages/ServicesPage';
import { DocumentVerificationPage } from './pages/DocumentVerificationPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SecurityDashboardPage } from './pages/SecurityDashboardPage';
import { SessionManagementPage } from './pages/SessionManagementPage';
import { LoginPage } from './pages/LoginPage';
import { AiAssistantModal } from './components/AiAssistantModal';
import { EmailModal } from './components/EmailModal';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated: appAuthenticated } = useApp();
  const { isAuthenticated: authAuthenticated } = useAuth();

  const isAuthenticated = appAuthenticated || authAuthenticated;

  // Standalone Full-Page Views (No Internal Workspace Sidebar/Header Layout)
  if (activeTab === 'auth') {
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    if (activeTab === 'verification') {
      return <DocumentVerificationPage />;
    }
    if (activeTab === 'client-portal') {
      return <ClientPortalPage />;
    }
    return <LoginPage />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'quotation-builder':
        return <QuotationBuilderPage />;
      case 'quotations':
        return <QuotationsPage />;
      case 'invoices':
      case 'payments':
        return <InvoicesPage />;
      case 'clients':
        return <ClientsPage />;
      case 'services':
        return <ServicesPage />;
      case 'verification':
        return <DocumentVerificationPage />;
      case 'client-portal':
        return <ClientPortalPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'security-dashboard':
        return <SecurityDashboardPage />;
      case 'sessions':
        return <SessionManagementPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      <Header />
      <div className="flex flex-1 relative min-h-0">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto max-w-[1600px] mx-auto w-full min-w-0">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Modals */}
      <AiAssistantModal />
      <EmailModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;

