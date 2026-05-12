# Personality OS

> An infinitely explorable map of yourself.

Personality OS synthesizes multiple personality frameworks — **Myers-Briggs**, **Enneagram**, **Insights Discovery**, and **Astrology** — into one unified, emotionally intelligent profile that helps you understand yourself, your relationships, your career, and your growth.

## Features

- **Multi-step onboarding** — Input your personality types across MBTI, Enneagram, Insights Discovery, birth details, attachment style, love language, and personal goals
- **AI-powered personality synthesis** — GPT-4o weaves together all frameworks into a coherent personality narrative
- **Comprehensive profile** — Core archetype, strengths, growth edges, personality graph, relationship tendencies, career alignment, and growth recommendations
- **Dynamic exploration** — Conversational AI follow-up that lets you drill deeper into any aspect of your personality
- **Shareable insight cards** — Share your archetype with friends
- **Cinematic design** — Dark, intimate UI with smooth Framer Motion animations

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **OpenAI GPT-4o**

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for personality synthesis and exploration |

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    onboarding/page.tsx   # Multi-step personality input form
    profile/page.tsx      # Generated personality profile display
    explore/page.tsx      # Conversational exploration
    api/
      synthesize/route.ts # Personality synthesis endpoint
      explore/route.ts    # Follow-up exploration endpoint
  components/
    AnimatedSection.tsx   # Fade-in animation wrapper
    InsightCard.tsx       # Gradient insight display card
    ShareableCard.tsx     # Shareable archetype card
    StepIndicator.tsx     # Onboarding progress indicator
  lib/
    types.ts              # TypeScript interfaces
    personality-data.ts   # MBTI, Enneagram, Insights data
    prompts.ts            # OpenAI prompt templates
```
