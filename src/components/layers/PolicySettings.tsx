'use client';

import React from 'react';
import { Settings, ShieldAlert, ShieldCheck, Sliders, Lock } from 'lucide-react';

interface PolicySettingsProps {
  riskThreshold: number;
  setRiskThreshold: (val: number) => void;
  currentUser?: {
    name: string;
    role: string;
    email: string;
  };
}

export function PolicySettings({ riskThreshold, setRiskThreshold, currentUser }: PolicySettingsProps) {
  const getPolicyLabel = () => {
    if (riskThreshold <= 0.45) return { name: "Strict Compliance (Regulated FinTech / Defense)", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (riskThreshold <= 0.75) return { name: "Enterprise Balanced (Default DevSecOps)", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
    return { name: "Permissive / Agile Velocity", color: "text-amber-600 bg-amber-50 border-amber-200" };
  };

  const policy = getPolicyLabel();
  const canEditPolicy = !currentUser || currentUser.role === 'SECURITY_LEAD' || currentUser.role === 'NIST_AUDITOR';
  const isSecurityOfficer = currentUser?.role === 'SECURITY_LEAD' || currentUser?.role === 'NIST_AUDITOR';

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
            Autonomous Policy Interception Engine
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${policy.color}`}>
            {policy.name}
          </span>
          {currentUser && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
              isSecurityOfficer 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {isSecurityOfficer ? `🛡️ Policy Admin: ${currentUser.name}` : `Operator: ${currentUser.name}`}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 max-w-xl">
          Deterministic risk threshold <span className="font-mono font-semibold text-slate-700">T</span>. Artifacts with predictive risk <span className="font-mono font-semibold text-slate-700">R ≥ T</span> trigger automated <strong className="text-slate-800">SECURITY_OVERRIDE</strong>, enforcing high-urgency remediation modals.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        {/* Preset quick buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
          {!canEditPolicy && (
            <span className="px-2 py-0.5 text-[10px] text-amber-700 font-bold flex items-center gap-1" title="Threshold tuning restricted to DevSecOps Lead (Alex Vance)">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Locked</span>
            </span>
          )}
          <button
            type="button"
            disabled={!canEditPolicy}
            onClick={() => setRiskThreshold(0.4)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              riskThreshold === 0.4 ? 'bg-white font-bold text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            } ${!canEditPolicy ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!canEditPolicy ? "Requires SECURITY_LEAD role to modify" : "Strict Policy"}
          >
            Strict (0.4)
          </button>
          <button
            type="button"
            disabled={!canEditPolicy}
            onClick={() => setRiskThreshold(0.75)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              riskThreshold === 0.75 ? 'bg-white font-bold text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            } ${!canEditPolicy ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!canEditPolicy ? "Requires SECURITY_LEAD role to modify" : "Standard Policy"}
          >
            Standard (0.75)
          </button>
          <button
            type="button"
            disabled={!canEditPolicy}
            onClick={() => setRiskThreshold(0.9)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              riskThreshold === 0.9 ? 'bg-white font-bold text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            } ${!canEditPolicy ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!canEditPolicy ? "Requires SECURITY_LEAD role to modify" : "Permissive Policy"}
          >
            Permissive (0.9)
          </button>
        </div>

        {/* Range Slider */}
        <div className={`flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 ${!canEditPolicy ? 'opacity-70' : ''}`}>
          <ShieldAlert className={`w-4 h-4 shrink-0 ${riskThreshold <= 0.5 ? 'text-rose-500' : 'text-amber-500'}`} />
          <div className="w-36">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 mb-1">
              <span>0.10</span>
              <span className="text-indigo-600">{(riskThreshold * 100).toFixed(0)}%</span>
              <span>0.90</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="0.9" 
              step="0.05"
              disabled={!canEditPolicy}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
              className={`w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none ${!canEditPolicy ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              title={!canEditPolicy ? "Requires SECURITY_LEAD role to tune threshold" : "Adjust Policy Threshold"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
