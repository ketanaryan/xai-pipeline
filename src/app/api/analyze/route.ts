import { NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/validations";
import { runInference } from "@/lib/inferenceEngine";
import { routeToExplainer } from "@/lib/routingLayer";
import { prisma } from "@/lib/prisma";

// Simulate network/processing latency for realism
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate incoming data
    const result = AnalyzeRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid Request payload", details: result.error.issues },
        { status: 400 }
      );
    }

    const { phase, data, riskThreshold } = result.data;

    // Simulate AI model inference time (1.5 to 2.5 seconds)
    await delay(1500 + Math.random() * 1000);

    // 2. Run inference (Black-box AI model simulation)
    const prediction = runInference({ phase, data });

    // 3. Route to the appropriate XAI modality
    let routing = routeToExplainer(phase, prediction);

    // Overwrite High Risk status if it exceeds dynamic threshold
    const isHighRisk = prediction.probability >= riskThreshold;
    if (isHighRisk) {
      prediction.label = "HIGH RISK: " + prediction.label;
    }

    // 4. TRUE GENERATIVE AI INTEGRATION
    // If the user has added their GEMINI_API_KEY to .env, use real LLM to generate the explanation dynamically
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
          You are an Explainable AI (XAI) routing engine. 
          The user is in the "${phase}" phase of the SDLC.
          The input data is: ${data}
          The AI predicted: ${prediction.label} with ${prediction.probability * 100}% confidence.
          The target stakeholder is: ${routing.targetStakeholder}.
          The chosen modality is: ${routing.modality}.
          
          Write a strict, concise, 2-sentence technical explanation of why the AI made this prediction. 
          Tailor the vocabulary specifically to a ${routing.targetStakeholder}.
          Do not include conversational filler, just the explanation.
        `;
        const aiResult = await model.generateContent(prompt);
        const responseText = await aiResult.response.text();
        routing.explanationUI = responseText;
      } catch (llmError) {
        console.error("Gemini API Error, falling back to simulated engine:", llmError);
      }
    }

    // 4. Save to Database (Regulatory Compliance Audit Log)
    await prisma.auditLog.create({
      data: {
        phase,
        inputData: data,
        aiPredictionLabel: prediction.label,
        aiProbability: prediction.probability,
        xaiModality: routing.modality,
        explanation: routing.explanationUI,
      }
    });

    // 5. Return results securely to the presentation layer
    return NextResponse.json({
      prediction,
      routing,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
