# Lucidly - Mental Wellness Web App

## Overview
Lucidly is a React-based mental wellness web application that helps users track their mood, journal their thoughts, and manage stress through analytics and AI-guided check-ins.

## Architecture
- **Frontend:** React 18 with Vite 7
- **Styling:** Tailwind CSS v3 (PostCSS build — no CDN)
- **Charts:** Recharts (LineChart for 7-day mood trend)
- **Storage:** Browser localStorage
- **Package Manager:** npm (ESM — `"type": "module"`)

## Project Structure
```
/
├── index.html              # Entry HTML (no Tailwind CDN)
├── vite.config.js          # Port 5000, host 0.0.0.0, all hosts allowed
├── tailwind.config.js      # darkMode: 'class', content: src/**
├── postcss.config.js       # tailwindcss + autoprefixer
├── package.json            # type: module
├── REQUIREMENTS.md         # Full PRD (16 sections)
├── assets/                 # lucidly-logo.png, icon.png
└── src/
    ├── main.jsx            # React entry + imports index.css
    ├── index.css           # @tailwind directives + .hero-bg, .card-shadow
    └── App.jsx             # All pages and logic
```

## Features (MVP implemented)
- **Journaling** — free-form text, persisted to localStorage, character count (5000 max)
- **Daily Tracker** — emoji mood picker (Happy/Neutral/Sad), one log per day, localStorage persistence, toast on save
- **Analytics** — 7-day Recharts LineChart, running average, streak counter, placeholder when < 3 entries
- **AI Check-In** — smart stress scoring from text inputs, keyword extraction, personalised recommendations, loading state, mental-health disclaimer (FR-21)
- **Dark Mode** — initialised from localStorage; falls back to `prefers-color-scheme`; persisted on toggle
- **Responsive** — mobile hamburger menu, 320 px → 2560 px

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
