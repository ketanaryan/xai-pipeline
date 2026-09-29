git init

# 1. Base files
git add package.json package-lock.json next.config.ts tsconfig.json .gitignore .env eslint.config.mjs postcss.config.mjs
git commit -m "chore: Initialize Next.js project with Tailwind and TypeScript"

# 2. Public assets
git add public/ src/app/favicon.ico src/app/globals.css
git commit -m "chore: Add static assets and global styles"

# 3. Layouts
git add src/app/layout.tsx next-env.d.ts
git commit -m "feat: Scaffold application layout and metadata"

# 4. Docs
git add README.md ARCHITECTURE.md AGENTS.md CLAUDE.md
git commit -m "docs: Add extensive architecture documentation and XAI framework guide"

# 5. Database (Prisma)
git add prisma/schema.prisma src/lib/prisma.ts
git commit -m "feat: Setup Prisma ORM and SQLite schema for XAI audit logs"

# 6. Inference Engine (Core)
git add src/lib/inferenceEngine.ts
git commit -m "feat: Implement Black-box AI inference engine simulator"

# 7. Routing Layer (Core)
git add src/lib/routingLayer.ts
git commit -m "feat: Build dynamic XAI routing engine based on SDLC phase"

# 8. Validations
git add src/lib/validations.ts
git commit -m "feat: Add input validation schemas with Zod"

# 9. API - Analyze
git add src/app/api/analyze/route.ts
git commit -m "feat: Create /api/analyze endpoint for inference and generative AI"

# 10. API - Logs
git add src/app/api/logs/route.ts
git commit -m "feat: Create /api/logs endpoint to fetch historical predictions"

# 11. API - Integrations
git add src/app/api/integration/route.ts
git commit -m "feat: Integrate real-time APIs for GitHub, Datadog, and Sentry"

# 12. API - Export
git add src/app/api/export/route.ts
git commit -m "feat: Implement CSV export endpoint for regulatory compliance audits"

# 13. UI - Loading Spinner
git add src/components/ui/LoadingSpinner.tsx
git commit -m "feat: Build reusable loading spinner component"

# 14. Layer - Input
git add src/components/layers/InputLayer.tsx
git commit -m "feat: Build Input & Routing Layer component with auto-pull integrations"

# 15. Layer - Presentation
git add src/components/layers/PresentationLayer.tsx
git commit -m "feat: Build Presentation Layer to display dynamically tailored XAI explanations"

# 16. Layer - Audit Log
git add src/components/layers/AuditLog.tsx
git commit -m "feat: Build Audit Log Table for XAI regulatory compliance"

# 17. Layer - Analytics
git add src/components/layers/AnalyticsDashboard.tsx
git commit -m "feat: Add Executive Analytics Dashboard with Recharts data visualization"

# 18. Layer - Policy Settings
git add src/components/layers/PolicySettings.tsx
git commit -m "feat: Build Dynamic Risk Policy Engine configuration panel"

# 19. Dashboard Page
git add src/app/page.tsx
git commit -m "feat: Integrate all framework layers into main dashboard view"

# 20. Remaining files (catch-all)
git add .
git commit -m "chore: Final project polish, bug fixes, and minor UI adjustments"

git branch -M main
git remote add origin https://github.com/ketanaryan/xai-pipeline.git
git push -u origin main
