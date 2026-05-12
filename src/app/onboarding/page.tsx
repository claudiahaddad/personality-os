"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import {
  MBTI_TYPES,
  ENNEAGRAM_TYPES,
  INSIGHTS_COLORS,
  ATTACHMENT_STYLES,
  LOVE_LANGUAGES,
  GOAL_OPTIONS,
} from "@/lib/personality-data";
import type { PersonalityInput, OnboardingStep } from "@/lib/types";

const STEPS: OnboardingStep[] = ["personality", "astrology", "optional", "goals"];
const STEP_LABELS = ["Frameworks", "Astrology", "Optional", "Goals"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<PersonalityInput>({
    mbtiType: "",
    enneagramType: "",
    insightsColor: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    attachmentStyle: "",
    loveLanguage: "",
    careerField: "",
    relationshipStatus: "",
    goals: [],
  });

  const updateField = <K extends keyof PersonalityInput>(
    field: K,
    value: PersonalityInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 0) return input.mbtiType && input.enneagramType && input.insightsColor;
    if (step === 1) return input.birthDate;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) throw new Error("Synthesis failed");

      const profile = await res.json();
      sessionStorage.setItem("pos_profile", JSON.stringify(profile));
      sessionStorage.setItem("pos_input", JSON.stringify(input));
      router.push("/profile");
    } catch {
      setLoading(false);
      alert("Something went wrong generating your profile. Please ensure an OpenAI API key is configured.");
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-600/[0.05] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-purple-600/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <StepIndicator steps={STEP_LABELS} currentStep={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[step]}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <StepPersonality input={input} updateField={updateField} />
            )}
            {step === 1 && (
              <StepAstrology input={input} updateField={updateField} />
            )}
            {step === 2 && (
              <StepOptional input={input} updateField={updateField} />
            )}
            {step === 3 && (
              <StepGoals input={input} updateField={updateField} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-5 py-2.5 text-sm text-white/30 hover:text-white/60 transition-colors disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed() || loading}
            className="px-8 py-2.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-sm font-medium border border-indigo-500/20 hover:border-indigo-500/30 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full"
                />
                Synthesizing...
              </span>
            ) : step === STEPS.length - 1 ? (
              "Generate my profile"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

interface StepProps {
  input: PersonalityInput;
  updateField: <K extends keyof PersonalityInput>(
    field: K,
    value: PersonalityInput[K]
  ) => void;
}

function StepPersonality({ input, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your personality frameworks
        </h2>
        <p className="text-white/30 text-sm">
          The core systems that shape how you think, feel, and relate.
        </p>
      </div>

      {/* MBTI */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Myers-Briggs Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {MBTI_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updateField("mbtiType", type)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                input.mbtiType === type
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                  : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Enneagram */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Enneagram Type
        </label>
        <select
          value={input.enneagramType}
          onChange={(e) => updateField("enneagramType", e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm appearance-none cursor-pointer focus:outline-none focus:border-indigo-500/30"
        >
          <option value="" className="bg-[#0f0a2e]">
            Select your type...
          </option>
          {ENNEAGRAM_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#0f0a2e]">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Insights */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Insights Discovery Color
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INSIGHTS_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => updateField("insightsColor", c.value)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                input.insightsColor === c.value
                  ? "bg-white/[0.08] border border-white/[0.12]"
                  : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05]"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <div className="text-left">
                <div className="text-sm text-white/70">{c.label}</div>
                <div className="text-[10px] text-white/30">{c.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepAstrology({ input, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your astrological data
        </h2>
        <p className="text-white/30 text-sm">
          Birth details help us map emotional and archetypal tendencies.
        </p>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Birth Date
        </label>
        <input
          type="date"
          value={input.birthDate}
          onChange={(e) => updateField("birthDate", e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm focus:outline-none focus:border-indigo-500/30"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Birth Time <span className="normal-case tracking-normal text-white/20">(optional)</span>
        </label>
        <input
          type="time"
          value={input.birthTime}
          onChange={(e) => updateField("birthTime", e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm focus:outline-none focus:border-indigo-500/30"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Birth Location <span className="normal-case tracking-normal text-white/20">(optional)</span>
        </label>
        <input
          type="text"
          value={input.birthLocation}
          onChange={(e) => updateField("birthLocation", e.target.value)}
          placeholder="City, State/Country"
          className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-indigo-500/30"
        />
      </div>
    </div>
  );
}

function StepOptional({ input, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Deepen your profile
        </h2>
        <p className="text-white/30 text-sm">
          These are optional — but they unlock richer, more specific insights.
        </p>
      </div>

      {/* Attachment Style */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Attachment Style
        </label>
        <div className="grid grid-cols-1 gap-2">
          {ATTACHMENT_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateField("attachmentStyle", s.value)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                input.attachmentStyle === s.value
                  ? "bg-white/[0.08] border border-white/[0.12]"
                  : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05]"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  input.attachmentStyle === s.value
                    ? "bg-indigo-400"
                    : "bg-white/10"
                }`}
              />
              <div>
                <div className="text-sm text-white/70">{s.label}</div>
                <div className="text-[10px] text-white/30">{s.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Love Language */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
          Love Language
        </label>
        <div className="flex flex-wrap gap-2">
          {LOVE_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => updateField("loveLanguage", lang)}
              className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer ${
                input.loveLanguage === lang
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                  : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Career + Relationship */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
            Career Field
          </label>
          <input
            type="text"
            value={input.careerField}
            onChange={(e) => updateField("careerField", e.target.value)}
            placeholder="e.g. Tech, Finance"
            className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-indigo-500/30"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 block">
            Relationship Status
          </label>
          <select
            value={input.relationshipStatus}
            onChange={(e) => updateField("relationshipStatus", e.target.value)}
            className="w-full py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm appearance-none cursor-pointer focus:outline-none focus:border-indigo-500/30"
          >
            <option value="" className="bg-[#0f0a2e]">Select...</option>
            <option value="single" className="bg-[#0f0a2e]">Single</option>
            <option value="dating" className="bg-[#0f0a2e]">Dating</option>
            <option value="relationship" className="bg-[#0f0a2e]">In a relationship</option>
            <option value="married" className="bg-[#0f0a2e]">Married</option>
            <option value="complicated" className="bg-[#0f0a2e]">It&apos;s complicated</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function StepGoals({ input, updateField }: StepProps) {
  const goals = input.goals ?? [];

  const toggleGoal = (goal: string) => {
    updateField(
      "goals",
      goals.includes(goal)
        ? goals.filter((g) => g !== goal)
        : [...goals, goal]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          What are you seeking?
        </h2>
        <p className="text-white/30 text-sm">
          Select what you want to understand better. Choose as many as you like.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {GOAL_OPTIONS.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all cursor-pointer ${
              goals.includes(goal)
                ? "bg-indigo-500/10 border border-indigo-500/20"
                : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                goals.includes(goal)
                  ? "bg-indigo-500/30 border-indigo-500/40"
                  : "border-white/10"
              }`}
            >
              {goals.includes(goal) && (
                <svg
                  className="w-3 h-3 text-indigo-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-white/60">{goal}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
