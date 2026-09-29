"use client";

import React, { useState } from 'react';
import { InputLayer } from '@/components/layers/InputLayer';
import { PresentationLayer } from '@/components/layers/PresentationLayer';
import { AuditLogTable } from '@/components/layers/AuditLog';
import { AnalyticsDashboard } from '@/components/layers/AnalyticsDashboard';
import { PolicySettings } from '@/components/layers/PolicySettings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SDLCPhase, AIPrediction } from '@/lib/inferenceEngine';
import { RoutingOutput } from '@/lib/routingLayer';
import { Code, Shield, AlertTriangle, Settings } from 'lucide-react';

export default function Home() {
  const [pipelineState, setPipelineState] = useState<{
    prediction: AIPrediction;
    routing: RoutingOutput;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshLogs, setRefreshLogs] = useState(0);
  const [riskThreshold, setRiskThreshold] = useState(0.8);

  const handleAnalyze = async (phase: SDLCPhase, data: string) => {
    setIsLoading(true);
    setError(null);
    setPipelineState(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase, data, riskThreshold }),
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 pb-20 relative overflow-hidden">
      
      {/* Premium Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl flex items-center justify-center shadow-md shadow-slate-900/20 shrink-0 border border-slate-700">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-[13px] font-bold tracking-wider text-slate-900 uppercase">XAI SDLC Framework</h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] hidden sm:block uppercase mt-0.5">Phase-Specific Routing Engine</p>
            </div>
          </div>
          <div className="text-[10px] sm:text-xs font-semibold tracking-wide text-slate-600 flex items-center px-3.5 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full">
            <Code className="w-3.5 h-3.5 mr-2 text-indigo-500" />
            Production Ready
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-0">
        
        {/* Intro */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-5 tracking-tight">Contextual AI Transparency</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            This dashboard demonstrates the dynamic routing architecture for Explainable AI (XAI) across the software development lifecycle. By decoupling the predictive model from the explanation engine, the system ensures that different stakeholders receive mathematically tailored explanations via an enterprise-grade backend pipeline.
          </p>
        </div>

        {/* Pipeline Interface */}
        <div className="space-y-6">
          <PolicySettings riskThreshold={riskThreshold} setRiskThreshold={setRiskThreshold} />
          
          <InputLayer onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4 mr-3 shrink-0" />
              {error}
            </div>
          )}

          {isLoading && !error && (
            <div className="mt-8">
              <LoadingSpinner text="Simulating Backend AI Inference..." />
            </div>
          )}
          
          {pipelineState && !isLoading && (
            <PresentationLayer 
              prediction={pipelineState.prediction} 
              routing={pipelineState.routing} 
            />
          )}

          {/* Executive Analytics Dashboard */}
          <AnalyticsDashboard refreshTrigger={refreshLogs} />

          {/* Database Audit Log */}
          <AuditLogTable refreshTrigger={refreshLogs} />
        </div>

      </main>
    </div>
  );
}
