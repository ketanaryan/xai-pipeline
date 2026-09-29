# Architecture & Implementation Strategy
**Project:** Explainable AI (XAI) Framework for SDLC
**Based on:** *Explainable Artificial Intelligence (XAI) Techniques for the Software Development Lifecycle: A Phase-Specific Framework*

## Executive Summary
This project is a production-ready, full-stack implementation of the theoretical phase-specific XAI routing architecture. It aims to solve the "black-box" AI problem in software engineering by dynamically routing AI predictions to mathematically appropriate explainers (e.g., LIME, SHAP, Counterfactuals) based on the specific SDLC phase and the target stakeholder's technical proficiency.

## Tech Stack Justification
To ensure a high-performance, robust, and visually premium application, we chose a modern edge-ready stack:

- **Next.js (App Router):** Provides seamless full-stack capabilities. We use Serverless API Routes to simulate the heavy AI inference engines securely on the backend, while keeping the UI highly interactive.
- **TypeScript:** Enforces strict type safety across the entire pipeline. The `SDLCPhase`, `AIPrediction`, and `RoutingOutput` interfaces ensure that the data flowing from the frontend to the backend and back is completely predictable.
- **Zod:** Enterprise-grade schema validation. Ensures that our backend API only accepts strongly typed payloads, preventing malformed data from crashing the AI inference engine.
- **Tailwind CSS & Framer Motion:** Used to construct a premium, brutalist/minimalist user interface. By avoiding generic component libraries (like Bootstrap), we eliminate the "AI slop" aesthetic, delivering a sleek, professional, and fully mobile-responsive dashboard.
- **Lucide React:** Consistent, clean iconography to visually demarcate SDLC phases and AI modalities.

## The 4-Layer Conceptual Architecture (Mapped to Code)

The research paper defines four core layers, which we have strictly adhered to in our codebase architecture:

### 1. Input Layer
- **Code Mapping:** `src/components/layers/InputLayer.tsx`
- **Role:** Standardizes various SDLC artifacts (text requirements, code commits, server logs). Captures user input and sends a structured JSON payload to the backend API.

### 2. Inference Layer
- **Code Mapping:** `src/lib/inferenceEngine.ts` (Executed via `src/app/api/analyze/route.ts`)
- **Role:** Simulates the predictive AI models (NLP ambiguity detectors, defect classifiers). Operates entirely as a black-box on the backend, generating probabilities and labels (e.g., "78% Defect Probability").

### 3. Routing and Explainability Layer
- **Code Mapping:** `src/lib/routingLayer.ts` (Executed via `src/app/api/analyze/route.ts`)
- **Role:** The core brain of the framework. It inspects the SDLC phase metadata and intercepts the model's output, dynamically mapping it to the correct mathematical explainer (e.g., routing Testing phase data to LIME/Local SHAP). 

### 4. Presentation Layer
- **Code Mapping:** `src/components/layers/PresentationLayer.tsx`
- **Role:** Renders the resulting XAI output. Tailors the visual format to the target stakeholder. For instance, it outputs deterministic rules for Business Analysts in the Requirement phase, but renders actionable rollback commands for Site Reliability Engineers (SREs) in the Deployment phase.

## API Design
- **Endpoint:** `POST /api/analyze`
- **Payload:** `{ phase: SDLCPhase, data: string }`
- **Response:** `{ prediction: AIPrediction, routing: RoutingOutput }`
- **Behavior:** The API simulates computational latency to mimic real-time AI processing and validates all incoming data via Zod schemas before passing it to the Inference Engine.
