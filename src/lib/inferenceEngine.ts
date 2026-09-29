// src/lib/inferenceEngine.ts

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
  // Simulating a black-box AI model based on the SDLC phase
  switch (input.phase) {
    case "Requirement Elicitation":
      return {
        probability: 0.85,
        label: "Ambiguous",
        metadata: { flaggedWord: "quickly" }
      };
    
    case "Architectural Design":
      return {
        probability: 0.92,
        label: "High Maintenance Risk",
        metadata: { smellType: "God Class" }
      };

    case "Development":
      return {
        probability: 0.70,
        label: "Suggested Code Completion",
        metadata: { snippet: "function parseData(input) { return JSON.parse(input); }" }
      };

    case "Testing":
      return {
        probability: 0.78,
        label: "High Defect Probability",
        metadata: { feature: "cyclomatic complexity" }
      };

    case "Deployment & Monitoring":
      return {
        probability: 0.95,
        label: "Imminent Crash",
        metadata: { cause: "latency spike" }
      };

    case "Maintenance & Evolution":
      return {
        probability: 0.88,
        label: "High Technical Debt",
        metadata: { decayRate: "rapid" }
      };
      
    default:
      return { probability: 0.5, label: "Unknown" };
  }
};
