"use client";

import React, { useState } from 'react';
import { InputLayer } from '@/components/layers/InputLayer';
import { PresentationLayer } from '@/components/layers/PresentationLayer';
import { AuditLogTable } from '@/components/layers/AuditLog';
import { AnalyticsDashboard } from '@/components/layers/AnalyticsDashboard';
import { PolicySettings } from '@/components/layers/PolicySettings';
import { UserSessionHeader, UserSession, PRESET_USERS } from '@/components/auth/UserSessionHeader';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { ApiSettingsModal } from '@/components/modals/ApiSettingsModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SDLCPhase, AIPrediction } from '@/lib/inferenceEngine';
import { RoutingOutput } from '@/lib/routingLayer';
import { Shield, AlertTriangle, CheckCircle2, Award, KeyRound } from 'lucide-react';

export default function Home() {
  const [pipelineState, setPipelineState] = useState<{
    prediction: AIPrediction;
    routing: RoutingOutput;
    telemetry?: any;
    astMetrics?: any;
    suggestedPatch?: any;
  } | null>(null);

  const [currentPhase, setCurrentPhase] = useState<SDLCPhase>("Development");
  const [payloadData, setPayloadData] = useState<string>(
    `const query = "SELECT * FROM users WHERE username = '" + userInput + "';";`
  );
  const [selectedModel, setSelectedModel] = useState<string>("qwen/qwen3.8-27b");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshLogs, setRefreshLogs] = useState(0);
  const [riskThreshold, setRiskThreshold] = useState(0.75);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('xai_auth_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        // Initialize default authenticated session for Yash Pable
        setCurrentUser(PRESET_USERS[0]);
        localStorage.setItem('xai_auth_user', JSON.stringify(PRESET_USERS[0]));
      }
    } catch (e) {
      setCurrentUser(PRESET_USERS[0]);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('xai_auth_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('xai_auth_user');
    } catch (e) {}
  };

  const handleAnalyze = async (phase: SDLCPhase, data: string, model?: string) => {
    setIsLoading(true);
    setError(null);
    setPipelineState(null);

    const activeModel = model || selectedModel;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phase, 
          data, 
          riskThreshold, 
          model: activeModel,
          userId: currentUser?.id,
          userName: currentUser?.name || "Yash Pable",
          userEmail: currentUser?.email || "yash.pable@sitrc.ac.in",
          userRole: currentUser?.role || "DEVELOPER"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request. Please try again.");
      }

      const result = await response.json();
      setPipelineState(result);
      setRefreshLogs(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPatch = (patchedCode: string) => {
    setPayloadData(patchedCode);
    handleAnalyze(currentPhase, patchedCode, selectedModel);
  };

  if (!currentUser && !isAuthChecking) {
    return <AuthScreen onSuccess={handleLoginSuccess} />;
  }

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-xs text-indigo-400">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
          Verifying Authenticated Operator Session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 pb-20 relative overflow-hidden">
      
      {/* Background Ambient Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[55%] rounded-full bg-rose-500/10 blur-[140px] pointer-events-none" />

      {/* Enterprise Top Navigation Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-slate-900 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0 border border-indigo-500/30 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-wider text-slate-900 font-mono uppercase">
                  COGNIGUARD <span className="text-indigo-600">XAI</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Enterprise Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono tracking-wide mt-0.5">
                Phase-Specific Explainability & Autonomous Policy Interception
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Configure Jira, GitHub, SonarQube & Datadog API Credentials"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">API Integrations</span>
            </button>
            {currentUser && (
              <UserSessionHeader 
                currentUser={currentUser} 
                onLogout={handleLogout} 
                onOpenApiSettings={() => setShowApiModal(true)}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-0">
        
        {/* Intro Hero Banner */}
        <div className="mb-8 max-w-3xl">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-[0.2em] inline-block mb-3">
            CONTINUOUS GOVERNANCE & EXPLAINABILITY PLATFORM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Cognitive Guardrails for Software Development Lifecycles
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A phase-specific framework mapping black-box predictive models to tailored explainability modalities (Attention, Local SHAP, Rule Extraction, Counterfactuals) across all 6 SDLC phases with automated risk-based policy interception.
          </p>
        </div>

        {/* Pipeline Interface */}
        <div className="space-y-6">
          {/* Policy Settings Bar */}
          <PolicySettings 
            riskThreshold={riskThreshold} 
            setRiskThreshold={setRiskThreshold} 
            currentUser={currentUser || undefined}
          />
          
          {/* Input Layer */}
          <InputLayer 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading}
            activePhase={currentPhase}
            setActivePhase={setCurrentPhase}
            data={payloadData}
            setData={setPayloadData}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          
          {/* Error Banner */}
          {error && (
            <div className="flex items-center p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm shadow-sm font-mono">
              <AlertTriangle className="w-4 h-4 mr-3 shrink-0 text-rose-500" />
              {error}
            </div>
          )}

          {/* Loading Animation */}
          {isLoading && !error && (
            <div className="mt-8">
              <LoadingSpinner text="Executing Groq LPU Inference & Contextual Modality Routing..." />
            </div>
          )}
          
          {/* Output Presentation Layer */}
          {pipelineState && !isLoading && (
            <PresentationLayer 
              prediction={pipelineState.prediction} 
              routing={pipelineState.routing}
              telemetry={pipelineState.telemetry}
              suggestedPatch={pipelineState.suggestedPatch}
              astMetrics={pipelineState.astMetrics}
              onApplyPatch={handleApplyPatch}
              currentUser={currentUser || undefined}
            />
          )}

          {/* Executive Analytics Dashboard */}
          <AnalyticsDashboard refreshTrigger={refreshLogs} />

          {/* Database Audit Log */}
          <AuditLogTable refreshTrigger={refreshLogs} currentUser={currentUser || undefined} />
        </div>

      </main>

      {/* Sleek Enterprise Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white/70 py-8 text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="font-bold">CogniGuard XAI Platform</span>
            <span>&bull;</span>
            <span className="text-slate-500">Continuous DevSecOps Intelligence</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span>&bull;</span>
            <span>NIST AI RMF 1.0</span>
            <span>&bull;</span>
            <span>ISO/IEC 42001:2023</span>
          </div>
        </div>
      </footer>
      {/* API Integrations Vault Modal */}
      <ApiSettingsModal isOpen={showApiModal} onClose={() => setShowApiModal(false)} />
    </div>
  );
}
