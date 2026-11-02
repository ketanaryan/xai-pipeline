'use client';

import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, User, Building, ArrowRight, 
  CheckCircle2, AlertTriangle, Sparkles, Terminal, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSession, ROLE_CONFIGS } from './UserSessionHeader';

interface AuthScreenProps {
  onSuccess: (user: UserSession) => void;
}

const PRESET_DEMO_ACCOUNTS = [
  {
    name: "Yash Pable",
    email: "yash.pable@sitrc.ac.in",
    role: "DEVELOPER",
    roleName: "Lead Developer",
    icon: "💻"
  },
  {
    name: "Alex Vance",
    email: "alex.vance@sitrc.ac.in",
    role: "SECURITY_LEAD",
    roleName: "DevSecOps Lead",
    icon: "🛡️"
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@sitrc.ac.in",
    role: "QA_ENGINEER",
    roleName: "QA Lead",
    icon: "🧪"
  },
  {
    name: "David Chen",
    email: "david.chen@sppu.ac.in",
    role: "NIST_AUDITOR",
    roleName: "SPPU Auditor",
    icon: "📋"
  }
];

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Form Fields
  const [email, setEmail] = useState('yash.pable@sitrc.ac.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [department, setDepartment] = useState('Department of Computer Engineering, SITRC');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'LOGIN') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to authenticate.');
        onSuccess(data.user);
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
            department: department.trim()
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to register account.');
        onSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPresetLogin = (preset: typeof PRESET_DEMO_ACCOUNTS[0]) => {
    setEmail(preset.email);
    setPassword('password123');
    setMode('LOGIN');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-rose-600/10 blur-[160px] pointer-events-none" />

      {/* Top Academic Header */}
      <div className="text-center mb-6 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-400 mb-3 shadow-inner">
          <Terminal className="w-3.5 h-3.5" />
          <span>SITRC Nashik &bull; SPPU Academic Year 2026 - 2027</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            XAI SDLC Portal
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Phase-Specific Explainable Artificial Intelligence Framework &bull; Stage-I
        </p>
      </div>

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative z-10"
      >
        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(null); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'LOGIN'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('SIGNUP'); setError(null); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'SIGNUP'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'SIGNUP' && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yash Pable or Prof. Examiner"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                    Role (RBAC)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="DEVELOPER">Lead Developer</option>
                    <option value="SECURITY_LEAD">DevSecOps Lead</option>
                    <option value="QA_ENGINEER">QA Lead</option>
                    <option value="NIST_AUDITOR">NIST / SPPU Auditor</option>
                    <option value="ARCHITECT">Software Architect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="SITRC / SPPU"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@sitrc.ac.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
            {mode === 'LOGIN' && (
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Default password for seeded accounts: <code className="text-indigo-400">password123</code>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs font-mono rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Authenticating with Neon Cloud...</span>
            ) : mode === 'LOGIN' ? (
              <>
                <span>Sign In to Framework</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create & Register Operator</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Demo Persona Login:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            {PRESET_DEMO_ACCOUNTS.map((p) => (
              <button
                type="button"
                key={p.email}
                onClick={() => handleQuickPresetLogin(p)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
                title={`Click to fill credentials for ${p.name}`}
              >
                <div className="font-bold text-slate-200 group-hover:text-indigo-400 flex items-center gap-1 truncate">
                  <span>{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </div>
                <div className="text-[9px] text-slate-500 truncate mt-0.5">
                  {p.roleName}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Governance Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800/60 text-center text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>PBKDF2 SHA-512 Salted Hashing &bull; Neon PostgreSQL</span>
        </div>
      </motion.div>
    </div>
  );
}
