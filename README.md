# 🏠 Stability AI — Housing Stability & Tenant Support Panel

Stability AI is a full-stack web application that empowers tenants facing housing instability, eviction risks, or landlord disputes. It provides AI-generated action plans, resource finding, court preparation, and tenant rights tools — all personalized to the user's location and situation.

---

## 📸 Pages Overview & Screenshots

### 🎥 Live Demo Walkthrough
Here is a complete walkthrough of the onboarding, intake assessment, and all platform sections:
![Platform Walkthrough](screenshots/housing_stability_walkthrough.webp)

### 🖥️ Page Previews

| Page | Description | Screenshot |
|------|-------------|------------|
| **Dashboard** | Overview stats, housing stability score, recent activity, quick action links | ![Dashboard](screenshots/dashboard.png) |
| **Intake Wizard** | Multi-step questionnaire collecting tenant state, situation, deadline, income, and household details | ![Intake Wizard](screenshots/intake.png) |
| **Action Plans** | AI-generated personalized action timeline, landlord letter generator, priority checklist | ![Action Plans](screenshots/action-plans.png) |
| **Risk Profiler** | Eviction risk score gauge, legal vulnerability vectors, urgent timeline | ![Risk Profiler](screenshots/risk.png) |
| **Court Prep** | Interactive chat simulator, evidence checklist, hearing readiness tracker | ![Court Prep](screenshots/court.png) |
| **Tenant Rights** | Searchable state/local law database, habitability standards, eviction defense | ![Tenant Rights](screenshots/rights.png) |
| **Resource Finder** | Matches local legal aid, rental assistance, shelters, food programs | ![Resource Finder](screenshots/resources.png) |

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** (App Router, TypeScript)
- **React 19** with Hooks
- **Tailwind CSS** + Vanilla CSS variables
- **Lucide React** icons

### Backend
- **[Express.js](https://expressjs.com/)** REST API (port 5000)
- **[MongoDB](https://www.mongodb.com/)** via [Mongoose](https://mongoosejs.com/) (Atlas or in-memory fallback)
- **JWT** — anonymous session authentication with sliding-window token refresh
- **[Google Gemini AI](https://ai.google.dev/)** (`gemini-2.5-flash`) for plan generation
- **Nodemon** for hot-reload in development

---

## 📁 Project Structure

```
house-/
├── app/                          # Next.js pages (App Router)
│   ├── page.tsx                  # Dashboard
│   ├── intake/page.tsx           # Intake Wizard
│   ├── action-plans/page.tsx     # AI Action Plan results
│   ├── risk/page.tsx             # Eviction Risk Profiler
│   ├── court/page.tsx            # Court Prep Simulator
│   ├── rights/page.tsx           # Tenant Rights Library
│   ├── resources/page.tsx        # Resource Finder
│   └── utils/api.ts              # All backend API call helpers
│
├── backend/                      # Express.js backend
│   ├── server.js                 # Entry point
│   ├── config/db.js              # MongoDB connection (Atlas + in-memory fallback)
│   ├── middleware/auth.js        # JWT bearer token validation
│   ├── models/
│   │   ├── Plan.js               # Mongoose schema for action plans
│   │   └── Session.js            # Mongoose schema for sessions
│   ├── routes/
│   │   ├── auth.js               # POST /api/auth/session
│   │   ├── plan.js               # POST /api/plan/generate, GET /api/plan/:id
│   │   └── progress.js           # GET/PATCH /api/progress/:id
│   ├── services/
│   │   └── gemini.js             # Gemini AI integration + local fallback generator
│   ├── .env                      # ← Real credentials (included for easy setup)
│   └── .env.example              # ← Template reference
│
├── components/                   # Shared UI components (Header, Button, Card, etc.)
├── .env.local                    # ← Frontend env (NEXT_PUBLIC_API_URL)
├── package.json                  # Root scripts (concurrently runs both servers)
└── README.md
```

---

## ⚡ Quick Start — Clone & Run

### Prerequisites
- **Node.js** v18+ → [Download](https://nodejs.org/)
- **npm** v9+ (comes with Node.js)
- **Git** → [Download](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sameer-sahu25/house-.git
cd house-
```

---

### Step 2 — Install Frontend Dependencies

```bash
npm install
```

---

### Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

---

### Step 4 — Environment Variables

The `.env` files are **already included** in the repository for easy setup.

**Frontend** (`.env.local` — in root folder):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
```env
PORT=5000
JWT_SECRET=stability_panel_jwt_secret_key_long_string_2026
MONGODB_URI=mongodb+srv://tejas:tejas@cluster0.wfvr1.mongodb.net/?appName=Cluster0
# Get your free Gemini API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The backend will automatically fall back to an **in-memory MongoDB** if the Atlas connection fails. The Gemini AI will fall back to a **dynamic local plan generator** if the API key is unavailable.

---

### Step 5 — Run Both Servers Together

From the **root folder**, run:

```bash
npm run dev
```

This starts **both** servers concurrently:
| Server | URL |
|--------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (Express) | http://localhost:5000 |

> If port 3000 is busy, Next.js will auto-use **3001**.

---

### Alternative — Run Servers Separately

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/session` | Create anonymous JWT session | ❌ Public |
| `POST` | `/api/plan/generate` | Generate AI action plan from intake data | ✅ JWT |
| `GET` | `/api/plan/:sessionId` | Fetch saved plan for a session | ✅ JWT |
| `GET` | `/api/progress/:sessionId` | Get task completion progress | ✅ JWT |
| `PATCH` | `/api/progress/:sessionId` | Update a step's completion status | ✅ JWT |

---

## 🤖 AI Integration

The backend uses **Google Gemini** to generate personalized housing action plans.

**Flow:**
1. User fills out the **Intake Wizard** (state, situation, deadline, income, household size)
2. Frontend sends data to `POST /api/plan/generate`
3. Backend calls **Gemini API** with a structured prompt
4. Gemini returns a JSON plan: action steps, documents needed, rights summary, urgency level
5. Plan is saved to **MongoDB** and returned to the frontend
6. All pages (Risk, Action Plans, Dashboard) load data from this saved plan

**Fallback:** If Gemini is unavailable, the backend generates a **dynamic local plan** based on the intake data keywords (no AI call needed).

---

## 🗄️ Database

- **Primary:** MongoDB Atlas (cloud) — configured via `MONGODB_URI` in `backend/.env`
- **Fallback:** `mongodb-memory-server` — an in-memory MongoDB that spins up automatically if Atlas connection fails. **Data resets on server restart.**

---

## 📦 Build for Production

```bash
# Build frontend
npm run build

# Start frontend (production)
npm start

# Start backend (production)
cd backend && npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
