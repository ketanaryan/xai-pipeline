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

    // 4. TRUE GENERATIVE AI INTEGRATION (GROQ - LLAMA 3)
    if (process.env.GROQ_API_KEY) {
      try {
        const prompt = `
          You are an Explainable AI (XAI) routing engine analyzing a software artifact.
          Phase: "${phase}"
          Target Stakeholder: "${routing.targetStakeholder}"
          Explanation Modality: "${routing.modality}"
          Input Data (The actual artifact to analyze): ${data}
          
          Task: Write a strict, concise, 2-sentence explanation of why the AI made a "${prediction.label}" prediction (with ${prediction.probability * 100}% confidence).
          Crucially, you MUST specifically mention actual details from the Input Data (like the specific commit hash, bug description, or code snippet) to prove you analyzed it.
          Tailor the vocabulary specifically to a ${routing.targetStakeholder}.
          Do not include conversational filler, just the explanation.
        `;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
          })
        });

        if (groqResponse.ok) {
          const aiData = await groqResponse.json();
          routing.explanationUI = aiData.choices[0].message.content.trim();
        } else {
          console.error("Groq API Error:", await groqResponse.text());
        }
      } catch (llmError) {
        console.error("Groq Network Error, falling back to simulated engine:", llmError);
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
