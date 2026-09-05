# MindMap Consulting — Personality Assessment Platform

MindMap Consulting is a premium personality-assessment web application built around the **Big Five (OCEAN)** framework. It gives participants a private, repeatable assessment and personal coaching report, while giving consulting teams an admin workspace for participant reporting and cohort-level analytics.

This repository is a runnable front-end product prototype. It uses browser storage so accounts and assessment results remain available after a refresh on the same browser and device.

## What the platform does

### Participant experience

1. A visitor explores the landing page and creates an account.
2. They complete 20 reflective statements in four sections of five questions.
3. The app scores five traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Adjustment.
4. The participant receives a saved dashboard with their personality archetype, trait scores, charts, report sections, and tailored action plan.
5. They may retake the assessment. Each new attempt is stored separately, allowing the dashboard to show changes over time.

### Admin experience

The admin workspace lets the consulting team:

- View participant count, overall average score, and strongest cohort trait.
- Compare up to four participant profiles across all five traits.
- Search the completed-participant table by name.
- Open a participant row to view their full individual report.
- Review deeper cohort analytics: trait distribution, selectable trait correlation, and participation momentum.

## Assessment and scoring

The assessment includes four statements for each Big Five trait.

| Trait | What it reflects |
| --- | --- |
| Openness | Curiosity, creativity, and receptiveness to new ideas |
| Conscientiousness | Organization, consistency, and follow-through |
| Extraversion | Social energy, assertiveness, and engagement |
| Agreeableness | Empathy, collaboration, and cooperativeness |
| Emotional Adjustment | Composure and resilience under pressure |

Participants select a value from 1 (strongly disagree) to 5 (strongly agree). Reverse-worded questions are inverted before aggregation. Each trait is normalized to a 0–100 score. Emotional Adjustment is the inverse of Neuroticism, so a higher score indicates stronger emotional steadiness.

The scoring implementation is in [src/scoring.ts](src/scoring.ts), and the question bank with reverse-score flags is in [src/questions.ts](src/questions.ts).

## Dashboard charts

The personal report uses multiple visual views so the user can understand the same result from different angles:

- **Radar chart:** the overall shape of the five-trait profile.
- **Bar chart:** direct comparison of trait scores and the person’s strongest/development traits.
- **Line chart:** changes between saved attempts; it becomes available after a retake.
- **Ring gauges:** a compact score and Low/Moderate/High label for every trait.

The admin dashboard includes:

- **Grouped comparison bars** for participant-to-participant comparison.
- **Histogram** for score distribution in a selected trait.
- **Scatter plot** to explore the relationship between two selected traits.
- **Area chart** for assessment completions over time.

All insights are derived from saved assessment responses—not a fixed score profile.

## Technology

- React 19 and TypeScript
- Vite
- Recharts for visual analytics
- Lucide React for icons
- Tailwind CSS import plus custom CSS design system
- Browser `localStorage` for prototype persistence

## Project structure

```text
src/
├── App.tsx                 # Navigation, authentication state, saved records
├── LandingPage.tsx         # Public product/marketing page
├── AssessmentFlow.tsx      # Four-screen, five-question assessment flow
├── ResultsDashboard.tsx    # Participant report, insights, and charts
├── AdminDashboard.tsx      # Admin analytics, comparison, and drill-in report
├── questions.ts            # Twenty statements and reverse-score settings
├── scoring.ts              # OCEAN score calculation and coaching content
└── index.css               # Design tokens, responsive layout, glass surfaces
```

## Run locally

Prerequisites: Node.js 20 or newer is recommended.

```bash
npm install
npm run dev
```

Vite will print a local URL, typically `http://127.0.0.1:5173` or the next available port.

Create a production build with:

```bash
npm run build
```

## Demo access

| Account type | Email | Password |
| --- | --- | --- |
| Administrator | `admin@mindmap.consulting` | `MindMap2026!` |
| Demo participant | `avery@example.com` | `demo` |
| Demo participant | `jordan@example.com` | `demo` |

The admin sign-in link is in the landing-page footer under **Consulting team sign in**.

## Persistence model

This prototype deliberately stores data in browser `localStorage` so it can run without a hosted service or database setup.

- Accounts are stored under `mindmap-members-v2`.
- Assessment attempts are stored under `mindmap-assessments-v2`.
- The active login session is stored under `mindmap-session-v2`.

Data persists through refreshes and sign-out/sign-in on the same browser. Clearing site data or browser storage resets the prototype to its seeded demo data on the next load.

## Production roadmap

For a production deployment, replace the browser-only storage and client-side credentials with a server-backed implementation:

1. Move to Next.js App Router (or add a dedicated API service).
2. Store `User` and `Assessment` records in PostgreSQL through Prisma.
3. Hash passwords and use secure server-managed sessions.
4. Enforce `USER` and `ADMIN` authorization at the server and route-middleware layer.
5. Add validation, rate limiting, audit logging, data-retention policies, and privacy controls.
6. Add automated tests for scoring, authentication, and protected routes.

## Important privacy note

Personality data can be sensitive. The current app is a demonstration, not a clinical or employment-selection instrument. Do not use it for hiring or high-stakes decisions without appropriate validation, consent, professional review, and privacy safeguards.

