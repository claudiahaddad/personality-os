export const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export const ENNEAGRAM_TYPES = [
  { value: "1", label: "Type 1 — The Reformer" },
  { value: "1w2", label: "Type 1w2 — The Advocate" },
  { value: "1w9", label: "Type 1w9 — The Idealist" },
  { value: "2", label: "Type 2 — The Helper" },
  { value: "2w1", label: "Type 2w1 — The Servant" },
  { value: "2w3", label: "Type 2w3 — The Host" },
  { value: "3", label: "Type 3 — The Achiever" },
  { value: "3w2", label: "Type 3w2 — The Charmer" },
  { value: "3w4", label: "Type 3w4 — The Professional" },
  { value: "4", label: "Type 4 — The Individualist" },
  { value: "4w3", label: "Type 4w3 — The Aristocrat" },
  { value: "4w5", label: "Type 4w5 — The Bohemian" },
  { value: "5", label: "Type 5 — The Investigator" },
  { value: "5w4", label: "Type 5w4 — The Iconoclast" },
  { value: "5w6", label: "Type 5w6 — The Problem Solver" },
  { value: "6", label: "Type 6 — The Loyalist" },
  { value: "6w5", label: "Type 6w5 — The Defender" },
  { value: "6w7", label: "Type 6w7 — The Buddy" },
  { value: "7", label: "Type 7 — The Enthusiast" },
  { value: "7w6", label: "Type 7w6 — The Entertainer" },
  { value: "7w8", label: "Type 7w8 — The Realist" },
  { value: "8", label: "Type 8 — The Challenger" },
  { value: "8w7", label: "Type 8w7 — The Maverick" },
  { value: "8w9", label: "Type 8w9 — The Bear" },
  { value: "9", label: "Type 9 — The Peacemaker" },
  { value: "9w1", label: "Type 9w1 — The Dreamer" },
  { value: "9w8", label: "Type 9w8 — The Referee" },
] as const;

export const INSIGHTS_COLORS = [
  { value: "fiery-red", label: "Fiery Red", color: "#DC2626", description: "Competitive, demanding, determined, strong-willed" },
  { value: "sunshine-yellow", label: "Sunshine Yellow", color: "#EAB308", description: "Sociable, dynamic, demonstrative, enthusiastic" },
  { value: "earth-green", label: "Earth Green", color: "#16A34A", description: "Caring, patient, relaxed, encouraging" },
  { value: "cool-blue", label: "Cool Blue", color: "#2563EB", description: "Cautious, precise, deliberate, formal" },
] as const;

export const ATTACHMENT_STYLES = [
  { value: "secure", label: "Secure", description: "Comfortable with intimacy and independence" },
  { value: "anxious", label: "Anxious-Preoccupied", description: "Seeks closeness, fears abandonment" },
  { value: "avoidant", label: "Dismissive-Avoidant", description: "Values independence, uncomfortable with closeness" },
  { value: "fearful", label: "Fearful-Avoidant", description: "Desires closeness but fears vulnerability" },
] as const;

export const LOVE_LANGUAGES = [
  "Words of Affirmation",
  "Quality Time",
  "Physical Touch",
  "Acts of Service",
  "Receiving Gifts",
] as const;

export const GOAL_OPTIONS = [
  "Dating & Relationships",
  "Career Clarity",
  "Self-Confidence",
  "Emotional Growth",
  "Better Communication",
  "Work-Life Balance",
  "Leadership Development",
  "Creative Expression",
  "Deeper Self-Understanding",
] as const;
