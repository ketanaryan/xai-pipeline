import { z } from "zod";

export const SDLCPhaseSchema = z.enum([
  "Requirement Elicitation",
  "Architectural Design",
  "Development",
  "Testing",
  "Deployment & Monitoring",
  "Maintenance & Evolution",
]);

export const AnalyzeRequestSchema = z.object({
  phase: SDLCPhaseSchema,
  data: z.string().min(1, "Input data is required").max(50000, "Input is too large"),
  riskThreshold: z.number().optional().default(0.8),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
