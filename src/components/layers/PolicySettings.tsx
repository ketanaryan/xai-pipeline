import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface PolicySettingsProps {
  riskThreshold: number;
  setRiskThreshold: (val: number) => void;
}

export function PolicySettings({ riskThreshold, setRiskThreshold }: PolicySettingsProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 flex items-center">
          <Settings className="w-4 h-4 mr-2 text-indigo-500" />
          Enterprise Risk Policy Engine
        </h3>
        <p className="text-xs text-slate-500 mt-1">Configure the global threshold for categorizing AI predictions as High-Risk.</p>
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto bg-slate-50 p-3 rounded-xl border border-slate-200/60">
        <ShieldAlert className={`w-4 h-4 ${riskThreshold < 0.5 ? 'text-red-500' : 'text-amber-500'}`} />
        <div className="flex-1 sm:w-48">
          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold mb-1 uppercase tracking-wider">
            <span>Strict (0.1)</span>
            <span className="text-indigo-600 font-bold">{(riskThreshold * 100).toFixed(0)}% Threshold</span>
            <span>Lenient (0.9)</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="0.9" 
            step="0.05"
            value={riskThreshold}
            onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
