'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, LogOut, ChevronDown, Check, Building, 
  Briefcase, Lock, User, KeyRound, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'SECURITY_LEAD' | 'DEVELOPER' | 'QA_ENGINEER' | 'NIST_AUDITOR' | 'ARCHITECT' | string;
  avatar: string;
  department: string;
}

export const PRESET_USERS: UserSession[] = [
  {
    id: "0ac87716-a1a2-421d-a0cc-8c81c52d8b1d",
    name: "Yash Pable",
    email: "yash.pable@sitrc.ac.in",
    role: "DEVELOPER",
    avatar: "YP",
    department: "Department of Computer Engineering, SITRC (Seat 112023528)"
  },
  {
    id: "ab53efaf-7d45-4935-af14-c41c888a6361",
    name: "Alex Vance",
    email: "alex.vance@sitrc.ac.in",
    role: "SECURITY_LEAD",
    avatar: "AV",
    department: "DevSecOps & Security Center of Excellence"
  },
  {
    id: "334d790e-3350-4cef-afd3-31c29ac39480",
    name: "Priya Sharma",
    email: "priya.sharma@sitrc.ac.in",
    role: "QA_ENGINEER",
    avatar: "PS",
    department: "Quality Automation & Continuous Verification"
  },
  {
    id: "f63bc9da-511f-4ca0-9e86-dbe9ef357b8e",
    name: "David Chen",
    email: "david.chen@sppu.ac.in",
    role: "NIST_AUDITOR",
    avatar: "DC",
    department: "Regulatory Governance Board, SPPU Pune"
  },
  {
    id: "06a94bbe-7f32-4b24-a9dd-a0b7a5ee5dd3",
    name: "Elena Rostova",
    email: "elena.rostova@sitrc.ac.in",
    role: "ARCHITECT",
    avatar: "ER",
    department: "Enterprise Software Architecture Directorate"
  }
];

export const ROLE_CONFIGS: Record<string, { label: string; badge: string; desc: string; icon: string }> = {
  DEVELOPER: {
    label: "Lead Software Engineer",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    desc: "AST Code Analysis, Attention Heatmaps, Automated Counterfactual Patching",
    icon: "💻"
  },
  SECURITY_LEAD: {
    label: "DevSecOps & Security Lead",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    desc: "Autonomous Policy Interception, Risk Threshold Tuning, CVE Mitigation",
    icon: "🛡️"
  },
  QA_ENGINEER: {
    label: "QA & Verification Lead",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    desc: "LIME / Local SHAP Waterfall, Sensitivity Sandboxes, Regression Verification",
    icon: "🧪"
  },
  NIST_AUDITOR: {
    label: "NIST / ISO Compliance Auditor",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    desc: "Unredacted Governance Ledger, ISO 42001 Certification, Cryptographic Receipts",
    icon: "📋"
  },
  ARCHITECT: {
    label: "Enterprise Solutions Architect",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    desc: "Component Coupling Metrics, God-Class Refactoring, Circular Dependency Graph",
    icon: "🏛️"
  }
};

interface UserSessionHeaderProps {
  currentUser: UserSession;
  onLogout: () => void;
}

export function UserSessionHeader({ currentUser, onLogout }: UserSessionHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const roleInfo = ROLE_CONFIGS[currentUser.role] || ROLE_CONFIGS.DEVELOPER;

  return (
    <div className="relative">
      {/* Session Pill Button in Top Nav */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-sm text-xs font-mono transition-all text-slate-800"
        title="View Authenticated Operator Profile & Session Details"
      >
        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
          {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-bold text-slate-900 leading-none flex items-center gap-1.5">
            <span>{currentUser.name}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${roleInfo.badge}`}>
              {roleInfo.icon} {currentUser.role}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans block mt-0.5 truncate max-w-[140px]">
            {currentUser.email}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {/* Profile & Security Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 text-xs font-sans"
          >
            {/* Header info */}
            <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{currentUser.name}</h4>
                <p className="text-slate-500 font-mono text-[11px] truncate">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${roleInfo.badge}`}>
                    {roleInfo.icon} {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Department & Role Info */}
            <div className="py-3 space-y-2 border-b border-slate-100 font-mono text-[11px]">
              <div className="flex items-start gap-2 text-slate-600">
                <Building className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                <span className="text-slate-700 font-sans text-xs">{currentUser.department}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <Briefcase className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                <span className="text-slate-600 font-sans text-[11px]">{roleInfo.desc}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified PostgreSQL Session Active</span>
              </div>
            </div>

            {/* Logout / Switch Account Action */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch Operator</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
