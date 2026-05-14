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

  return `Synthesize this personality data into a unified profile. Derive their full astrological chart from the birth data — sun, moon, and rising signs at minimum, plus Mercury, Venus, Mars, Jupiter, and Saturn placements. If birth time is not provided, estimate rising sign based on personality patterns and note it. Identify notable aspects (trines, squares, conjunctions, oppositions) and what they mean.

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
    "sunSign": "sign + brief meaning",
    "moonSign": "sign + brief meaning",
    "risingSign": "sign + brief meaning",
    "placements": {"mercury": "sign", "venus": "sign", "mars": "sign", "jupiter": "sign", "saturn": "sign"},
    "strengths": ["3-4 astrological strengths from the chart"],
    "challenges": ["3-4 astrological challenges from the chart"],
    "relationships": "How their chart shapes love and connection",
    "career": "How their chart shapes work and ambition",
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
