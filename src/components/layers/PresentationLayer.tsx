import React from 'react';
import { RoutingOutput } from '@/lib/routingLayer';
import { AIPrediction } from '@/lib/inferenceEngine';
import { Target, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PresentationLayerProps {
  prediction: AIPrediction;
  routing: RoutingOutput;
}

export function PresentationLayer({ prediction, routing }: PresentationLayerProps) {
  const isHighRisk = prediction.probability > 0.8;
  const colorClass = isHighRisk ? 'text-rose-600' : 'text-emerald-600';
  const bgColorClass = isHighRisk ? 'bg-rose-50/80' : 'bg-emerald-50/80';
  const borderColorClass = isHighRisk ? 'border-rose-200' : 'border-emerald-200';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:gap-6 p-5 sm:p-8 mt-8 border rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 border-slate-200/80"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-5 border-slate-100 gap-4">
        <div>
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-indigo-500 font-semibold uppercase mb-2">Presentation Layer</p>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">XAI Explanation Output</h3>
        </div>
        <div className={`inline-flex items-center self-start sm:self-auto px-4 py-2 rounded-full border ${bgColorClass} ${borderColorClass} ${colorClass}`}>
          <Target className="w-3.5 h-3.5 mr-2 shrink-0" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate max-w-[200px] sm:max-w-none">Target: {routing.targetStakeholder}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        <div className="col-span-1 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner">
          <p className="text-[10px] sm:text-xs font-mono text-slate-400 font-semibold uppercase tracking-[0.15em] mb-4 flex items-center">
            <Zap className="w-3.5 h-3.5 mr-2 text-amber-500" />
            AI Inference
          </p>
          <div className="mb-6">
            <p className="text-4xl sm:text-5xl font-light text-slate-800 tracking-tighter">{(prediction.probability * 100).toFixed(0)}<span className="text-2xl sm:text-3xl text-slate-400">%</span></p>
            <p className="text-sm font-semibold text-slate-600 mt-2">{prediction.label}</p>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 break-words font-mono bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            {JSON.stringify(prediction.metadata, null, 2)}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <p className="text-[10px] sm:text-xs font-mono text-slate-400 font-semibold uppercase tracking-[0.15em] mb-4 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-indigo-500" />
            Applied Modality: <span className="text-indigo-600 ml-2">{routing.modality}</span>
          </p>
          
          <div className="mt-4 sm:mt-6 p-5 sm:p-6 border-l-4 border-indigo-500 bg-gradient-to-br from-indigo-50/50 to-white rounded-r-xl text-indigo-950 font-medium leading-relaxed text-sm sm:text-base">
            {routing.explanationUI}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start sm:items-center text-[10px] sm:text-xs text-slate-500 font-medium leading-relaxed">
            <ArrowRight className="w-3.5 h-3.5 mr-2 mt-0.5 sm:mt-0 shrink-0 text-slate-400" />
            <span>This explanation is mathematically tailored for the cognitive model of <strong className="font-semibold text-slate-700">{routing.targetStakeholder.toLowerCase()}</strong>.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
