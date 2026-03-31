# Lucidly — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Status:** Draft  
> **Last Updated:** 2026-03-31

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Audience](#3-target-audience)
4. [Value Proposition](#4-value-proposition)
5. [Core Features (MVP)](#5-core-features-mvp)
6. [Future Features (v2 / Growth)](#6-future-features-v2--growth)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Technical Requirements](#9-technical-requirements)
10. [Security & Privacy Requirements](#10-security--privacy-requirements)
11. [UX / Design Requirements](#11-ux--design-requirements)
12. [Business & Monetisation Requirements](#12-business--monetisation-requirements)
13. [Compliance Requirements](#13-compliance-requirements)
14. [Metrics & Success Criteria](#14-metrics--success-criteria)
15. [Milestones & Roadmap](#15-milestones--roadmap)
16. [Open Questions & Risks](#16-open-questions--risks)

---

## 1. Executive Summary

**Lucidly** is a mental-wellness platform that empowers users to track their emotional health through daily mood logging, private journaling, data-driven analytics, and an AI-powered check-in assistant. The goal is to make mental self-care as natural and effortless as checking the weather — accessible to anyone with a smartphone.

---

## 2. Problem Statement

Mental health struggles are widespread, yet most people lack the tools to recognise early warning signs in their own wellbeing. Existing apps are either too clinical, too expensive, or too complex for everyday use. There is a clear gap for a **simple, private, and intelligent** daily companion that meets people where they are.

---

## 3. Target Audience

| Segment | Description |
|---|---|
| **Primary** | College students & young adults (18–30) experiencing stress, anxiety, and burnout |
| **Secondary** | Working professionals seeking a daily self-care habit |
| **Tertiary** | Therapists and counsellors looking for a lightweight homework tool for clients |

---

## 4. Value Proposition

> *"Track how you feel, understand why, and feel better — in under two minutes a day."*

- **Private by design** — your data stays yours
- **Science-informed** — mood tracking methods backed by CBT principles
- **AI-augmented** — personalised insights without replacing human care
- **Zero friction** — no lengthy on-boarding; start journaling in seconds

---

## 5. Core Features (MVP)

### 5.1 Journaling
- Free-form text editor for daily journal entries
- Save and retrieve the latest entry
- Timestamp each entry automatically
- Basic character count / writing prompt suggestions

### 5.2 Daily Mood Tracker
- Single-tap mood selection (Happy / Neutral / Sad — expandable to a 1–10 scale)
- Optional brief note attached to each mood log
- One log per day (with the ability to update until midnight)
- Persistent history stored per authenticated user

### 5.3 Analytics Dashboard
- Calendar heat-map showing mood over the past 30 / 90 days
- Line chart of mood trend over time
- Streak counter (consecutive days logged)
- Simple summary statistics (most common mood, average score)

### 5.4 AI Check-In
- Short form collecting: current feeling, sleep/energy level, and stressors
- Backend model returns:
  - **Stress Score** (0–100)
  - **Key Contributing Factors** (keyword tags)
  - **Personalised Recommendations** (breathing exercises, journaling prompts, etc.)
  - Optional text-to-speech read-aloud of recommendations
- Graceful error handling when the AI service is unavailable

### 5.5 Authentication
- Email + password sign-up / login
- OAuth via Google (optional for MVP)
- Password reset via email
- Session management with JWT tokens

### 5.6 Dark Mode
- System-preference detection with manual toggle override

---

## 6. Future Features (v2 / Growth)

| Feature | Description |
|---|---|
| **Multiple Journal Entries per Day** | Support for timestamped entries throughout the day |
| **Mood Tags** | User-defined tags (work, family, health) to correlate with mood |
| **Guided Journaling Prompts** | AI-generated daily prompts based on recent mood history |
| **Therapist Portal** | Invite a therapist to view anonymised trends with user consent |
| **Push / Email Reminders** | Configurable daily check-in reminders |
| **Export & Backup** | Download data as CSV or PDF |
| **Community / Peer Support** | Anonymous peer groups moderated by trained volunteers |
| **Wearable Integration** | Sync heart-rate and sleep data from Apple Health / Google Fit |
| **Mobile Apps** | React Native iOS and Android apps |
| **Localisation** | Multi-language support (starting with Spanish, French, Hindi) |

---

## 7. Functional Requirements

### 7.1 User Accounts
- `FR-01` A user shall be able to create an account with a unique email address and password.
- `FR-02` A user shall be able to log in and log out securely.
- `FR-03` A user shall be able to reset their password via a verification email.
- `FR-04` Account deletion shall permanently erase all associated user data within 30 days.

### 7.2 Journaling
- `FR-05` A user shall be able to write, edit, and save a journal entry.
- `FR-06` Journal entries shall be associated with the user's account and stored server-side.
- `FR-07` Entries shall be retrievable and sortable by date.
- `FR-08` The editor shall auto-save drafts every 30 seconds.

### 7.3 Daily Tracker
- `FR-09` A user shall be able to log a mood rating once per calendar day.
- `FR-10` A user shall be able to attach an optional short note (max 280 characters) to a mood entry.
- `FR-11` Historical mood entries shall be viewable on the analytics page.

### 7.4 Analytics
- `FR-12` The dashboard shall display a minimum of 30 days of mood history.
- `FR-13` Charts shall update in real time when new entries are submitted.
- `FR-14` The user shall be able to filter analytics by date range.

### 7.5 AI Check-In
- `FR-15` The check-in form shall accept free-text input for feeling, energy level, and stressors.
- `FR-16` The system shall return a stress score, contributing keywords, and recommendations within 5 seconds under normal load.
- `FR-17` If the AI service is unavailable, the system shall display a clear fallback message.
- `FR-18` Check-in history shall be stored and viewable by the user.

### 7.6 Navigation & UI
- `FR-19` The app shall be navigable without a page reload (SPA routing).
- `FR-20` The app shall be fully usable on screen widths from 320 px to 2560 px.
- `FR-21` Dark mode shall persist across sessions using localStorage or user profile preference.

---

## 8. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| `NFR-01` | **Performance** — Initial page load (LCP) | < 2.5 s on a 4G connection |
| `NFR-02` | **Availability** | 99.9% monthly uptime (SLA) |
| `NFR-03` | **Scalability** | Support 100 k MAU without architecture changes |
| `NFR-04` | **API Response Time** | 95th-percentile < 400 ms (non-AI endpoints) |
| `NFR-05` | **AI Response Time** | 95th-percentile < 5 s |
| `NFR-06` | **Accessibility** | WCAG 2.1 Level AA |
| `NFR-07` | **Browser Support** | Latest 2 versions of Chrome, Firefox, Safari, Edge |
| `NFR-08` | **Offline Support** | Core journaling usable offline; sync on reconnect |

---

## 9. Technical Requirements

### 9.1 Current Frontend Stack
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS |
| State | React `useState` / `useEffect` (localStorage for now) |
| Deployment | Static hosting (Vercel / Netlify recommended) |

### 9.2 Required Backend (to be built)
| Layer | Recommended Technology |
|---|---|
| API | Node.js + Express **or** Python + FastAPI |
| Database | PostgreSQL (relational data) + Redis (session cache) |
| Authentication | JWT + refresh-token rotation; bcrypt for passwords |
| AI / NLP | OpenAI GPT-4o API **or** self-hosted Llama 3 |
| File Storage | AWS S3 / Cloudflare R2 (future media attachments) |
| Email | SendGrid / AWS SES (verification & notifications) |
| Hosting | AWS / GCP / Railway / Render |

### 9.3 Frontend Architecture (target)
- Introduce **React Router v6** for client-side routing (replace current `currentPage` state machine)
- Add **React Query** or **SWR** for server-state fetching and caching
- Move to **Vite + TypeScript** for type safety
- Component library: keep Tailwind; consider **shadcn/ui** for accessible primitives
- Replace CDN Tailwind with a PostCSS build for production

### 9.4 API Contracts (high-level)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/reset-password

GET    /api/journal              → list entries
POST   /api/journal              → create entry
PUT    /api/journal/:id          → update entry
DELETE /api/journal/:id          → delete entry

GET    /api/tracker              → list mood logs
POST   /api/tracker              → log today's mood

GET    /api/analytics            → aggregated stats

POST   /api/ai/checkin           → submit check-in, receive analysis
GET    /api/ai/checkin/history   → past check-ins
```

---

## 10. Security & Privacy Requirements

- `SEC-01` All data in transit shall be encrypted with TLS 1.2 or higher.
- `SEC-02` All passwords shall be hashed with bcrypt (cost factor ≥ 12) before storage.
- `SEC-03` JWT access tokens shall expire after 15 minutes; refresh tokens after 7 days.
- `SEC-04` User journal entries shall be encrypted at rest (AES-256 or database-level encryption).
- `SEC-05` The AI check-in endpoint shall not log or retain raw user input beyond the user's own stored history.
- `SEC-06` Third-party AI providers must sign a Data Processing Agreement (DPA) before integration.
- `SEC-07` Rate limiting shall be applied to all authentication and AI endpoints.
- `SEC-08` OWASP Top 10 vulnerabilities shall be addressed before public launch.
- `SEC-09` A formal Privacy Policy and Terms of Service shall be published at launch.

---

## 11. UX / Design Requirements

- `UX-01` The primary CTA ("Get Started") shall be visible above the fold on all screen sizes.
- `UX-02` Onboarding shall take fewer than 60 seconds (sign-up + first mood log).
- `UX-03` Error states shall use human-readable messages; never raw error codes.
- `UX-04` Loading states shall be communicated with skeleton screens or spinners.
- `UX-05` Destructive actions (delete entry) shall require confirmation.
- `UX-06` The colour palette shall meet WCAG AA contrast ratio (4.5:1 for body text).
- `UX-07` The AI Check-In results page shall include a disclaimer that Lucidly is not a substitute for professional mental health care.

---

## 12. Business & Monetisation Requirements

### 12.1 Pricing Tiers

| Tier | Price | Features |
|---|---|---|
| **Free** | $0/month | Journaling (7-day history), Daily Tracker (30-day history), Basic Analytics |
| **Pro** | $5.99/month | Unlimited history, AI Check-In (10/month), Export, Custom reminders |
| **Unlimited** | $9.99/month | Everything in Pro + unlimited AI check-ins, Priority support |

### 12.2 Revenue Goals (Year 1)
- 10,000 registered users within 6 months of launch
- 5% conversion from Free → Pro/Unlimited
- $3,000 MRR by end of Year 1

### 12.3 Growth Channels
- Content marketing (mental health blog / SEO)
- University partnerships and student ambassador programme
- App Store Optimisation (ASO) once mobile apps are released
- Referral programme ("Invite a friend, get 1 free month of Pro")

---

## 13. Compliance Requirements

| Regulation | Requirement |
|---|---|
| **GDPR** (EU) | User data export, right to erasure, cookie consent banner, DPA with all sub-processors |
| **CCPA** (California) | "Do Not Sell My Data" opt-out, privacy notice at collection |
| **HIPAA** | *Not required* unless clinical data is collected and shared with healthcare providers; reassess if therapist portal is built |
| **COPPA** | No users under 13; age gate on sign-up |
| **App Store Guidelines** | Comply with Apple App Store & Google Play health app policies before mobile launch |

---

## 14. Metrics & Success Criteria

| Metric | Target (6 months post-launch) |
|---|---|
| Registered Users | 10,000 |
| Monthly Active Users (MAU) | 4,000 |
| Daily Active Users (DAU) | 800 |
| DAU / MAU ratio | ≥ 20% |
| 30-day retention | ≥ 30% |
| Avg. sessions per user per week | ≥ 3 |
| NPS Score | ≥ 40 |
| Pro conversion rate | ≥ 5% |
| App crash rate | < 0.1% |
| Core Web Vitals (LCP / FID / CLS) | All "Good" (green) |

---

## 15. Milestones & Roadmap

### Phase 1 — Foundation (Months 1–2)
- [ ] Set up backend API (auth, journal, tracker endpoints)
- [ ] Migrate frontend from localStorage to authenticated API calls
- [ ] Integrate React Router for proper SPA navigation
- [ ] Deploy to production (Vercel + Railway/Render)
- [ ] Add real charts to the Analytics page (Recharts / Chart.js)

### Phase 2 — AI Integration (Months 2–3)
- [ ] Connect AI Check-In to live backend (OpenAI or self-hosted model)
- [ ] Store check-in history per user
- [ ] Implement text-to-speech for recommendations
- [ ] Rate-limit AI endpoints; add usage tracking per user tier

### Phase 3 — Polish & Launch (Months 3–4)
- [ ] Complete WCAG 2.1 AA accessibility audit
- [ ] Implement reminders (email/push)
- [ ] Publish Privacy Policy and Terms of Service
- [ ] Beta launch to 200 invited users; collect NPS feedback
- [ ] Public launch with Free + Pro tiers

### Phase 4 — Growth (Months 5–6)
- [ ] React Native mobile apps (iOS + Android)
- [ ] Referral programme
- [ ] Content marketing / SEO blog
- [ ] Therapist portal (beta)

---

## 16. Open Questions & Risks

| # | Question / Risk | Owner | Status |
|---|---|---|---|
| 1 | Which AI provider will power check-ins? (OpenAI vs. self-hosted) | Tech lead | Open |
| 2 | Does storing mental-health data trigger HIPAA obligations in certain markets? | Legal | Open |
| 3 | How will we moderate community features to prevent harmful content? | Product | Future |
| 4 | What is the data retention policy for deleted accounts? | Legal / Eng | Open |
| 5 | Will the app require a clinical disclaimer / review before launch in certain app stores? | Legal | Open |
| 6 | Single founder risk — bus-factor of 1 for core engineering | Founder | Mitigation needed |

---

*This document is a living specification. Update it as product decisions are made and new information is gathered.*
