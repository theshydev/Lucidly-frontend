# Lucidly - Mental Wellness Web App

## Overview
Lucidly is a React-based mental wellness web application that helps users track their mood, journal their thoughts, and manage stress.

## Architecture
- **Frontend:** React 18 with Vite 7
- **Styling:** Tailwind CSS (via CDN)
- **Storage:** Browser localStorage
- **Package Manager:** npm

## Project Structure
```
/
├── index.html          # Entry HTML
├── vite.config.js      # Vite configuration (port 5000, all hosts allowed)
├── package.json        # Dependencies
├── assets/             # Static assets (logos, icons)
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Main app component with all pages
```

## Features
- Mood tracking
- Journaling (saved to localStorage)
- Analytics
- AI Check-In (mocked frontend)
- Dark mode toggle

## Development
```bash
npm install
npm run dev   # runs on port 5000
```

## Deployment
Configured as a static site deployment:
- Build: `npm run build`
- Public directory: `dist`
