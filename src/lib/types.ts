export interface PersonalityInput {
  mbtiType: string;
  enneagramType: string;
  insightsColor: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  attachmentStyle?: string;
  loveLanguage?: string;
  careerField?: string;
  relationshipStatus?: string;
  goals?: string[];
}

export interface PersonalityProfile {
  coreArchetype: string;
  archetypeDescription: string;
  strengths: string[];
  weaknesses: string[];
  relationshipTendencies: {
    attachmentTendency: string;
    communicationStyle: string;
    conflictPattern: string;
    emotionalNeeds: string;
    idealPartnerDynamics: string;
  };
  careerAlignment: {
    idealEnvironments: string[];
    leadershipStyle: string;
    burnoutTriggers: string[];
    motivationStyle: string;
    collaborationPreference: string;
  };
  compatibilityInsights: string[];
  growthRecommendations: string[];
  personalityGraph: Record<string, string>;
  explorationPrompts: string[];
}

export interface ExplorationMessage {
  role: "user" | "assistant";
  content: string;
}

export type OnboardingStep =
  | "personality"
  | "astrology"
  | "goals";
