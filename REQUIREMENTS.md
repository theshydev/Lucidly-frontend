# Lucidly — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Date:** 2026-03-31  
> **Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Audience](#3-target-audience)
4. [Value Proposition](#4-value-proposition)
5. [Core MVP Features](#5-core-mvp-features)
6. [Future Features (v2)](#6-future-features-v2)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Technical Requirements](#9-technical-requirements)
10. [Security & Privacy](#10-security--privacy)
11. [UX / Design](#11-ux--design)
12. [Business & Monetisation](#12-business--monetisation)
13. [Compliance](#13-compliance)
14. [Metrics & KPIs](#14-metrics--kpis)
15. [Milestones & Roadmap](#15-milestones--roadmap)
16. [Open Questions & Risks](#16-open-questions--risks)

---

## 1. Executive Summary

Lucidly is a mental wellness web application that empowers users to track their mood, journal their thoughts, and gain clarity on their emotional patterns through data-driven insights and an AI-powered check-in experience. Built for a generation that manages stress digitally, Lucidly offers a privacy-first, distraction-free sanctuary where self-reflection is frictionless and progress is visible. The MVP ships as a React/Vite frontend with localStorage persistence; v2 introduces a cloud backend, real-time AI guidance, and a monetised subscription tier — positioning Lucidly to capture share in the $6 B+ digital mental wellness market.

---

## 2. Problem Statement

Mental health awareness is rising, but accessible daily-practice tools remain either overly clinical (therapy apps), overly social (mood-sharing platforms), or prohibitively expensive. Existing journaling and mood-tracking apps are fragmented: users juggle separate tools for journaling, habit tracking, and AI reflection. Key gaps in the market:

- No single lightweight tool combines structured mood logging, free-form journaling, trend analytics, and AI-guided reflection in one place.
- Data is either siloed on-device with no cross-device sync or stored in the cloud without transparent privacy controls.
- Onboarding friction is high — most wellness apps take 5+ minutes to set up before delivering value.
- Students and early-career professionals are underserved; enterprise wellness tools are priced out of reach.

Lucidly fills this gap with a minimal, beautiful, privacy-respecting tool that delivers value within the first 60 seconds.

---

## 3. Target Audience

### 3.1 Primary — College Students (18–24)
- High stress load: exams, social pressure, financial strain.
- Digitally native; prefer mobile-friendly web apps over native installs.
- Price-sensitive; need a compelling free tier before conversion.
- Already familiar with journaling apps (Day One, Notion) but want something purpose-built for mental wellness.

### 3.2 Secondary — Young Professionals (25–35)
- Work-related burnout and anxiety; limited time for self-care.
- Willing to pay for Pro features if ROI on well-being is clear.
- Cross-device usage (laptop at work, phone at home) requires cloud sync.
- Respond to data and visualisation — want to see mood trends tied to life events.

### 3.3 Tertiary — Therapists & Counsellors
- Could assign Lucidly as a between-session homework tool.
- Need a read-only therapist portal with consent-gated data export.
- Compliance requirements (HIPAA-adjacent) become critical for this segment.
- Represents a future B2B channel (per-seat licensing).

---

## 4. Value Proposition

**Core promise:** "Understand yourself better in 60 seconds a day."

### Differentiators
| Differentiator | Lucidly | Typical competitor |
|---|---|---|
| Time to first value | < 60 s (no account required for MVP) | 3–10 min onboarding |
| Privacy default | On-device first; opt-in cloud sync | Cloud-first, always |
| AI guidance | Integrated check-in with stress scoring | Separate chatbot or none |
| Price | Free tier + $5.99 Pro | $9.99–$14.99/mo |
| Stack weight | Lightweight PWA | Native app download required |

---

## 5. Core MVP Features

### 5.1 Journaling
- Free-form text area with auto-save to `localStorage` (MVP) and cloud sync (v2).
- Single active entry per day; previous entries accessible in a dated list.
- Character count indicator; no hard limit imposed.
- Entries timestamped in ISO 8601 format; displayed in user's local timezone.

### 5.2 Daily Mood Tracker
- Emotion picker: Happy, Neutral, Sad (MVP); extended set in v2 (Anxious, Angry, Energised, Calm).
- One mood log per day; user can update until midnight local time.
- Mood saved with timestamp to `localStorage` (MVP) and synced to DB (v2).
- Visual confirmation toast on save.

### 5.3 Analytics Dashboard
- 7-day and 30-day mood trend chart (line or bar).
- Running average mood score.
- Streak counter: consecutive days with at least one log.
- Placeholder skeleton shown when fewer than 3 data points exist.
- Chart library: Recharts (MVP); upgrade path to D3 for v2.

### 5.4 AI Check-In
- Three free-text inputs: current feeling, sleep/energy, stressors.
- On submission: stress score (0–100), contributing keywords, plain-language explanation, and personalised recommendations.
- MVP: mocked response (hardcoded output + NetworkError stub visible in current code).
- v2: live API call to LLM provider (OpenAI GPT-4o or equivalent).
- "Listen" button reserved for text-to-speech integration (v2).
- Response displayed inline; no chat history retained in MVP.

### 5.5 Authentication
- Email + password sign-up/login (v2; not present in MVP).
- JWT-based session with 15-minute access token and 7-day refresh token.
- "Continue without account" mode persists to `localStorage` indefinitely.
- Password reset via email link; rate-limited to 3 requests per hour per email.

### 5.6 Dark Mode
- Toggle in navbar; state persisted to `localStorage`.
- Applies `dark` class to `<html>`; all components styled with Tailwind dark-mode variants.
- Respects `prefers-color-scheme` media query on first load.

---

## 6. Future Features (v2)

| Feature | Description |
|---|---|
| Multiple journals | Named, colour-coded journal notebooks per user |
| Entry tagging | User-defined tags (e.g., `#work`, `#family`) with tag-based filtering |
| Guided prompts | Daily rotating writing prompts based on mood pattern |
| Mood granularity | Extended 8-emotion picker with intensity slider (1–10) |
| Therapist portal | Consent-gated read-only view; CSV export; session note attachment |
| Native mobile apps | React Native (iOS + Android) using shared component logic |
| Wearable integration | Apple Health / Google Fit mood/sleep data import via OAuth |
| Voice journaling | Browser-based speech-to-text transcription |
| Push notifications | Daily reminder via web push or mobile push |
| Community (opt-in) | Anonymous mood aggregate visualisations; no individual data shared |

---

## 7. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow a user to write and save a journal entry without creating an account. |
| FR-02 | The system shall persist journal entries to `localStorage` in MVP and to the authenticated user's cloud record in v2. |
| FR-03 | The system shall display the most recently saved journal entry when the Journaling page is opened. |
| FR-04 | The system shall allow a user to select and save a mood for the current day from a predefined list. |
| FR-05 | The system shall display a toast notification confirming a successful save action within 500 ms. |
| FR-06 | The system shall display a 7-day mood trend on the Analytics page using historical log data. |
| FR-07 | The system shall show a placeholder state on the Analytics page when fewer than 3 mood entries exist. |
| FR-08 | The system shall accept three text inputs (feeling, energy, stressors) on the AI Check-In page. |
| FR-09 | The system shall return a stress score, keyword list, explanation, and recommendations in response to an AI Check-In submission. |
| FR-10 | The system shall display an error state if the AI Check-In API call fails, rather than a blank screen. |
| FR-11 | The system shall support toggling dark mode; the preference shall be persisted across sessions. |
| FR-12 | The system shall render correctly on viewport widths from 320 px to 2560 px. |
| FR-13 | The system shall provide a navigation menu accessible on mobile via a hamburger icon. |
| FR-14 | In v2, the system shall allow a user to register with email and password. |
| FR-15 | In v2, the system shall authenticate users with JWT and refresh tokens; expired sessions shall redirect to the login page. |
| FR-16 | In v2, the system shall sync all journal entries and mood logs to the user's cloud account. |
| FR-17 | In v2, the system shall support password reset via a time-limited email link (expires after 1 hour). |
| FR-18 | In v2, the AI Check-In shall call a live LLM API and return a dynamically generated response. |
| FR-19 | In v2, the Analytics page shall support 7-day and 30-day views with a view switcher. |
| FR-20 | In v2, a user shall be able to delete their account and all associated data within 30 days of request (GDPR right to erasure). |
| FR-21 | The system shall display a mental-health disclaimer on the AI Check-In page clarifying it is not a substitute for professional care. |

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Initial page load (LCP): ≤ 2.5 s on a 4G mobile connection.
- Time to Interactive (TTI): ≤ 3.5 s.
- Journal save round-trip (localStorage): ≤ 50 ms.
- AI Check-In API response (v2): ≤ 5 s with a loading spinner shown after 500 ms.
- Analytics chart render: ≤ 300 ms after data is available.

### 8.2 Uptime & Reliability
- Frontend static hosting: 99.9 % monthly uptime SLA.
- Backend API (v2): 99.5 % monthly uptime SLA.
- Scheduled maintenance windows: announced 48 hours in advance; max 2 hours/month.

### 8.3 Accessibility
- Compliance target: WCAG 2.1 Level AA.
- All interactive elements keyboard-navigable with visible focus indicators.
- Colour contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text.
- All images have descriptive `alt` attributes.
- Screen reader tested on NVDA (Windows) and VoiceOver (macOS/iOS).

### 8.4 Browser Support
- Chrome/Edge 110+, Firefox 110+, Safari 16+ (desktop and mobile).
- No IE11 support required.

### 8.5 Internationalisation
- MVP: English only.
- v2: i18n scaffolding in place (react-i18next); Spanish and French as first additions.

---

## 9. Technical Requirements

### 9.1 Current Stack (MVP)
| Layer | Technology |
|---|---|
| Framework | React 18.2 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS (CDN) |
| State | React hooks (`useState`, `useEffect`) |
| Persistence | Browser `localStorage` |
| Hosting | Static site (Replit / CDN) |

### 9.2 Required Backend Stack (v2)
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (Express) **or** Python 3.12 (FastAPI) |
| Database | PostgreSQL 15 (primary), Redis 7 (sessions / cache) |
| Auth | JWT (access: 15 min, refresh: 7 days) |
| AI provider | OpenAI GPT-4o API (primary) |
| Object storage | S3-compatible (future voice/attachment uploads) |
| Hosting | Replit Autoscale (web) + managed Postgres |

### 9.3 API Contract (v2 — key endpoints)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register with email + password |
| POST | `/api/auth/login` | None | Login; returns access + refresh tokens |
| POST | `/api/auth/refresh` | Refresh token | Rotate access token |
| POST | `/api/auth/reset-password` | None | Send password-reset email |
| GET | `/api/journal` | Bearer | List entries (paginated) |
| POST | `/api/journal` | Bearer | Create journal entry |
| PUT | `/api/journal/:id` | Bearer | Update entry |
| DELETE | `/api/journal/:id` | Bearer | Delete entry |
| GET | `/api/mood` | Bearer | List mood logs |
| POST | `/api/mood` | Bearer | Log today's mood |
| POST | `/api/ai/checkin` | Bearer | AI Check-In (proxied to LLM) |
| DELETE | `/api/user` | Bearer | Delete account + all data |

### 9.4 Migration Plan
1. **Phase 1 (MVP):** Ship current React/Vite app with `localStorage`. No backend.
2. **Phase 2 (v2 prep):** Add Vite plugin for env vars; introduce React Query for data-fetching layer (no-op in MVP, points to API in v2).
3. **Phase 3 (v2 launch):** Stand up Node/FastAPI backend + PostgreSQL; migrate `localStorage` data to cloud on first authenticated session.
4. **Phase 4:** Add Redis caching for AI responses; rate-limit AI Check-In to 10 calls/day on Free tier.

---

## 10. Security & Privacy

| Control | Implementation |
|---|---|
| Transport security | TLS 1.2+ enforced on all endpoints; HSTS preloading |
| Password storage | bcrypt with cost factor 12 |
| Session management | JWT access token (15 min) + HttpOnly refresh token cookie (7 days); token rotation on every refresh |
| At-rest encryption | PostgreSQL column-level encryption for journal text and mood logs |
| Input validation | Server-side validation on all API inputs; parameterised queries (no raw SQL) |
| OWASP Top 10 | Addressed: XSS (React's JSX escaping), CSRF (SameSite cookies), SQLi (ORM/parameterised), broken auth (JWT rotation), security misconfiguration (env-var secrets only) |
| AI input sanitisation | Strip PII from AI Check-In payloads before forwarding to LLM provider |
| Dependency audits | `npm audit` run in CI on every PR; critical vulnerabilities block merge |
| Data retention | User data deleted within 30 days of account deletion request |
| Logging | No journal content logged server-side; only metadata (timestamps, user ID) |

---

## 11. UX / Design

### 11.1 Onboarding
- First-time visitors land on the home page; no account required to access Journaling or Daily Tracker.
- User should reach their first saved journal entry in under 60 seconds from landing.
- Onboarding tour (v2): 3-step tooltip overlay on first login.

### 11.2 Error States
- Network failure on AI Check-In: display inline error message (not a blank/crashed page); provide a "Try Again" button.
- Empty Analytics state: display a friendly illustration and prompt to log a mood.
- Form validation errors: inline, below the relevant field; never modal-blocking.

### 11.3 Visual Design Principles
- Colour palette: soft blues and purples (calm, trust); avoid harsh reds except for critical error states.
- Typography: system font stack for performance; headings use `font-extrabold`; body uses default weight.
- Spacing: consistent 8 px grid; Tailwind spacing scale.
- Cards: `rounded-2xl`, `shadow-lg`; hover states use `hover:shadow-xl` transition.

### 11.4 Contrast & Accessibility
- All text passes WCAG 2.1 AA contrast in both light and dark modes.
- Dark mode uses `bg-gray-900` / `text-gray-100`; components use `dark:` Tailwind variants.
- Focus rings visible on all interactive elements (`focus:ring-2`).

### 11.5 Mental Health Disclaimer
- Displayed prominently on the AI Check-In page:  
  *"Lucidly is a self-reflection tool and is not a substitute for professional mental health care. If you are in crisis, please contact a licensed therapist or emergency services."*
- Disclaimer link to relevant crisis resources (e.g., 988 Lifeline in the US).

---

## 12. Business & Monetisation

### 12.1 Pricing Tiers

| Feature | Free | Pro ($5.99/mo) | Unlimited ($9.99/mo) |
|---|---|---|---|
| Journal entries | 1 active entry | Unlimited | Unlimited |
| Mood logs | Unlimited | Unlimited | Unlimited |
| Analytics | 7-day view | 30-day view | 90-day + export |
| AI Check-In | 3/day | 10/day | Unlimited |
| Cloud sync | — | Yes | Yes |
| Dark mode | Yes | Yes | Yes |
| Priority support | — | Email | Email + chat |
| Therapist sharing | — | — | Yes (v2) |

### 12.2 Year 1 Revenue Goals
| Metric | Target |
|---|---|
| Monthly Active Users (MAU) at end of Y1 | 10,000 |
| Free → Pro conversion rate | 5 % |
| Monthly Recurring Revenue (MRR) at end of Y1 | ~$3,000 |
| Annual Recurring Revenue (ARR) target | $30,000 |

### 12.3 Growth Channels
- **Organic SEO:** Content marketing around journaling, CBT, and stress management.
- **College partnerships:** Pilot programme with 2–3 university counselling centres.
- **Social media:** Short-form content on mental wellness tips (TikTok, Instagram).
- **Product Hunt launch:** Target top-5 product of the day on launch day.
- **Referral programme (v2):** Free month of Pro for every 3 referred sign-ups.

---

## 13. Compliance

| Regulation | Requirement | Status |
|---|---|---|
| GDPR | Right to access, right to erasure (30-day SLA), data portability (JSON/CSV export), DPA with any sub-processors | Planned for v2 |
| CCPA | "Do Not Sell My Personal Information" opt-out; privacy policy disclosures | Planned for v2 |
| COPPA | No users under 13; age gate on sign-up; no data collection from minors | Planned for v2 |
| App Store (Apple / Google) | Privacy nutrition labels; no required tracking without explicit opt-in | Planned for mobile v2 |
| HIPAA | **Not targeted** for MVP or Pro tier; HIPAA-adjacent controls (encryption, audit logs) considered for therapist portal tier only | Risk — see §16 |

---

## 14. Metrics & KPIs

### 14.1 Engagement
| KPI | Target (end of Y1) |
|---|---|
| Monthly Active Users (MAU) | 10,000 |
| Daily Active Users (DAU) | 1,500 |
| DAU / MAU ratio | ≥ 15 % |
| 30-day retention | ≥ 30 % |
| Average session length | ≥ 3 min |
| Journal entries per active user per week | ≥ 3 |

### 14.2 Business
| KPI | Target |
|---|---|
| Free → Pro conversion | 5 % |
| Pro churn rate | ≤ 5 %/month |
| Net Promoter Score (NPS) | ≥ 40 |
| Customer Acquisition Cost (CAC) | < $10 |
| Lifetime Value (LTV) | > $60 |

### 14.3 Technical (Core Web Vitals)
| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | ≤ 2.5 s |
| Interaction to Next Paint (INP) | ≤ 200 ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| First Contentful Paint (FCP) | ≤ 1.8 s |

---

## 15. Milestones & Roadmap

### Phase 1 — MVP Polish (Weeks 1–4)
- Fix AI Check-In NetworkError (connect to real API or clearly mock response).
- Implement mood persistence in `localStorage`; populate Analytics with real data.
- Add Recharts-based 7-day mood trend chart to Analytics page.
- Replace Tailwind CDN with PostCSS build for production performance.
- Ship to production via Replit static deployment.

### Phase 2 — Backend Foundation (Weeks 5–8)
- Scaffold Node.js / FastAPI backend with PostgreSQL.
- Implement auth (register, login, JWT, refresh, reset-password).
- Migrate journal and mood APIs; sync `localStorage` data on first login.
- Set up CI pipeline: lint, audit, build, deploy on merge to `main`.

### Phase 3 — AI & Pro Tier (Weeks 9–14)
- Integrate live LLM API for AI Check-In; add rate limiting.
- Implement Pro subscription via Stripe; gate Pro features by subscription status.
- Extend Analytics to 30-day view (Pro) and add CSV export (Unlimited).
- Add dark mode persistence to user profile (not just `localStorage`).

### Phase 4 — Growth & Polish (Weeks 15–24)
- Therapist portal (read-only, consent-gated, CSV export).
- i18n scaffold (react-i18next); Spanish and French translations.
- PWA manifest + service worker for offline journaling.
- Product Hunt launch; college pilot outreach.
- GDPR / CCPA compliance pass; privacy policy and ToS published.

---

## 16. Open Questions & Risks

| # | Risk / Question | Severity | Notes |
|---|---|---|---|
| R-01 | **AI provider choice:** OpenAI GPT-4o costs may be prohibitive at scale; rate limits may cause UX degradation under load. | High | Evaluate Anthropic Claude and open-source alternatives (Llama 3); design provider-agnostic abstraction layer. |
| R-02 | **HIPAA scope creep:** If therapists use Lucidly to store patient data, HIPAA requirements apply and are expensive to implement correctly. | High | Explicitly exclude PHI from terms of service for MVP and Pro; defer HIPAA to a separately scoped therapist-tier product. |
| R-03 | **Bus-factor / solo maintainer:** Current codebase is a single-developer project; a single point of failure for velocity and knowledge. | Medium | Document architecture decisions in REQUIREMENTS.md and replit.md; consider open-source community or co-founder hire by Phase 3. |
| R-04 | **Data privacy perception:** Mental health data is highly sensitive; any breach or misuse perception could destroy user trust instantly. | High | Privacy-first architecture; no analytics SDK with third-party data sharing (no GA4, Hotjar, etc.) without explicit user opt-in. |
| R-05 | **Tailwind CDN in production:** Current `index.html` loads Tailwind from CDN; this is flagged as a production anti-pattern and adds external dependency. | Medium | Replace with PostCSS + `@tailwindcss/vite` plugin as part of Phase 1 polish. |
| R-06 | **`localStorage` data loss:** On-device storage can be cleared by the browser (e.g., private mode, storage pressure, manual clear); users may lose journal entries. | Medium | Display a persistent banner warning in MVP; prioritise cloud sync in Phase 2 to eliminate the risk entirely. |
