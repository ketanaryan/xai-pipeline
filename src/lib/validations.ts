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
  riskThreshold: z.number().optional().default(0.75),
  model: z.string().optional().default("qwen/qwen3.8-27b"),
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  userRole: z.string().optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
