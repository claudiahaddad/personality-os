import { PersonalityInput, PersonalityProfile } from "./types";

export function buildSynthesisPrompt(input: PersonalityInput): string {
  const data = [
    `MBTI: ${input.mbtiType}`,
    `Enneagram: ${input.enneagramType}`,
    `Insights Color: ${input.insightsColor}`,
    `Born: ${input.birthDate}`,
    input.birthTime && `Birth Time: ${input.birthTime}`,
    input.birthLocation && `Location: ${input.birthLocation}`,
    input.goals?.length && `Goals: ${input.goals.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `Synthesize this personality data into a unified profile. Derive their full astrological chart from the birth data — sun, moon, and rising signs at minimum, plus Mercury, Venus, Mars, Jupiter, and Saturn placements WITH house positions. If birth time is not provided, estimate rising sign and houses based on personality patterns and note it. Identify notable aspects (trines, squares, conjunctions, oppositions) and what they mean.

For the "deepDive" field, write 4-6 detailed interpretations that reference specific placements + houses and explain what they mean in plain language, like a real astrologer talking to a friend. Example style:
- "Aries Sun in the 11th + Gemini rising: bold initiator + fast-minded connector. You're built for networks, communities, and being the one who gets people moving."
- "Sag Moon in the 7th: relationships matter a lot, but you need honesty, room to breathe, and someone who feels like a partner-in-adventure."
- "10th house Venus (Pisces) + Mars (Aquarius): public-facing charm + original career drive. Often reads as creative + future-facing professionally."

Each deepDive item should combine placement + house + practical meaning. Reference the person's actual chart, not generic descriptions.

${data}

Return JSON:
{
  "coreArchetype": "2-4 word name",
  "archetypeDescription": "2-3 sentences weaving all frameworks including astrology",
  "strengths": ["5 items"],
  "weaknesses": ["5 growth edges"],
  "relationshipTendencies": {
    "attachmentTendency": "...",
    "communicationStyle": "...",
    "conflictPattern": "...",
    "emotionalNeeds": "...",
    "idealPartnerDynamics": "..."
  },
  "careerAlignment": {
    "idealEnvironments": ["3-4 items"],
    "leadershipStyle": "...",
    "burnoutTriggers": ["3 items"],
    "motivationStyle": "...",
    "collaborationPreference": "..."
  },
  "birthChart": {
    "sunSign": "sign + house + brief meaning",
    "moonSign": "sign + house + brief meaning",
    "risingSign": "sign + brief meaning",
    "placements": {"mercury": "sign in Xth house", "venus": "sign in Xth house", "mars": "sign in Xth house", "jupiter": "sign in Xth house", "saturn": "sign in Xth house"},
    "deepDive": ["4-6 detailed readings combining placement + house + practical interpretation, written like a friend who's also an astrologer"],
    "strengths": ["3-4 astrological strengths from the chart"],
    "challenges": ["3-4 astrological challenges from the chart"],
    "relationships": "How their chart shapes love and connection — reference specific Venus/Moon/7th house placements",
    "career": "How their chart shapes work and ambition — reference specific Mars/Saturn/10th house placements",
    "notableAspects": ["3-5 notable aspects like 'Sun trine Moon — emotional harmony with core identity', 'Venus square Mars — passionate but tension in love'"]
  },
  "compatibilityInsights": ["4 items"],
  "growthRecommendations": ["5 items"],
  "personalityGraph": {
    "emotional_processing": "...",
    "social_energy": "...",
    "conflict_style": "...",
    "validation_source": "...",
    "attachment_tendency": "...",
    "decision_making": "..."
  },
  "explorationPrompts": ["6 follow-up questions phrased as self-inquiry, at least 2 about astrology"]
}

Be specific, psychologically nuanced, and emotionally resonant. Weave astrology throughout — don't silo it. Make them feel seen. No markdown, only valid JSON.`;
}

export function buildExplorationPrompt(
  profile: PersonalityProfile,
  question: string,
  history: { role: string; content: string }[]
): string {
  const chart = profile.birthChart;
  const profileSummary = [
    `Archetype: ${profile.coreArchetype}`,
    `Description: ${profile.archetypeDescription}`,
    `Strengths: ${profile.strengths.join(", ")}`,
    `Growth edges: ${profile.weaknesses.join(", ")}`,
    chart && `Sun: ${chart.sunSign}, Moon: ${chart.moonSign}, Rising: ${chart.risingSign}`,
    chart?.deepDive?.length && `Chart deep dive: ${chart.deepDive.join(" | ")}`,
    chart?.notableAspects?.length && `Key aspects: ${chart.notableAspects.join("; ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const recentHistory = history.slice(-6);
  const historyText = recentHistory.length
    ? recentHistory
        .map((m) => `${m.role === "user" ? "User" : "OS"}: ${m.content}`)
        .join("\n")
    : "";

  return `User profile:
${profileSummary}

${historyText ? `Recent conversation:\n${historyText}\n` : ""}Question: "${question}"

Keep it short — 2-3 casual paragraphs max, like you're chatting with a friend. Be specific to their personality types and astrological placements but keep the language light, warm, and a little funny. Hype them up where it's genuine. Skip the therapy-speak. End with 2-3 follow-up questions they'd actually want to click on (prefix each with "→").`;
}
