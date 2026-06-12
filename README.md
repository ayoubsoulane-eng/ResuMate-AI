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

## Tech Stack
- **Backend:** Node.js, Express, OpenAI, Puppeteer, Stripe
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Database:** SQLite via Turso (team-db)
- **Auth:** JWT with bcrypt
