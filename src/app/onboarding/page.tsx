"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import {
  MBTI_TYPES,
  ENNEAGRAM_TYPES,
  INSIGHTS_COLORS,
  GOAL_OPTIONS,
} from "@/lib/personality-data";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import type { PersonalityInput, OnboardingStep } from "@/lib/types";

const STEPS: OnboardingStep[] = ["astrology", "mbti", "extras", "goals"];
const STEP_LABELS = ["Birthday", "MBTI", "More Frameworks", "Goals"];

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
    goals: [],
  });

  const updateField = <K extends keyof PersonalityInput>(
    field: K,
    value: PersonalityInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 0) return input.birthDate && input.birthLocation;
    if (step === 1) return input.mbtiType;
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
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-purple-200/20 rounded-full blur-[80px]" />
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
              <StepAstrology input={input} updateField={updateField} />
            )}
            {step === 1 && (
              <StepMBTI input={input} updateField={updateField} />
            )}
            {step === 2 && (
              <StepExtras input={input} updateField={updateField} />
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
            className="px-5 py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed() || loading}
            className="px-8 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-md shadow-indigo-500/20 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
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

function StepAstrology({ input, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          When were you born?
        </h2>
        <p className="text-gray-400 text-sm">
          Your birth details unlock your full astrological chart.
        </p>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">
          Birth Date
        </label>
        <input
          type="date"
          value={input.birthDate}
          onChange={(e) => updateField("birthDate", e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">
          Birth Time <span className="normal-case tracking-normal text-gray-300">(optional — helps determine rising sign)</span>
        </label>
        <input
          type="time"
          value={input.birthTime}
          onChange={(e) => updateField("birthTime", e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">
          Birth Location
        </label>
        <LocationAutocomplete
          value={input.birthLocation}
          onChange={(val) => updateField("birthLocation", val)}
          className="w-full py-3 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
        />
      </div>
    </div>
  );
}

function StepMBTI({ input, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          What&apos;s your Myers-Briggs type?
        </h2>
        <p className="text-gray-400 text-sm">
          Your MBTI type reveals how you perceive the world and make decisions.
        </p>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">
          Myers-Briggs Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {MBTI_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updateField("mbtiType", type)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                input.mbtiType === type
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepExtras({ input, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-light mb-1 tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Know your Enneagram or Insights color?
        </h2>
        <p className="text-gray-400 text-sm">
          These are optional — add them if you know them for a richer profile.
        </p>
      </div>

      {/* Enneagram */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">
          Enneagram Type <span className="normal-case tracking-normal text-gray-300">(optional)</span>
        </label>
        <select
          value={input.enneagramType}
          onChange={(e) => updateField("enneagramType", e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
        >
          <option value="">Select your type...</option>
          {ENNEAGRAM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Insights */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">
          Insights Discovery Color <span className="normal-case tracking-normal text-gray-300">(optional)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INSIGHTS_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() =>
                updateField(
                  "insightsColor",
                  input.insightsColor === c.value ? "" : c.value
                )
              }
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                input.insightsColor === c.value
                  ? "bg-indigo-50 border border-indigo-200"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <div className="text-left">
                <div className="text-sm text-gray-700">{c.label}</div>
                <div className="text-[10px] text-gray-400">{c.description}</div>
              </div>
            </button>
          ))}
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
          className="text-2xl font-light mb-1 tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          What are you seeking?
        </h2>
        <p className="text-gray-400 text-sm">
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
                ? "bg-indigo-50 border border-indigo-200"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                goals.includes(goal)
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-gray-300"
              }`}
            >
              {goals.includes(goal) && (
                <svg
                  className="w-3 h-3 text-white"
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
            <span className="text-sm text-gray-600">{goal}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
