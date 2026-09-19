import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Monitor, ShieldAlert, Trash2, LogOut, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

interface ActiveSession {
  id: string;
  device_name: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_used_at: string;
  is_current: boolean;
}

export const SessionManagementPage: React.FC = () => {
  const { logoutAll } = useAuth();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/api/v1/auth/sessions');
      setSessions(data);
    } catch (e: any) {
      setStatusMsg('Failed to load active device sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await apiClient.delete(`/api/v1/auth/sessions/${sessionId}`);
      setStatusMsg('Remote device session successfully revoked.');
      fetchSessions();
    } catch (e: any) {
      setStatusMsg('Failed to revoke session.');
    }
  };

  const handleRevokeAll = async () => {
    if (window.confirm('Are you sure you want to log out from all devices?')) {
      await logoutAll();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 font-outfit">Active Device Sessions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your authenticated devices, view last active timestamps, and terminate unauthorized sessions.
          </p>
        </div>

        <button
          onClick={handleRevokeAll}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout From All Devices</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#168BFF]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Loading active sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No active session records found.
          </div>
        ) : (
          sessions.map((sess) => (
            <div
              key={sess.id}
              className={`p-4 rounded-2xl bg-white border transition-all flex items-center justify-between shadow-xs ${
                sess.is_current ? 'border-[#168BFF] ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
                  {sess.device_name.toLowerCase().includes('mobile') ? (
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Laptop className="w-5 h-5 text-[#168BFF]" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">{sess.device_name}</span>
                    {sess.is_current && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        THIS DEVICE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 font-mono">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{sess.ip_address}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Last active: {new Date(sess.last_used_at).toLocaleString('en-IN')}</span>
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                    {sess.user_agent}
                  </p>
                </div>
              </div>

              {!sess.is_current && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                  title="Revoke Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
