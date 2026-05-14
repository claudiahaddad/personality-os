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
  birthChart: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    placements: Record<string, string>;
    strengths: string[];
    challenges: string[];
    relationships: string;
    career: string;
    notableAspects: string[];
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
  | "astrology"
  | "mbti"
  | "extras"
  | "goals";
