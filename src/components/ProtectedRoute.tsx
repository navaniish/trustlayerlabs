import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07111C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#168BFF] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Verifying Cryptographic Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will trigger login view in App.tsx
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 font-outfit">403 Forbidden — Access Denied</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your account role does not possess authorization to access this security resource.
        </p>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 font-outfit">403 Forbidden — Permission Required</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Required permission <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-700 font-mono">{requiredPermission}</code> is missing from your active session privileges.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
