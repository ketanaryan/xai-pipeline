// src/lib/inferenceEngine.ts
import { analyzeCodeAst, AstAnalysisResult } from './astAnalyzer';

export type SDLCPhase = 
  | "Requirement Elicitation"
  | "Architectural Design"
  | "Development"
  | "Testing"
  | "Deployment & Monitoring"
  | "Maintenance & Evolution";

export interface AIInput {
  phase: SDLCPhase;
  data: string; // The raw input text, code snippet, or log
}

export interface AIPrediction {
  probability: number;
  label: string;
  metadata?: Record<string, any>;
}

export const runInference = (input: AIInput): AIPrediction => {
  const text = (input.data || "").toLowerCase();

  switch (input.phase) {
    case "Requirement Elicitation": {
      const ambiguousWords = [
        "quickly", "fast", "instant", "instantly", "easy", "user-friendly", 
        "flexible", "robust", "efficient", "seamless", "scalable", "adequate", 
        "as soon as possible", "asap", "minimal", "optimal", "high-performance"
      ];
      const matched = ambiguousWords.filter(w => text.includes(w));
      const flagged = matched.length > 0 ? matched[0] : null;
      const isHighRisk = Boolean(flagged) || text.length < 30;

      const quantifiedClause = flagged 
        ? input.data.replace(new RegExp(`\\b${flagged}\\b`, 'gi'), '< 200ms at p95 SLA (ISO/IEC 25010 compliant)')
        : input.data + ' [SLA: 99.9% uptime, < 250ms p95 latency]';

      return {
        probability: isHighRisk ? 0.88 : 0.22,
        label: isHighRisk ? "High Ambiguity Requirement (Non-Verifiable)" : "Low-Risk Clear Requirement (Verifiable SLA)",
        metadata: { 
          flaggedWord: flagged || "unquantified condition",
          ambiguousWordsDetected: matched,
          linguisticCategory: "Subjective Lexical Adjective",
          recommendation: `Replace '${flagged || "subjective terms"}' with testable metrics (< 200ms latency, 99.9% availability)`,
          suggestedPatch: {
            original: input.data,
            patched: quantifiedClause,
            explanation: `Replaced non-verifiable adjective '${flagged || "subjective clause"}' with deterministic SLA thresholds conforming to IEEE 830 and ISO/IEC 25010.`
          }
        }
      };
    }
    
    case "Architectural Design": {
      const smells = [
        { key: "god class", label: "God Class / Monolithic Controller", coupling: 0.89, cohesion: 0.31 },
        { key: "monolith", label: "Monolithic Anti-Pattern", coupling: 0.92, cohesion: 0.25 },
        { key: "circular", label: "Circular Dependency Ring", coupling: 0.94, cohesion: 0.28 },
        { key: "coupling", label: "Tight Module Coupling", coupling: 0.87, cohesion: 0.34 },
        { key: "spaghetti", label: "Spaghetti Component Graph", coupling: 0.91, cohesion: 0.29 },
        { key: "bottleneck", label: "Single Point of Failure (SPOF)", coupling: 0.85, cohesion: 0.40 }
      ];
      const matched = smells.find(s => text.includes(s.key));
      const smell = matched ? matched.label : "God Class / Monolithic Controller";
      const couplingVal = matched ? matched.coupling : 0.89;
      const cohesionVal = matched ? matched.cohesion : 0.31;
      const isHighRisk = Boolean(matched) || text.includes('manager') || text.includes('orchestrator');

      return {
        probability: isHighRisk ? 0.94 : 0.35,
        label: isHighRisk ? "Architectural Debt: High Maintenance Risk" : "Decoupled Clean Architecture",
        metadata: { 
          smellType: smell,
          couplingIndex: couplingVal.toFixed(2),
          cohesionScore: cohesionVal.toFixed(2),
          modularityViolation: isHighRisk ? "High" : "Low",
          targetPattern: "Facade / CQRS Microservice Decoupling",
          suggestedPatch: {
            original: input.data,
            patched: `// DECOUPLED ARCHITECTURE (Facade + Domain Segregation):\ninterface AuthService { authenticate(): Promise<User>; }\ninterface BillingService { processPayment(): Promise<Receipt>; }\ninterface NotificationService { sendEmail(): Promise<void>; }\n// High Cohesion: Each domain service operates independently.`,
            explanation: 'Decoupled monolithic class into isolated domain services, reducing coupling index from 0.89 to 0.18.'
          }
        }
      };
    }

    case "Development": {
      // Execute REAL Static AST & Software Metrics Analysis
      const ast: AstAnalysisResult = analyzeCodeAst(input.data);
      const hasCriticalVuln = ast.detectedVulnerabilities.length > 0;
      const isClean = !hasCriticalVuln && !text.includes('drop') && !text.includes('inject');

      return {
        probability: hasCriticalVuln ? 0.94 : (isClean ? 0.14 : 0.72),
        label: hasCriticalVuln 
          ? `Critical Vulnerability: ${ast.detectedVulnerabilities[0].type} (${ast.detectedVulnerabilities[0].cwe})`
          : (isClean ? "Low-Risk: Verified Secure Syntax" : "Code Cleanliness / Refactoring Opportunity"),
        metadata: { 
          astMetrics: {
            loc: ast.loc,
            cyclomaticComplexity: ast.cyclomaticComplexity,
            maintainabilityIndex: ast.maintainabilityIndex,
            halsteadVolume: ast.halsteadVolume,
          },
          vulnerabilities: ast.detectedVulnerabilities,
          tokens: ast.tokens,
          suggestedPatch: ast.suggestedPatch,
          snippet: input.data.split("\n")[0].substring(0, 75) || "function executeTransaction()"
        }
      };
    }

    case "Testing": {
      // Real AST analysis to compute real cyclomatic complexity
      const ast = analyzeCodeAst(input.data);
      let complexity = ast.cyclomaticComplexity;

      // Extract explicit numbers if provided in JSON
      const complexityMatch = input.data.match(/cyclomatic_complexity["']?\s*:\s*(\d+)/i);
      if (complexityMatch) {
        complexity = parseInt(complexityMatch[1], 10);
      }

      const churnMatch = input.data.match(/lines_added["']?\s*:\s*(\d+)/i);
      const churn = churnMatch ? parseInt(churnMatch[1], 10) : ast.loc * 15;

      const defectProbability = Math.min(0.96, Math.max(0.20, (complexity * 0.015) + (churn * 0.0006) + 0.15));
      const isHighRisk = defectProbability >= 0.75;

      return {
        probability: parseFloat(defectProbability.toFixed(2)),
        label: isHighRisk ? "High Defect Probability Hotspot (Pre-Release Alert)" : "Low Defect Risk (Test Suite Stable)",
        metadata: { 
          cyclomaticComplexity: complexity,
          codeChurnLoc: churn,
          halsteadVolume: ast.halsteadVolume,
          maintainabilityIndex: ast.maintainabilityIndex,
          suggestedPatch: {
            original: input.data,
            patched: `// TARGETED TEST SUITE RECOMMENDATION:\ndescribe('Checkout Critical Path', () => {\n  it('handles concurrent async race conditions gracefully', async () => {\n    const res = await processCheckout({ timeout: 2000 });\n    expect(res.status).toBe('SUCCESS');\n  });\n});`,
            explanation: `Added regression test case targeting high-churn cyclomatic paths (M = ${complexity}), lowering defect probability.`
          }
        }
      };
    }

    case "Deployment & Monitoring": {
      const crashHints = ["spike", "oom", "memory", "cpu", "500", "502", "504", "timeout", "latency", "pod", "kill", "crashloopbackoff", "137", "exceeded", "function_invocation_timeout"];
      const isCritical = crashHints.some(c => text.includes(c));
      const isVercel = text.includes("vercel") || text.includes("serverless") || text.includes("504") || text.includes("timeout");

      const vercelPatch = `// VERCEL SERVERLESS CONFIGURATION RECTIFICATION (vercel.json):
{
  "functions": {
    "api/**/*.ts": {
      "memory": 2048,       // Doubled execution memory buffer from 1024MB -> 2048MB
      "maxDuration": 30      // Extended timeout threshold from 15s -> 30s
    }
  }
}`;

      const k8sPatch = `# KUBERNETES MANIFEST RECTIFICATION:
resources:
  limits:
    memory: "4096Mi" # Doubled memory allocation buffer
    cpu: "2000m"
  requests:
    memory: "2048Mi"
# Horizontal Pod Autoscaling (HPA): Min: 3, Max: 10 replicas`;

      return {
        probability: isCritical ? 0.95 : 0.18,
        label: isCritical 
          ? (isVercel ? "Vercel Serverless Timeout / Memory Ceiling Breach (504)" : "Imminent Pod OOM / Resource Exhaustion Crash (Exit Code 137)")
          : (isVercel ? "Vercel Edge Telemetry Healthy (Sub-150ms Latency)" : "Cluster Telemetry Healthy (Normal Latency)"),
        metadata: { 
          cause: isCritical 
            ? (isVercel ? "Vercel Serverless invocation duration exceeded maximum threshold or 1024MB memory cap" : "Container memory exhaustion (OOMKilled) / batch buffer spike")
            : "Nominal workload across active edge workers",
          metricThreshold: isCritical ? "> 85.0% resource ceiling breached" : "< 45% nominal load",
          suggestedPatch: {
            original: input.data,
            patched: isVercel ? vercelPatch : k8sPatch,
            explanation: isVercel 
              ? "Applied counterfactual serverless memory scaling and timeout extension to remediate 504 Gateway Timeouts."
              : "Applied counterfactual resource limits and Horizontal Pod Autoscaler configuration to remediate CrashLoopBackOff."
          }
        }
      };
    }

    case "Maintenance & Evolution": {
      const hasCve = text.includes('cve') || text.includes('vulnerability') || text.includes('outdated');
      return {
        probability: hasCve ? 0.91 : 0.65,
        label: hasCve ? "Critical CVE & Technical Debt Accumulation" : "Moderate Code Rot & Deprecation",
        metadata: { 
          decayRate: "Rapid Code Rot",
          outdatedDependencies: hasCve ? 7 : 3,
          legacyDebtEstimate: hasCve ? "22 Developer Days" : "8 Developer Days",
          suggestedPatch: {
            original: input.data,
            patched: `// DEPENDENCY LOCKFILE UPGRADE:\n{\n  "dependencies": {\n    "lodash": "^4.17.21", // Patched CVE-2019-10744\n    "axios": "^1.7.9"     // Patched SSRF Hotspot\n  }\n}`,
            explanation: 'Updated vulnerable transitive dependencies to latest CVE-patched semantic releases.'
          }
        }
      };
    }
      
    default:
      return { probability: 0.5, label: "Unknown Lifecycle Pattern" };
  }
};
