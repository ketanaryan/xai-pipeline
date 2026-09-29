// src/lib/routingLayer.ts
import { SDLCPhase, AIPrediction } from "./inferenceEngine";

export type XAIModality = 
  | "Rule Extraction"
  | "Counterfactuals"
  | "Concept-based Explanations"
  | "Native Attention Mechanisms"
  | "LIME / Local SHAP"
  | "Global & Local SHAP";

export interface RoutingOutput {
  modality: XAIModality;
  explanationUI: string;
  targetStakeholder: string;
}

export const routeToExplainer = (phase: SDLCPhase, prediction: AIPrediction): RoutingOutput => {
  switch (phase) {
    case "Requirement Elicitation":
      return {
        modality: "Rule Extraction",
        targetStakeholder: "Business Analysts, Clients",
        explanationUI: `IF requirement contains unquantified adjective ('${prediction.metadata?.flaggedWord}') THEN ${prediction.label}.`
      };
    
    case "Architectural Design":
      return {
        modality: "Concept-based Explanations",
        targetStakeholder: "Software Architects",
        explanationUI: `Architectural pattern exhibits characteristics of a '${prediction.metadata?.smellType}', which correlates with a ${prediction.probability * 100}% increase in maintenance overhead.`
      };

    case "Development":
      return {
        modality: "Native Attention Mechanisms",
        targetStakeholder: "Software Developers",
        explanationUI: `Attention heatmap highlighting syntax preceding the cursor. Influential tokens: '{', 'function'.`
      };

    case "Testing":
      return {
        modality: "LIME / Local SHAP",
        targetStakeholder: "QA Engineers, Testers",
        explanationUI: `Waterfall Chart: Base risk 15% -> High '${prediction.metadata?.feature}' (+50%) -> Recent code churn (+13%) -> Total Defect Probability: ${prediction.probability * 100}%`
      };

    case "Deployment & Monitoring":
      return {
        modality: "Counterfactuals",
        targetStakeholder: "Site Reliability Engineers",
        explanationUI: `Action Required: Reverting the recent configuration flag for batch-processing [False → True] will reduce crash probability from ${prediction.probability * 100}% to 14%.`
      };

    case "Maintenance & Evolution":
      return {
        modality: "Global & Local SHAP",
        targetStakeholder: "Maintainers, Tech Leads",
        explanationUI: `Global SHAP Analysis: Over the last 1,000 commits, 'Test Coverage' and 'Dependency Outdatedness' are the strongest contributors to the repository's technical debt score.`
      };
      
    default:
      return {
        modality: "Rule Extraction",
        targetStakeholder: "General User",
        explanationUI: "No explanation available."
      };
  }
};
