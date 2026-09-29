# 🧠 XAI-Driven SDLC Framework: Architecture & Technical Explanation

## 🚀 1. What is this Project and Why does it exist?

**The Problem (Why):** 
In modern enterprise environments, Artificial Intelligence is increasingly being used across the Software Development Lifecycle (SDLC). However, these AI models operate as "Black Boxes." When an AI predicts a bug, suggests code, or flags a security risk, developers and managers cannot blindly trust it without knowing *why* it made that decision. 

**The Solution (What):** 
We built an **Explainable AI (XAI) Routing Framework**. This project intercepts black-box AI predictions and routes them through a contextual pipeline to generate mathematically tailored, human-readable explanations. It dynamically adjusts the explanation based on the **SDLC Phase** (Development, Testing, Maintenance) and the **Target Stakeholder** (Software Developers, QA Engineers, Risk Managers).

---

## 🏗️ 2. Why is this Project Extremely "Backend-Heavy"?

While the frontend is sleek and minimal, the true complexity of this project lies in its **Backend Architecture and Orchestration Layers**. It is not a simple CRUD app; it is a highly concurrent, data-driven AI pipeline.

### A. The Dynamic Routing Engine (`src/lib/routingLayer.ts`)
Instead of directly passing data to an LLM, our backend intercepts the request and calculates the precise routing context. It analyzes the SDLC phase and assigns specific mathematical XAI modalities (e.g., *Native Attention Mechanisms* for Devs, *Counterfactual Probes* for QA, *Global Feature Attribution* for DevOps). 

### B. The Risk Policy & Inference Simulator (`src/lib/inferenceEngine.ts`)
The backend runs a complex algorithmic engine that calculates a "Risk Probability" for every action. If the calculated risk breaches the dynamically set threshold (controlled via the UI Policy Engine), the backend aggressively intercepts the payload, flags it as **HIGH RISK**, and forces the LLM to prioritize security compliance in its explanation.

### C. Live External API Aggregation (`/api/integration/route.ts`)
The backend actively reaches out to external enterprise tools in real-time. It securely fetches live GitHub commits, open React issues, and simulated Datadog telemetry, aggregates this massive amount of unstructured data, and structures it perfectly for the LLM prompt.

### D. Compliance & Audit Logging (`/api/export/route.ts`)
In enterprise AI, regulatory compliance is mandatory. Every single decision made by the AI, the payload it analyzed, the risk threshold at the time, and the resulting explanation are synchronously logged into a relational PostgreSQL database via Prisma. We also engineered a backend stream that dynamically converts these thousands of database rows into a downloadable CSV buffer for legal compliance audits.

---

## 🛠️ 3. Tech Stack & Language Justifications (Which & Why)

| Technology / Language | Where it is used | Why we chose it (The Technical Justification) |
| :--- | :--- | :--- |
| **TypeScript** | Entire Full-Stack Codebase | Chosen for **Strict Type Safety**. When passing massive, unstructured JSON payloads between external GitHub APIs, the Inference Engine, and the LLM, runtime errors are catastrophic. TS interfaces ensure our `AuditLog` and `Prediction` objects are rigidly structured before hitting the database. |
| **Next.js 16 (App Router)** | Backend API Routes & Server Components | Chosen for its **Edge and Serverless Function capabilities**. Instead of maintaining a bulky Express.js server, Next.js allows our `/api/analyze` routes to spin up instantly, handle the heavy LLM streaming, and spin down, saving compute resources and reducing latency. |
| **PostgreSQL (Neon)** | Cloud Database | Chosen over NoSQL (like MongoDB) because XAI audit logs require strict relational integrity and ACID compliance. Neon Serverless Postgres scales compute dynamically based on our backend load. |
| **Prisma ORM** | Database Layer (`src/lib/prisma.ts`) | Chosen because it generates highly optimized, type-safe SQL queries directly from our TypeScript schema. It prevents SQL injection attacks, which is critical for an application handling external GitHub commit data. |
| **Groq API (Llama 3 / Qwen)** | True Generative AI Backend | Chosen for its ultra-low latency LPU (Language Processing Unit) architecture. Standard LLMs take 3-5 seconds to reply; our backend uses Groq to parse GitHub commits and return explanations in under 400 milliseconds. |
| **Zod** | Backend Payload Validation | Used to strictly sanitize and validate incoming API requests. If a bad actor tries to inject malicious payloads into our `/api/analyze` route, Zod drops the request immediately at the edge. |
| **Tailwind CSS & Recharts** | Frontend Presentation Layer | Chosen because Tailwind compiles down to a few kilobytes of pure CSS, keeping the frontend incredibly lightweight so the server can dedicate maximum memory to backend AI processing. |

---

## ⚙️ 4. The Backend Flow (Step-by-Step)

1. **Client Request**: User clicks "Run XAI Pipeline", passing the SDLC phase and dynamic GitHub URL.
2. **Integration Layer**: Backend `GET`s live data from GitHub/Sentry APIs.
3. **Inference Simulator**: Backend calculates `risk_score = f(data)`. If `risk_score > threshold`, apply Security override.
4. **Routing Engine**: Maps the data to `TargetStakeholder` and `Modality` interfaces.
5. **LLM Synthesis**: Backend constructs a secure, structured prompt and POSTs to the Groq API.
6. **Audit Database**: Backend synchronously commits `(Timestamp, Phase, Input, Output, Risk)` to PostgreSQL.
7. **Client Response**: Backend returns the parsed, sanitized XAI explanation to the UI.
