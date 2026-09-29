import React, { useEffect, useState } from 'react';
import { Database, Clock, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditLogEntry {
  id: string;
  phase: string;
  inputData: string;
  aiPredictionLabel: string;
  aiProbability: number;
  xaiModality: string;
  createdAt: string;
}

export function AuditLogTable({ refreshTrigger }: { refreshTrigger: number }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="mt-12 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="p-5 sm:p-8 border-b border-slate-200/60 flex items-center justify-between bg-slate-50/50">
        <div>
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-indigo-500 font-semibold uppercase flex items-center mb-2">
            <ShieldCheck className="w-3.5 h-3.5 mr-2 text-indigo-500" />
            Regulatory Compliance
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">XAI Audit Logs</h2>
        </div>
        <div className="flex gap-2">
          <a 
            href="/api/export" 
            download
            className="p-2.5 flex items-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm transition-all duration-200"
            title="Download CSV Export"
          >
            <span className="text-xs font-semibold mr-2 hidden sm:inline-block">Export CSV</span>
            <Database className="w-4 h-4" />
          </a>
          <button 
            onClick={fetchLogs} 
            disabled={isLoading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm transition-all duration-200 disabled:opacity-50"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading && logs.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-400 font-mono flex flex-col items-center bg-white/50">
            <Database className="w-8 h-8 mb-4 text-slate-300 animate-pulse" />
            Querying Secure Database...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-500 font-mono bg-white/50">
            No audit logs found. Run the XAI pipeline above to generate database records.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600 bg-white">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-mono tracking-widest text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-5 font-semibold">Timestamp</th>
                <th className="px-6 py-5 font-semibold">SDLC Phase</th>
                <th className="px-6 py-5 font-semibold">AI Prediction</th>
                <th className="px-6 py-5 font-semibold">XAI Modality Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {logs.map((log) => (
                <motion.tr 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  key={log.id} 
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-[11px] whitespace-nowrap flex items-center text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{log.phase}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Activity className={`w-3.5 h-3.5 mr-2 ${log.aiProbability > 0.8 ? 'text-rose-500' : 'text-emerald-500'}`} />
                      <span className="font-mono text-xs font-semibold mr-2 text-slate-700">{(log.aiProbability * 100).toFixed(0)}%</span>
                      <span className="truncate max-w-[150px] text-slate-500" title={log.aiPredictionLabel}>{log.aiPredictionLabel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold tracking-wide border border-indigo-100/50 uppercase">
                      {log.xaiModality}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
