import React, { useState } from 'react';
import { SDLCPhase } from '@/lib/inferenceEngine';
import { Database, FileCode2, MessagesSquare, HardDrive, TestTube, ArrowRightCircle, Code, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const PHASES: { label: SDLCPhase; icon: React.ReactNode; placeholder: string }[] = [
  { label: "Requirement Elicitation", icon: <MessagesSquare className="w-5 h-5" />, placeholder: "e.g., 'The system shall process financial data quickly'" },
  { label: "Architectural Design", icon: <Database className="w-5 h-5" />, placeholder: "e.g., UML Component Diagram Data (JSON)" },
  { label: "Development", icon: <FileCode2 className="w-5 h-5" />, placeholder: "e.g., function calculateTotal(items) {..." },
  { label: "Testing", icon: <TestTube className="w-5 h-5" />, placeholder: "e.g., Commit hash 8f3a9b - Code churn + cyclomatic complexity metrics" },
  { label: "Deployment & Monitoring", icon: <HardDrive className="w-5 h-5" />, placeholder: "e.g., Kubernetes pod telemetry stream - CPU spike detected" },
  { label: "Maintenance & Evolution", icon: <Database className="w-5 h-5" />, placeholder: "e.g., SonarQube historical scan data for the past 6 months" },
];

interface InputLayerProps {
  onAnalyze: (phase: SDLCPhase, data: string) => void;
  isLoading: boolean;
}

export function InputLayer({ onAnalyze, isLoading }: InputLayerProps) {
  const [activePhase, setActivePhase] = useState<SDLCPhase>("Requirement Elicitation");
  const [data, setData] = useState("");

  const activePhaseDetails = PHASES.find(p => p.label === activePhase);

  const [isPulling, setIsPulling] = useState(false);
  const [customRepo, setCustomRepo] = useState("vercel/next.js");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.trim() || isLoading) return;
    onAnalyze(activePhase, data);
  };

  const handleRealIntegration = async (tool: string) => {
    setIsPulling(true);
    setData(`[Establishing LIVE external connection to ${tool} API...]\n\nAuthenticating...`);
    
    try {
      const res = await fetch(`/api/integration?tool=${encodeURIComponent(tool)}&repo=${encodeURIComponent(customRepo)}`);
      if (res.ok) {
        const result = await res.json();
        setData(JSON.stringify(result, null, 2));
      } else {
        setData(`[Error] Failed to connect to ${tool}. Ensure the repository "${customRepo}" is public and typed correctly (e.g., owner/repo).`);
      }
    } catch (err) {
      setData(`[Error] Network failure connecting to ${tool}.`);
    } finally {
      setIsPulling(false);
    }
  };

  const INTEGRATIONS: Record<SDLCPhase, { tool: string; icon: React.ReactNode }> = {
    "Requirement Elicitation": {
      tool: "Jira API",
      icon: <Database className="w-3.5 h-3.5 mr-2 text-blue-500" />
    },
    "Architectural Design": {
      tool: "AWS Architecture",
      icon: <Activity className="w-3.5 h-3.5 mr-2 text-orange-500" />
    },
    "Development": {
      tool: "GitHub Actions",
      icon: <Code className="w-3.5 h-3.5 mr-2 text-slate-800" />
    },
    "Testing": {
      tool: "SonarQube",
      icon: <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" />
    },
    "Deployment & Monitoring": {
      tool: "Datadog",
      icon: <Activity className="w-3.5 h-3.5 mr-2 text-purple-500" />
    },
    "Maintenance & Evolution": {
      tool: "Sentry",
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-2 text-red-500" />
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 p-5 sm:p-8 transition-opacity">
      <div className="mb-8 border-b border-slate-100 pb-5">
        <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-indigo-500 font-semibold uppercase mb-2">Input & Routing Layer</p>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">Select SDLC Phase Context</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {PHASES.map((phase) => {
          const isActive = activePhase === phase.label;
          return (
            <button
              type="button"
              key={phase.label}
              disabled={isLoading}
              onClick={() => {
                setActivePhase(phase.label);
                setData(""); // Reset data on phase change
              }}
              className={`group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border transition-all duration-300 ${
                isActive 
                  ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:shadow-sm'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`mb-3 transition-transform duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-105'}`}>
                {phase.icon}
              </div>
              <span className={`text-xs text-center ${isActive ? 'font-bold' : 'font-medium'}`}>{phase.label}</span>
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Input Artifact Data
            </label>
            <p className="text-xs text-slate-500 mt-0.5">Enter JSON data manually or auto-pull from a live system.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {(activePhase === "Development" || activePhase === "Maintenance & Evolution") && (
              <input 
                type="text" 
                value={customRepo}
                onChange={(e) => setCustomRepo(e.target.value)}
                placeholder="e.g. facebook/react"
                className="px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-300 w-full sm:w-48 transition-all"
                title="Public GitHub Repository (owner/repo)"
              />
            )}
            <button
              type="button"
              onClick={() => handleRealIntegration(INTEGRATIONS[activePhase].tool)}
              disabled={isLoading || isPulling}
              className="flex items-center justify-center px-4 py-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-semibold text-slate-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {INTEGRATIONS[activePhase].icon}
              {isPulling ? "Pulling Live Data..." : `Auto-Pull from ${INTEGRATIONS[activePhase].tool}`}
            </button>
          </div>
        </div>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          disabled={isLoading || isPulling}
          placeholder={activePhaseDetails?.placeholder}
          className="w-full h-32 sm:h-40 p-5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-mono text-sm resize-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
          required
        />
        
        <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-5">
          <p className="text-xs font-medium text-slate-400 hidden sm:block">Data is sent to the backend inference engine</p>
          <motion.button 
            whileHover={!isLoading && data.trim() ? { scale: 1.02 } : {}}
            whileTap={!isLoading && data.trim() ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isLoading || !data.trim()}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/30 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed disabled:text-slate-500"
          >
            {isLoading ? 'Processing...' : 'Run XAI Pipeline'}
            {!isLoading && <ArrowRightCircle className="w-4 h-4 ml-2" />}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
