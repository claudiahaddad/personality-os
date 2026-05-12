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

  return `Synthesize this personality data into a unified profile.

${data}

Return JSON:
{
  "coreArchetype": "2-4 word name",
  "archetypeDescription": "2-3 sentences weaving all frameworks",
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
  "explorationPrompts": ["6 follow-up questions phrased as self-inquiry"]
}

Be specific, psychologically nuanced, and emotionally resonant. Make them feel seen. No markdown, only valid JSON.`;
}

export function buildExplorationPrompt(
  profile: PersonalityProfile,
  question: string,
  history: { role: string; content: string }[]
): string {
  const profileSummary = [
    `Archetype: ${profile.coreArchetype}`,
    `Description: ${profile.archetypeDescription}`,
    `Strengths: ${profile.strengths.join(", ")}`,
    `Growth edges: ${profile.weaknesses.join(", ")}`,
  ].join("\n");

  const recentHistory = history.slice(-6);
  const historyText = recentHistory.length
    ? recentHistory
        .map((m) => `${m.role === "user" ? "User" : "OS"}: ${m.content}`)
        .join("\n")
    : "";

  return `User profile:
${profileSummary}

${historyText ? `Recent conversation:\n${historyText}\n` : ""}Question: "${question}"

Respond in 2-4 paragraphs of flowing prose. Be psychologically nuanced, specific to their type combinations, and emotionally resonant. End with 2-3 follow-up questions (prefix each with "→"). No bullet points.`;
}
