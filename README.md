# Lucidly

A calm, privacy-focused mental wellness app to help users journal, track mood, and run AI-guided check-ins with actionable insights.

<p align="left">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostCSS-8.x-DD3A0A?logo=postcss&logoColor=white" alt="PostCSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/bcryptjs-Password_Hashing-7A1FA2" alt="bcryptjs" />
  <img src="https://img.shields.io/badge/Recharts-Analytics-FF6F61" alt="Recharts" />
  <img src="https://img.shields.io/badge/Lucide-Icons-A1A1AA" alt="Lucide React" />
  <img src="https://img.shields.io/badge/NPM-9%2B-CB3837?logo=npm&logoColor=white" alt="npm" />
  <img src="https://img.shields.io/badge/ESM-Module-1F6FEB" alt="ESM" />
  <img src="https://img.shields.io/badge/CORS-Enabled-2EA043" alt="CORS" />
  <img src="https://img.shields.io/badge/Theme-Dark%20%2F%20Light-111827" alt="Dark/Light mode" />
  <img src="https://img.shields.io/badge/Platform-Web_App-0EA5E9" alt="Web App" />
  <img src="https://img.shields.io/badge/Architecture-Fullstack-6366F1" alt="Fullstack" />
  <img src="https://img.shields.io/badge/Status-MVP-22C55E" alt="MVP" />
  <img src="https://img.shields.io/badge/PRD-Available-8B5CF6" alt="PRD" />
  <img src="https://img.shields.io/badge/Version-0.1.0-F59E0B" alt="Version" />
</p>

## Table of Contents
- [Why Lucidly](#why-lucidly)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Current Status](#current-status)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)

## Why Lucidly
Lucidly is built for people who want emotional clarity without noisy, addictive UX patterns.

The app combines:
- Reflective journaling
- Daily mood tracking
- Lightweight analytics
- AI-guided stress check-ins
- Secure account-based persistence

## Core Features
### 1) Authentication
- Sign up and sign in with email/password
- Password hashing with bcrypt
- JWT authentication for protected endpoints
- Session persistence through local token storage

### 2) Reflective Journaling
- Single latest journal entry per user
- Save and update flow through API
- Character-limited, distraction-free writing experience

### 3) Daily Mood Tracker
- Mood options: Happy, Neutral, Sad
- One mood log per day (upsert behavior)
- Quick save UX with visual feedback

### 4) Analytics Dashboard
- 7-day mood trend visualization
- Average mood calculation
- Daily streak logic based on saved logs

### 5) AI Check-ins
- Captures feeling, energy, and stressors
- Computes a stress score and extracts keywords
- Returns explanation plus practical recommendations
- Persists check-in history per user

### 6) UX and Design
- Responsive layout (mobile and desktop)
- Dark and light mode toggle
- Branded Lucidly visual identity

## Tech Stack
### Frontend
- React 18
- Vite 7
- Tailwind CSS 3 + PostCSS + Autoprefixer
- Recharts
- Lucide React icons

### Backend
- Node.js + Express 5
- PostgreSQL via pg
- JSON Web Tokens (jsonwebtoken)
- bcryptjs
- CORS + JSON middleware

## Architecture
- Frontend runs on Vite dev server (port 5000)
- Backend API runs on Express (port 3001)
- Vite proxy forwards /api requests to the backend
- Production build output is served from dist by Express when available

## Getting Started
### Prerequisites
- Node.js 20+
- npm 9+
- PostgreSQL database

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Create a .env file in the project root:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=your_super_secret_jwt_key
API_PORT=3001
```

### 3) Start development servers
```bash
npm run dev
```
This starts:
- API server on port 3001
- Vite frontend on port 5000

### 4) Build for production
```bash
npm run build
```

### 5) Run API server only
```bash
npm run start
```

## Environment Variables
- DATABASE_URL: PostgreSQL connection string used by server/db.js
- JWT_SECRET: Secret used to sign/verify JWTs (defaults to a dev fallback if not provided)
- API_PORT: Express API port (default 3001)

## Available Scripts
- npm run dev: Runs Express and Vite concurrently
- npm run build: Builds frontend with Vite
- npm run preview: Previews built frontend
- npm run start: Runs Express server

## API Endpoints
### Health
- GET /api/health

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

### Journal (auth required)
- GET /api/journal
- POST /api/journal

### Moods (auth required)
- GET /api/moods
- POST /api/moods

### AI Check-ins (auth required)
- GET /api/checkins
- POST /api/checkins

## Project Structure
```text
.
|-- assets/
|-- server/
|   |-- db.js
|   |-- index.js
|   |-- middleware/
|   |   `-- auth.js
|   `-- routes/
|       |-- auth.js
|       |-- checkins.js
|       |-- journal.js
|       `-- moods.js
|-- src/
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|   |-- components/
|   |   `-- AuthModal.jsx
|   `-- context/
|       `-- AuthContext.jsx
|-- REQUIREMENTS.md
|-- package.json
|-- tailwind.config.js
|-- postcss.config.js
`-- vite.config.js
```

## Current Status
- MVP is functional end-to-end for auth, journaling, mood tracking, analytics, and check-ins
- Security audit currently reports no known npm vulnerabilities
- Frontend production build is passing

## Roadmap
- Add stronger token/session strategy (refresh token flow)
- Add richer AI integrations for check-ins
- Add more analytics breakdowns and trend correlations
- Add tests (unit + API integration + E2E)
- Improve bundle splitting for large chunk warnings

## Troubleshooting
### Unknown at rule @tailwind in editor
This is usually a VS Code CSS lint warning, not a build failure.

Fix options:
- Install Tailwind CSS IntelliSense extension
- Add workspace setting:
```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

### concurrently is not recognized
Run:
```bash
npm install
```
This installs local binaries in node_modules/.bin used by npm scripts.

---

Built with care for mental wellness and clarity-first product design.
