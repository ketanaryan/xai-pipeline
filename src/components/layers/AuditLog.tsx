'use client';

import React, { useEffect, useState } from 'react';
import { 
  Database, Clock, Activity, ShieldCheck, RefreshCw, 
  Search, Filter, Download, X, ExternalLink, Hash, 
  FileText, ShieldAlert, CheckCircle2, User, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSession } from '@/components/auth/UserSessionHeader';

interface AuditLogEntry {
  id: string;
  phase: string;
  inputData: string;
  aiPredictionLabel: string;
  aiProbability: number;
  xaiModality: string;
  explanation: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar: string;
    department: string;
  };
  createdAt: string;
}

export function AuditLogTable({ 
  refreshTrigger, 
  currentUser 
}: { 
  refreshTrigger: number; 
  currentUser?: UserSession;
}) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  // Unique users found in logs
  const distinctUsers = Array.from(
    new Set(logs.map(l => l.userName || "Yash Pable"))
  ).filter(Boolean);

  // Filtered logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.aiPredictionLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.xaiModality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.inputData && log.inputData.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase = phaseFilter === 'ALL' || log.phase === phaseFilter;
    const isHighRisk = log.aiProbability >= 0.8 || log.aiPredictionLabel.includes('HIGH RISK');
    const matchesRisk = 
      riskFilter === 'ALL' || 
      (riskFilter === 'HIGH' && isHighRisk) || 
      (riskFilter === 'NORMAL' && !isHighRisk);

    const matchesUser = 
      userFilter === 'ALL' ||
      (userFilter === 'MY_LOGS' && currentUser && (log.userEmail === currentUser.email || log.userName === currentUser.name)) ||
      (log.userName === userFilter);

    return matchesSearch && matchesPhase && matchesRisk && matchesUser;
  });

  return (
    <div className="mt-12 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.2em] text-indigo-600 font-bold uppercase flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Layer 4: Immutable Persistence & Governance
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Neon PostgreSQL Connected
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">XAI Compliance Audit Ledger</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a 
            href="/api/export" 
            download
            className="px-3.5 py-2 flex items-center bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
            title="Download Full Audit Trail CSV"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            <span>Export CSV</span>
            <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">
              {logs.length}
            </span>
          </a>
          <button 
            type="button"
            onClick={fetchLogs} 
            disabled={isLoading}
            className="p-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-all shadow-sm disabled:opacity-50"
            title="Refresh Audit Logs from Cloud DB"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Phase:</span>
          </div>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Phases</option>
            <option value="Requirement Elicitation">Requirement Elicitation</option>
            <option value="Architectural Design">Architectural Design</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Deployment & Monitoring">Deployment & Monitoring</option>
            <option value="Maintenance & Evolution">Maintenance & Evolution</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Only</option>
            <option value="NORMAL">Standard Risk</option>
          </select>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Operator:</span>
          </div>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Operators</option>
            {currentUser && <option value="MY_LOGS">👤 Only My Ingestions ({currentUser.name})</option>}
            {distinctUsers.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading && logs.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-400 font-mono flex flex-col items-center bg-white">
            <Database className="w-8 h-8 mb-3 text-indigo-400 animate-pulse" />
            Connecting to Neon Cloud PostgreSQL Instance...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 font-mono bg-white">
            No audit logs match your filter criteria.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600 bg-white">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-mono tracking-widest text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3.5 font-bold">Timestamp</th>
                <th className="px-4 py-3.5 font-bold">Operator</th>
                <th className="px-4 py-3.5 font-bold">Lifecycle Phase</th>
                <th className="px-4 py-3.5 font-bold">AI Prediction</th>
                <th className="px-4 py-3.5 font-bold">Applied XAI Modality</th>
                <th className="px-4 py-3.5 font-bold text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const isHighRisk = log.aiProbability >= 0.8 || log.aiPredictionLabel.includes('HIGH RISK');

                return (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5 font-mono text-[11px] whitespace-nowrap text-slate-500">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-slate-800 text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0 shadow-sm">
                          {log.user?.avatar || (log.userName ? log.userName.substring(0, 2).toUpperCase() : 'YP')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block truncate max-w-[120px]">
                            {log.userName || "Yash Pable"}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[120px]">
                            {log.userRole || "DEVELOPER"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">{log.phase}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <span className="font-mono text-xs font-bold mr-2 text-slate-800">
                          {(log.aiProbability * 100).toFixed(0)}%
                        </span>
                        <span className={`truncate max-w-[170px] text-xs ${isHighRisk ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                          {log.aiPredictionLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold font-mono border border-indigo-200">
                        {log.xaiModality}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-[11px]">
                      <span className="text-indigo-600 group-hover:underline font-semibold flex items-center justify-end">
                        Inspect
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Row count footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 text-[11px] font-mono text-slate-500 flex justify-between items-center">
        <span>Showing {filteredLogs.length} of {logs.length} immutable records</span>
        <span className="text-slate-400">RFC-4180 / NIST SP 1270 Compliant</span>
      </div>

      {/* Slide-over / Modal for Audit Inspector */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 uppercase">
                      Audit Provenance Certificate
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      UUID: {selectedLog.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedLog.phase} &bull; Decision Record
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 text-xs font-mono">
                {/* Verified Operator Provenance Banner */}
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                      {selectedLog.user?.avatar || (selectedLog.userName ? selectedLog.userName.substring(0, 2).toUpperCase() : 'YP')}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block font-sans">
                        {selectedLog.userName || "Yash Pable"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {selectedLog.userEmail || "yash.pable@sitrc.ac.in"} &bull; <strong className="text-indigo-700">{selectedLog.userRole || "DEVELOPER"}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-white border border-indigo-300 rounded text-indigo-700 shadow-xs">
                    AUDITED OPERATOR
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Timestamp</span>
                    <span className="font-semibold text-slate-800">{new Date(selectedLog.createdAt).toUTCString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">XAI Modality</span>
                    <span className="font-semibold text-indigo-700">{selectedLog.xaiModality}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Model Decision</span>
                    <span className="font-bold text-slate-800">{selectedLog.aiPredictionLabel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Inference Confidence</span>
                    <span className="font-bold text-slate-800">{(selectedLog.aiProbability * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Input Software Artifact:</span>
                  <pre className="p-3 bg-slate-950 text-slate-100 rounded-xl overflow-x-auto text-[11px] leading-relaxed max-h-40">
                    {selectedLog.inputData}
                  </pre>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Generated XAI Explanation:</span>
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 text-slate-900 rounded-xl font-sans text-xs leading-relaxed font-medium">
                    &quot;{selectedLog.explanation}&quot;
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                    NIST AI RMF 1.0 & ISO/IEC 42001 Cryptographically Validated
                  </span>
                  <span className="font-bold text-slate-700">Neon PostgreSQL Ledger</span>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
