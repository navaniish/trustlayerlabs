import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Activity,
  UserCheck,
  KeyRound,
  AlertTriangle,
  RefreshCw,
  Clock,
  Terminal,
  Server,
  Filter,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface SecurityMetrics {
  total_users: number;
  active_sessions_count: number;
  failed_logins_24h: number;
  suspicious_token_reuse_count: number;
  locked_accounts_count: number;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  event_type: string;
  user_email: string | null;
  ip_address: string | null;
  severity: string;
  details: any;
}

export const SecurityDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [resMetrics, resAudit] = await Promise.all([
        apiClient.get('/api/v1/admin/security/dashboard'),
        apiClient.get('/api/v1/admin/security/audit-logs?limit=50'),
      ]);
      setMetrics(resMetrics.data);
      setAuditLogs(resAudit.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to load security monitoring metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter === 'ALL') return true;
    return log.severity.toUpperCase() === severityFilter.toUpperCase();
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
      case 'SECURITY_ALERT':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-[#168BFF]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 font-outfit">
                Security & Audit Event Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Real-time security telemetry, token family reuse detection, session monitoring, and audit log analysis.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>TOTAL USERS</span>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">
            {metrics?.total_users ?? '—'}
          </div>
          <p className="text-[10px] text-slate-400">Registered tenant accounts</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>ACTIVE SESSIONS</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-outfit">
            {metrics?.active_sessions_count ?? '—'}
          </div>
          <p className="text-[10px] text-emerald-700">Currently active sessions</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>FAILED LOGINS (24H)</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-outfit">
            {metrics?.failed_logins_24h ?? '—'}
          </div>
          <p className="text-[10px] text-slate-400">Throttled login attempts</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>TOKEN REUSE ALERTS</span>
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 font-outfit">
            {metrics?.suspicious_token_reuse_count ?? '0'}
          </div>
          <p className="text-[10px] text-rose-700 font-semibold">Revoked token families</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>LOCKED ACCOUNTS</span>
            <KeyRound className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-outfit">
            {metrics?.locked_accounts_count ?? '0'}
          </div>
          <p className="text-[10px] text-slate-400">Brute-force lockouts</p>
        </div>
      </div>

      {/* Security Audit Event Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Security Audit Trail Log</h2>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-semibold outline-none focus:border-[#168BFF]"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="SECURITY_ALERT">Security Alert</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">User Email</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No security audit events recorded matching current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.event_type}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-sans font-medium">
                      {log.user_email || 'System / Unauthenticated'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{log.ip_address || '127.0.0.1'}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] border uppercase ${getSeverityBadge(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-sans text-[11px] truncate max-w-xs">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
