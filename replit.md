# Lucidly - Mental Wellness Web App

## Overview
Lucidly is a React-based mental wellness web application that helps users track their mood, journal their thoughts, and manage stress through analytics and AI-guided check-ins.

## Architecture
- **Frontend:** React 18 with Vite 7 (port 5000)
- **Backend:** Express.js API server (port 3001, proxied via Vite `/api/*`)
- **Database:** Replit PostgreSQL (tables: users, journal_entries, mood_logs, ai_checkins)
- **Auth:** JWT tokens (bcryptjs hashing, 30-day expiry), stored in localStorage
- **Styling:** Tailwind CSS v3 (PostCSS build), dark/light mode toggle, "Warm Elevated" design
- **Icons:** lucide-react
- **Charts:** Recharts (LineChart for 7-day mood trend)
- **Package Manager:** npm (ESM — `"type": "module"`)

## Project Structure
```
/
├── index.html              # Entry HTML
├── vite.config.js          # Port 5000, proxy /api → 3001, @assets alias
├── tailwind.config.js      # darkMode: 'class', content: src/**
├── postcss.config.js       # tailwindcss + autoprefixer
├── package.json            # type: module, dev runs concurrently
├── REQUIREMENTS.md         # Full PRD (16 sections)
├── assets/                 # lucidly-logo.png, lucidly-hero.png, icon.png
├── server/
│   ├── index.js            # Express app (port 3001)
│   ├── db.js               # pg Pool (DATABASE_URL)
│   ├── middleware/auth.js  # JWT verify + signToken
│   └── routes/
│       ├── auth.js         # POST /signup, /login; GET /me
│       ├── journal.js      # GET/POST /api/journal
│       ├── moods.js        # GET/POST /api/moods
│       └── checkins.js     # GET/POST /api/checkins
└── src/
    ├── main.jsx            # React entry + imports index.css
    ├── index.css           # @tailwind directives
    ├── App.jsx             # All pages and router
    ├── context/
    │   └── AuthContext.jsx # AuthProvider, useAuth hook
    └── components/
        └── AuthModal.jsx   # Sign in / Sign up modal
```

## Features (MVP implemented)
- **Auth** — Sign up / Sign in modal, JWT session, bcrypt password hashing, persistent across refresh
- **Journaling** — free-form text, persisted to PostgreSQL per user, character count (5000 max)
- **Daily Tracker** — emoji mood picker (Happy/Neutral/Sad), one log per day, PostgreSQL persistence
- **Analytics** — 7-day Recharts LineChart from DB data, running average, streak counter
- **AI Check-In** — smart stress scoring, keyword extraction, personalised recommendations, saved to DB
- **Dark/Light Mode** — toggle button (sun/moon) in nav, works across all pages including home page
- **Logo** — existing lucidly-logo.png used in nav and auth modal
- **Responsive** — mobile hamburger menu, dark-themed mobile drawer

## Key localStorage Keys
| Key | Value |
|---|---|
| `lucidly_journal_entry` | String — latest journal text |
| `lucidly_mood_logs` | JSON array of `{date, mood, value}` |
| `lucidly_dark_mode` | `"true"` or `"false"` |

## Development
```bash
npm install
npm run dev   # runs on port 5000
```

## Deployment
Configured as a static site:
- Build: `npm run build`
- Public directory: `dist`
