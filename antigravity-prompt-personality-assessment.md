# Build Prompt for Antigravity

Paste everything below into Antigravity as your project brief.

---

## Project

Build a full website for **"MindMap Consulting"** (rename freely) — a boutique Industrial Psychology consultancy that offers a paid, personalized Big Five (OCEAN) Personality & Emotional Intelligence assessment to employees and clients. This is not a quiz app — it's a premium self-discovery service. Every screen should feel like a paid consulting product: warm, credible, visually polished, never like a school test.

Three destinations, one flow:
1. **Landing Page** — sells the value, builds trust, drives people to start.
2. **Assessment Flow** — collects responses through an engaging, low-friction experience.
3. **Results Dashboard** — turns raw answers into a personalized, shareable report.

Use React + Tailwind. Store answers in state/local memory during the session (no backend required unless you want to add one). Charts via Recharts (radar + bar). Smooth transitions between steps.

---

## 1. Landing Page

Goal: in 10 seconds, a visitor should understand **what they get, why it matters, and what to do next.**

**Hero section**
- Headline that promises a transformation, not a test — e.g. "Understand yourself the way top companies understand their best people."
- Subheadline: one sentence on what the assessment reveals (traits, leadership potential, career fit, communication style, stress patterns).
- One clear CTA button: "Start My Assessment — 10 minutes."
- Trust strip: "Used by professionals across industries" / "Backed by the Big Five (OCEAN) model — the gold standard in psychological research."

**"What You'll Get" section** (this is the section that sells it — make it a set of 4–6 icon cards, not a bullet list):
- A personalized Overall Personality Profile
- Your Leadership Potential score
- Your natural Communication Style
- Your Decision-Making pattern
- Career paths that suit your traits
- A Stress & Coping breakdown
- A downloadable/shareable Summary Report with 3–5 action steps

**"How It Helps You" section** — three short outcome-driven blocks:
- *Know yourself* — see your strengths and blind spots in plain language, not jargon.
- *Grow with intention* — get specific, personalized recommendations, not generic advice.
- *Perform better at work* — understand how you lead, communicate, and handle pressure so you can play to your strengths.

**"What You Should Do" section** — a simple 3-step path so the visitor knows exactly what happens next:
1. Answer 20 short reflective questions (about 8–10 minutes).
2. Get your instant OCEAN profile and dashboard.
3. Walk away with a personalized action plan.

**Benefits/why-it-matters strip** — short trust-building stats or quotes (can be illustrative), e.g. "Self-aware professionals are more likely to be seen as effective leaders" — keep tone confident but not overhyped.

**Footer CTA** — repeat the "Start My Assessment" button.

Visual direction: calm, professional palette (deep teal/navy + a warm accent like amber or coral), generous white space, soft shadows, rounded cards, subtle scroll animations. Avoid clip-art; use clean icon sets (Lucide) and abstract geometric shapes instead of stock photos.

---

## 2. Assessment Flow

Do **not** present this as a flat list of 20 questions on one page. Instead:

- One question per screen (or 2–3 grouped per screen max), with a progress bar ("Question 6 of 20") and a calm transition animation between questions.
- Answers on a 5-point scale (Strongly Disagree → Strongly Agree), shown as large tappable pills or a slider — not a dry radio-button table.
- Light, encouraging micro-copy between sections (e.g. after question 10: "You're halfway there — your profile is already taking shape.")
- Never show "Big Five" trait labels during the quiz itself — keep it feeling like a reflective conversation, not a labeled exam.
- Use these 20 statements, scored 1 (Strongly Disagree) to 5 (Strongly Agree), grouped internally by trait as below. Mark reverse-scored items and invert them (6 − score) before aggregating:

**Openness**
1. I enjoy exploring new ideas and unconventional approaches to problems.
2. I have a strong interest in art, music, or other creative activities.
3. I prefer familiar routines over trying new experiences. *(reverse-scored)*
4. I like thinking about abstract concepts and theories.

**Conscientiousness**
5. I complete tasks thoroughly and pay close attention to detail.
6. I plan ahead and organize my work before starting.
7. I often leave tasks unfinished or postpone them until the last moment. *(reverse-scored)*
8. I keep my commitments and follow through on responsibilities.

**Extraversion (Surgency)**
9. I feel energized when I am around other people.
10. I enjoy being the centre of attention in social settings.
11. I prefer spending time alone rather than in groups. *(reverse-scored)*
12. I find it easy to start conversations with new people.

**Agreeableness**
13. I try to be considerate and cooperative with others.
14. I trust that most people have good intentions.
15. I often argue or compete with others rather than cooperate. *(reverse-scored)*
16. I enjoy helping others solve their problems.

**Neuroticism / Emotional Adjustment** *(higher raw score = lower emotional stability — invert this whole trait when converting to an "Adjustment" score for display)*
17. I often feel anxious or worried about things.
18. My mood changes quickly and unpredictably.
19. I remain calm and composed even under pressure. *(reverse-scored relative to the other 3 in this group)*
20. I get stressed easily by minor setbacks.

Compute each trait as an average (1–5) or normalize to 0–100 for the dashboard.

---

## 3. Results Dashboard

This is the centerpiece — make it feel like a report a consultant would charge for, not a score screen.

**Top summary card**
- A headline personality type summary in plain language (e.g. "The Steady Collaborator" — auto-generate a short type name from the two highest traits).
- A radar chart of all 5 OCEAN dimensions (Openness, Conscientiousness, Extraversion, Agreeableness, Adjustment).

**Trait breakdown cards** — one card per dimension, each with:
- Score bar (0–100) with a plain-language level (Low / Moderate / High)
- 1–2 sentence interpretation in second person ("You tend to...")

**Insight sections** (map directly to the rubric — include all of these, each 2–4 sentences, generated from the trait scores):
- Overall Personality Profile
- Major Strengths
- Leadership Potential
- Communication Style
- Decision-Making Style
- Career Suitability (suggest 3–5 roles/fields that fit the profile)
- Learning Style
- Stress & Coping Tendencies
- Motivational Drivers

**Summary & Action Plan section**
- 3–5 personalized, specific, achievable recommendations generated from the person's lowest/highest traits — never generic filler advice.

**Closing panel**
- "Download / Share Your Report" button (export as PDF or image)
- A warm closing line reinforcing the value: "This is a starting point, not a label — use it to grow."

Visual direction: same palette as the landing page for continuity. Use color-coded trait cards, subtle icons per trait, and a clean "certificate-style" layout for the top summary so it feels shareable and premium.

---

## Tone rules for all generated copy

- Speak directly to the person ("you"), never clinical or robotic.
- No jargon dumps — explain OCEAN terms in plain language the first time they appear.
- Never present results as fixed/limiting — always frame in growth-oriented language.
- Keep the whole experience feeling like a warm, professional consulting service, not a personality "test."
