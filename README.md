# ResuMate AI

AI-powered resume builder and career tool that generates ATS-optimized resumes and tailored cover letters.

## Architecture

```
resumate-ai/
├── backend/          # Node.js + Express API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic (AI, PDF, Stripe)
│   │   ├── middleware/    # Auth middleware
│   │   ├── db.js         # Database helper (team-db CLI)
│   │   └── index.js      # Express server entry
│   └── package.json
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/        # Landing, Dashboard, ResumeBuilder
│   │   ├── components/   # Shared UI components
│   │   └── App.tsx       # App entry with routing
│   └── package.json
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure API keys
npm start             # Runs on port 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev           # Runs on port 5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET/POST/PUT/DELETE | /api/resumes | Resume CRUD |
| POST | /api/ai/generate-resume | AI resume generation |
| POST | /api/ai/generate-cover-letter | AI cover letter |
| POST | /api/ai/analyze | ATS analysis |
| POST | /api/pdf/export-resume | PDF export |
| GET | /api/pdf/templates | PDF templates |
| POST | /api/payments/create-checkout | Stripe checkout |
| POST | /api/subscriptions/create | Create subscription |

## Revenue Model
- **Monthly Subscription:** $15/month for unlimited AI resumes & cover letters
- **Pay-per-Resume:** $5 for a single PDF export

## 🔑 Moving from Mock Mode to Production

The app runs immediately in **mock/development mode** with no external API keys. To unlock production features, configure these in `backend/.env`:

| Feature | Without Key (Mock) | With Key (Production) |
|---------|-------------------|----------------------|
| **AI Resume Generation** | Template-based fallback (generic but functional) | OpenAI GPT-4o-mini generates tailored, ATS-optimized resumes |
| **Cover Letters** | Template-based fallback | AI-generated personalized cover letters |
| **ATS Analysis** | Basic score (75) with generic suggestions | Real keyword matching against job description |
| **Stripe Payments** | Auto-creates subscription in mock mode | Real Stripe checkout + webhook processing |
| **PDF Export** | Text-based fallback output | Full Puppeteer-rendered professional PDFs |

### Production Checklist
1. **Set `OPENAI_API_KEY`** in `backend/.env` → Enables AI-powered resume and cover letter generation
2. **Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`** → Enables real payment processing
3. **Set `JWT_SECRET`** to a strong random value → Secures user authentication
4. **Set `FRONTEND_URL`** to your deployed frontend URL → CORS configuration
5. **Install Chromium** on your server if using Puppeteer for PDF export

## Tech Stack
- **Backend:** Node.js, Express, OpenAI, Puppeteer, Stripe
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Database:** SQLite via Turso (team-db)
- **Auth:** JWT with bcrypt
