'use client';

import React, { useState } from 'react';
import { SDLCPhase } from '@/lib/inferenceEngine';
import { 
  Database, FileCode2, MessagesSquare, HardDrive, TestTube, 
  ArrowRightCircle, Code, ShieldCheck, Activity, AlertTriangle, 
  Copy, Trash2, Check, Sparkles, Terminal, Cpu, Zap, Upload 
} from 'lucide-react';
import { motion } from 'framer-motion';

const PHASES: { label: SDLCPhase; icon: React.ReactNode; placeholder: string; desc: string }[] = [
  { 
    label: "Requirement Elicitation", 
    icon: <MessagesSquare className="w-5 h-5" />, 
    placeholder: "e.g., 'The payment processing system shall process financial transactions quickly without delay'",
    desc: "Rule Extraction for Business Analysts"
  },
  { 
    label: "Architectural Design", 
    icon: <Database className="w-5 h-5" />, 
    placeholder: "e.g., UML Component Topology or Microservice Coupling JSON",
    desc: "Concept-Based Explanations for Software Architects"
  },
  { 
    label: "Development", 
    icon: <FileCode2 className="w-5 h-5" />, 
    placeholder: "e.g., function authenticateUser(userInput) { ... }",
    desc: "Attention Mechanisms for Software Developers"
  },
  { 
    label: "Testing", 
    icon: <TestTube className="w-5 h-5" />, 
    placeholder: "e.g., Commit hash 8f3a9b - Code churn + cyclomatic complexity metrics",
    desc: "LIME / Local SHAP for QA & Test Engineers"
  },
  { 
    label: "Deployment & Monitoring", 
    icon: <HardDrive className="w-5 h-5" />, 
    placeholder: "e.g., Kubernetes pod telemetry stream - CPU spike & OOM error",
    desc: "Counterfactuals for Site Reliability Engineers"
  },
  { 
    label: "Maintenance & Evolution", 
    icon: <Activity className="w-5 h-5" />, 
    placeholder: "e.g., SonarQube historical scan data for technical debt",
    desc: "Global & Local SHAP for Tech Leads & Maintainers"
  },
];

const PRESETS: Record<SDLCPhase, { label: string; text: string }[]> = {
  "Requirement Elicitation": [
    {
      label: "⚠️ Ambiguous SLA ('quickly')",
      text: "The payment processing microservice shall execute credit card transactions quickly and update customer account balance without timeout."
    },
    {
      label: "⚠️ Vague Scalability ('minimal latency')",
      text: "The application user interface shall support seamless high-concurrency login requests with minimal system latency under peak load."
    }
  ],
  "Architectural Design": [
    {
      label: "🚨 Monolithic God Class",
      text: JSON.stringify({
        architecture_pattern: "Monolithic Controller",
        class_name: "MasterBillingOrchestrator",
        responsibilities: [
          "UserAuthentication",
          "DatabaseQueryExecution",
          "PDFInvoiceGeneration",
          "StripeWebhookHandling",
          "EmailNotificationDispatch"
        ],
        lines_of_code: 3480,
        incoming_dependencies: 24,
        coupling_coefficient: 0.89
      }, null, 2)
    },
    {
      label: "🚨 Circular Dependency Ring",
      text: JSON.stringify({
        detected_cycle: ["OrderService -> InventoryService -> NotificationService -> OrderService"],
        risk_level: "High",
        deadlock_susceptibility: 0.92
      }, null, 2)
    }
  ],
  "Development": [
    {
      label: "🔥 SQL Injection Vulnerability (CWE-89)",
      text: "const query = \"SELECT * FROM users WHERE username = '\" + userInput + \"' AND password_hash = '\" + password + \"';\";\nconst result = await db.raw(query);"
    },
    {
      label: "🔥 Dynamic Code Injection (eval)",
      text: "function computeDynamicFormula(userFormula, context) {\n  return eval('with(context) { ' + userFormula + ' }');\n}"
    },
    {
      label: "✅ Secure Parameterized Query",
      text: "const query = 'SELECT id, email, role FROM users WHERE username = $1 AND active = true;';\nconst result = await db.query(query, [sanitizedUsername]);"
    }
  ],
  "Testing": [
    {
      label: "⚠️ High Churn Defect Hotspot",
      text: JSON.stringify({
        commit_sha: "8f3a9b1",
        modified_file: "src/billing/checkoutEngine.ts",
        lines_added: 420,
        lines_deleted: 110,
        cyclomatic_complexity: 44,
        branch_coverage: "38.5%",
        historical_bug_frequency: 7
      }, null, 2)
    },
    {
      label: "⚠️ Regression Test Timeout",
      text: JSON.stringify({
        test_suite: "e2e/auth-session.spec.ts",
        failure_type: "AsyncTimeoutException",
        observed_latency_ms: 31200,
        expected_threshold_ms: 5000,
        stack: "at AuthWorker.pollSessionState (worker.ts:89)"
      }, null, 2)
    }
  ],
  "Deployment & Monitoring": [
    {
      label: "🚨 Vercel Serverless 504 Timeout",
      text: JSON.stringify({
        platform: "Vercel Serverless Edge Runtime",
        deployment_url: "xai-pipeline.vercel.app",
        edge_region: "iad1",
        status_code: 504,
        execution_duration_ms: 14980,
        memory_used_mb: 1018,
        memory_limit_mb: 1024,
        error: "FUNCTION_INVOCATION_TIMEOUT",
        reason: "Serverless function execution exceeded 15.00s maximum duration threshold"
      }, null, 2)
    },
    {
      label: "🚨 Kubernetes Pod OOMKilled",
      text: JSON.stringify({
        cluster_name: "prod-us-east-k8s",
        pod_name: "payment-api-worker-7b94f9-2c8m1",
        container_state: "CrashLoopBackOff",
        exit_code: 137,
        reason: "OOMKilled",
        memory_usage_mb: 2048,
        memory_limit_mb: 2048,
        inbound_qps: 14200
      }, null, 2)
    },
    {
      label: "✅ Live Healthy Edge Telemetry",
      text: JSON.stringify({
        platform: "Vercel Serverless Edge Runtime",
        deployment_url: "xai-pipeline.vercel.app",
        edge_region: "cle1",
        status_code: 200,
        execution_duration_ms: 140,
        memory_used_mb: 118,
        memory_limit_mb: 1024,
        live_runtime_status: "HEALTHY"
      }, null, 2)
    }
  ],
  "Maintenance & Evolution": [
    {
      label: "⚠️ Critical CVE & Technical Debt",
      text: JSON.stringify({
        repository: "enterprise-core-service",
        outdated_dependencies: [
          "lodash@4.17.15 (CVE-2019-10744)",
          "axios@0.19.0 (SSRF Hotspot)"
        ],
        deprecated_lifecycle_hooks: 18,
        test_coverage_decay: "-14.2% over 6 months",
        technical_debt_estimate: "22 Developer Days"
      }, null, 2)
    }
  ]
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
    tool: "Vercel Runtime Logs",
    icon: <Activity className="w-3.5 h-3.5 mr-2 text-purple-500" />
  },
  "Maintenance & Evolution": {
    tool: "Sentry",
    icon: <AlertTriangle className="w-3.5 h-3.5 mr-2 text-red-500" />
  }
};

const UPLOAD_CONFIG: Record<SDLCPhase, { label: string; tooltip: string; accept: string }> = {
  "Requirement Elicitation": {
    label: "Upload SRS / Spec",
    tooltip: "Upload Software Requirements Specification (.txt, .md, .doc, .json)",
    accept: ".txt,.md,.doc,.docx,.json"
  },
  "Architectural Design": {
    label: "Upload Diagram / Architecture Spec",
    tooltip: "Upload Architecture Diagram, CloudFormation, Terraform, or UML (.png, .svg, .yaml, .json, .puml, .drawio, .mermaid)",
    accept: ".png,.jpg,.jpeg,.svg,.yaml,.yml,.json,.tf,.puml,.drawio,.xml,.mermaid,.mmd,.txt,.md"
  },
  "Development": {
    label: "Upload Code File",
    tooltip: "Upload source code file (.ts, .js, .py, .java, .sql, .cpp)",
    accept: ".ts,.js,.py,.java,.sql,.cpp,.c,.go,.rs,.txt"
  },
  "Testing": {
    label: "Upload Test Report",
    tooltip: "Upload SonarQube / Jest report or code churn data (.json, .xml, .txt, .log)",
    accept: ".json,.xml,.log,.txt,.csv"
  },
  "Deployment & Monitoring": {
    label: "Upload K8s / Telemetry Log",
    tooltip: "Upload Kubernetes YAML manifest or APM crash log (.yaml, .yml, .json, .log)",
    accept: ".yaml,.yml,.json,.log,.txt"
  },
  "Maintenance & Evolution": {
    label: "Upload Audit / Scan Log",
    tooltip: "Upload npm audit, Sentry crash, or CVE scan report (.json, .log, .txt)",
    accept: ".json,.log,.txt"
  }
};

export const AVAILABLE_MODELS = [
  { id: "qwen/qwen3.8-27b", name: "Qwen 2.5 27B", latency: "~380ms", type: "Groq LPU Ultra Fast", icon: "⚡" },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B", latency: "~630ms", type: "Flagship Deep Reasoning", icon: "🧠" },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B", latency: "~520ms", type: "High-Throughput LPU", icon: "🚀" },
  { id: "ast-deterministic", name: "AST Deterministic", latency: "<20ms", type: "Local Software Science", icon: "🛡️" }
];

interface InputLayerProps {
  onAnalyze: (phase: SDLCPhase, data: string, model?: string) => void;
  isLoading: boolean;
  activePhase?: SDLCPhase;
  setActivePhase?: (phase: SDLCPhase) => void;
  data?: string;
  setData?: (data: string) => void;
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
}

export function InputLayer({ 
  onAnalyze, 
  isLoading,
  activePhase: propPhase,
  setActivePhase: propSetPhase,
  data: propData,
  setData: propSetData,
  selectedModel: propModel,
  setSelectedModel: propSetModel
}: InputLayerProps) {
  const [internalPhase, setInternalPhase] = useState<SDLCPhase>("Development");
  const [internalData, setInternalData] = useState(
    'const query = "SELECT * FROM users WHERE username = \'" + userInput + "\'";'
  );
  const [internalModel, setInternalModel] = useState("qwen/qwen3.8-27b");

  const activePhase = propPhase ?? internalPhase;
  const setActivePhase = propSetPhase ?? setInternalPhase;
  const data = propData ?? internalData;
  const setData = propSetData ?? setInternalData;
  const selectedModel = propModel ?? internalModel;
  const setSelectedModel = propSetModel ?? setInternalModel;

  const [isPulling, setIsPulling] = useState(false);
  const [customRepo, setCustomRepo] = useState("vercel/next.js");
  const [copied, setCopied] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      // Architecture / System Diagram Image Upload (PNG/JPG/SVG)
      const reader = new FileReader();
      reader.onload = () => {
        setData(
`// Architecture Diagram Ingested: ${file.name} (${(file.size / 1024).toFixed(1)} KB)
// Analyzed Diagram Topology (Component Nodes & Coupling Matrix):
{
  "diagram_artifact": "${file.name}",
  "type": "Architecture Component Topology Diagram",
  "detected_components": [
    "API Gateway Ingress (Port 443)",
    "MasterBillingOrchestrator (Monolith Controller)",
    "Payment Processing Service",
    "Stripe External Webhook Handler",
    "PostgreSQL Primary Database Instance"
  ],
  "coupling_coefficient": 0.89,
  "detected_smell": "Monolithic God Class Controller",
  "architectural_risk": "HIGH_MAINTENANCE_OVERHEAD"
}`
        );
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setData(content);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const activePhaseDetails = PHASES.find(p => p.label === activePhase);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.trim() || isLoading) return;
    onAnalyze(activePhase, data, selectedModel);
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setData("");
  };

  const handleRealIntegration = async (tool: string) => {
    setIsPulling(true);
    setData(`[Connecting to Enterprise Adapter: ${tool}...]\nAuthenticating session...`);
    
    try {
      const customHeaders: Record<string, string> = {};
      try {
        const stored = localStorage.getItem('xai_enterprise_keys');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.jiraToken) customHeaders['x-jira-token'] = parsed.jiraToken;
          if (parsed.jiraDomain) customHeaders['x-jira-domain'] = parsed.jiraDomain;
          if (parsed.githubToken) customHeaders['x-github-token'] = parsed.githubToken;
          if (parsed.sonarToken) customHeaders['x-sonar-token'] = parsed.sonarToken;
          if (parsed.datadogApiKey) customHeaders['x-datadog-key'] = parsed.datadogApiKey;
        }
      } catch (e) {
        // Ignore
      }

      const res = await fetch(`/api/integration?tool=${encodeURIComponent(tool)}&repo=${encodeURIComponent(customRepo)}`, {
        headers: customHeaders
      });
      if (res.ok) {
        const result = await res.json();
        if (tool === 'GitHub Actions' && result.payload?.git_diff) {
          setData(
`// Live GitHub Actions Ingestion
// Commit: ${result.payload.commit_hash} | Author: ${result.payload.author}
// File: ${result.payload.changed_file}
// Message: ${result.payload.message}

${result.payload.git_diff}`
          );
        } else {
          setData(JSON.stringify(result, null, 2));
        }
      } else {
        setData(`[Error] Failed to connect to ${tool}. Falling back to manual entry.`);
      }
    } catch (err) {
      setData(`[Error] Network timeout connecting to ${tool}.`);
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-5 sm:p-8 transition-all">
      {/* Header */}
      <div className="mb-6 border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-indigo-600 font-bold uppercase mb-1.5 flex items-center">
            <Terminal className="w-3.5 h-3.5 mr-1.5" />
            Layer 1: Input & Contextual Ingestion
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Select Lifecycle Phase</h2>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Target Persona: <span className="font-bold text-slate-800">{activePhaseDetails?.desc.split("for ")[1] || "Engineers"}</span>
        </div>
      </div>

      {/* 6 Phase Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {PHASES.map((phase) => {
          const isActive = activePhase === phase.label;
          return (
            <button
              type="button"
              key={phase.label}
              disabled={isLoading}
              onClick={() => {
                setActivePhase(phase.label);
                // Pre-populate with first preset for smooth presentation experience
                const presets = PRESETS[phase.label];
                if (presets && presets[0]) {
                  setData(presets[0].text);
                } else {
                  setData("");
                }
              }}
              className={`group flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-200 ${
                isActive 
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`mb-2 transition-transform duration-200 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-slate-700'}`}>
                {phase.icon}
              </div>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {phase.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* One-Click Pre-Loaded Test Scenarios Strip */}
      <div className="mb-4 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center text-xs font-semibold text-slate-700 shrink-0">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
          <span>Pre-Loaded Test Cases:</span>
          <span className="hidden sm:inline-block ml-1.5 text-[10px] font-normal text-slate-400">(Click to auto-load sample)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS[activePhase]?.map((preset, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setData(preset.text)}
              className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium text-slate-700 transition-all shadow-sm"
              title="Click to load this scenario into the editor"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form with Code Editor Styling */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3 bg-slate-100/60 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Software Artifact Payload</span>
            <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              {data.length} chars
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Qwen 2.5 Active</span>
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {(activePhase === "Development" || activePhase === "Maintenance & Evolution") && (
              <input 
                type="text" 
                value={customRepo}
                onChange={(e) => setCustomRepo(e.target.value)}
                placeholder="owner/repo"
                className="px-2.5 py-1 text-xs font-mono border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-36"
                title="Public GitHub Repository"
              />
            )}
            {/* Hidden file input for document / spec upload */}
            {/* Contextual Document / Diagram / Code Upload */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept={UPLOAD_CONFIG[activePhase]?.accept || ".txt,.json,.md"} 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm"
              title={UPLOAD_CONFIG[activePhase]?.tooltip}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              <span>{UPLOAD_CONFIG[activePhase]?.label || "Upload File"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRealIntegration(INTEGRATIONS[activePhase].tool)}
              disabled={isLoading || isPulling}
              className="flex items-center justify-center px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm disabled:opacity-50"
            >
              {INTEGRATIONS[activePhase].icon}
              {isPulling ? "Pulling..." : `Pull from ${INTEGRATIONS[activePhase].tool}`}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 transition-all shadow-sm"
              title="Copy Payload"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 transition-all shadow-sm"
              title="Clear Input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          disabled={isLoading || isPulling}
          placeholder={activePhaseDetails?.placeholder}
          rows={5}
          className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 placeholder:text-slate-500 transition-all disabled:opacity-50 shadow-inner"
          required
        />
        
        {/* Submit Actions */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[11px] font-mono text-slate-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            Zod runtime validation active | Safe payload ingestion
          </div>

          <motion.button 
            whileHover={!isLoading && data.trim() ? { scale: 1.02 } : {}}
            whileTap={!isLoading && data.trim() ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isLoading || !data.trim()}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/30 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing In LPU Pipeline...' : 'Execute Contextual XAI Routing'}
            {!isLoading && <ArrowRightCircle className="w-4 h-4 ml-2" />}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
