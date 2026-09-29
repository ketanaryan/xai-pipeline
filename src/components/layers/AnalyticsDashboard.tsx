'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export function AnalyticsDashboard({ refreshTrigger }: { refreshTrigger: number }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/logs').then(res => res.json()).then(setLogs).catch(() => {});
  }, [refreshTrigger]);

  if (logs.length === 0) return null;

  // Process data for charts
  const modalityCounts = logs.reduce((acc, log) => {
    acc[log.xaiModality] = (acc[log.xaiModality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(modalityCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const lineData = [...logs].reverse().map((log, i) => ({
    name: `Req ${i + 1}`,
    risk: parseFloat((log.aiProbability * 100).toFixed(0)),
    phase: log.phase
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Modality Distribution */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-200/40">
        <div className="mb-4">
          <p className="text-[10px] font-mono tracking-[0.2em] text-indigo-500 font-semibold uppercase mb-1 flex items-center">
            <BarChart2 className="w-3.5 h-3.5 mr-2" /> Distribution
          </p>
          <h3 className="text-lg font-semibold text-slate-800">XAI Modalities Deployed</h3>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Risk Scores */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-200/40">
        <div className="mb-4">
          <p className="text-[10px] font-mono tracking-[0.2em] text-rose-500 font-semibold uppercase mb-1 flex items-center">
            <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Real-time Metrics
          </p>
          <h3 className="text-lg font-semibold text-slate-800">AI Risk Trajectory</h3>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
