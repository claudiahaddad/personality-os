"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import InsightCard from "@/components/InsightCard";
import ShareableCard from "@/components/ShareableCard";
import type { PersonalityProfile, PersonalityInput } from "@/lib/types";

const emptySubscribe = () => () => {};

function useSessionData() {
  const profile = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("pos_profile"),
    () => null
  );
  const input = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("pos_input"),
    () => null
  );
  return {
    profile: profile ? (JSON.parse(profile) as PersonalityProfile) : null,
    input: input ? (JSON.parse(input) as PersonalityInput) : null,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, input } = useSessionData();
  const [activeTab, setActiveTab] = useState<"overview" | "birth-chart" | "relationships" | "career" | "growth">("overview");
  const redirected = useRef(false);

  useEffect(() => {
    if (!profile && !redirected.current) {
      redirected.current = true;
      router.push("/onboarding");
    }
  }, [profile, router]);

  if (!profile || !input) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "birth-chart" as const, label: "Birth Chart" },
    { id: "relationships" as const, label: "Relationships" },
    { id: "career" as const, label: "Career" },
    { id: "growth" as const, label: "Growth" },
  ];

  return (
    <main className="relative min-h-screen pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/40 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16">
        {/* Header */}
        <AnimatedSection>
          <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-500/60 mb-2">
            Your Personality OS Profile
          </p>
          <h1
            className="text-4xl md:text-5xl font-light tracking-tight mb-3 text-gray-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {profile.coreArchetype}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-4 max-w-lg">
            {profile.archetypeDescription}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            {input.mbtiType && (
              <span className="px-2 py-1 rounded bg-gray-100">
                {input.mbtiType}
              </span>
            )}
            {input.enneagramType && (
              <span className="px-2 py-1 rounded bg-gray-100">
                Enneagram {input.enneagramType}
              </span>
            )}
            {input.insightsColor && (
              <span className="px-2 py-1 rounded bg-gray-100 capitalize">
                {input.insightsColor.replace("-", " ")}
              </span>
            )}
            {profile.birthChart && (
              <span className="px-2 py-1 rounded bg-gray-100">
                {profile.birthChart.sunSign.split(" ")[0]}
              </span>
            )}
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={0.2} className="mt-12 mb-8">
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Strengths & Weaknesses */}
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-600 mb-4">
                    Strengths
                  </h3>
                  <ul className="space-y-2.5">
                    {profile.strengths.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-amber-600 mb-4">
                    Growth Edges
                  </h3>
                  <ul className="space-y-2.5">
                    {profile.weaknesses.map((w, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-amber-500 mt-0.5">~</span>
                        {w}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* Personality Graph */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-600 mb-5">
                  Personality Graph
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(profile.personalityGraph).map(
                    ([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        className="p-3 rounded-xl bg-gray-50"
                      >
                        <div className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">
                          {key.replace(/_/g, " ")}
                        </div>
                        <div className="text-sm text-gray-700">{value}</div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Shareable Card */}
            <AnimatedSection delay={0.3}>
              <ShareableCard
                archetype={profile.coreArchetype}
                description={profile.archetypeDescription}
                traits={profile.strengths}
                mbtiType={input.mbtiType}
                enneagramType={input.enneagramType}
              />
            </AnimatedSection>
          </div>
        )}

        {activeTab === "birth-chart" && profile.birthChart && (
          <div className="space-y-6">
            {/* Big Three */}
            <AnimatedSection delay={0.05}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sun", value: profile.birthChart.sunSign, emoji: "☀️" },
                  { label: "Moon", value: profile.birthChart.moonSign, emoji: "🌙" },
                  { label: "Rising", value: profile.birthChart.risingSign, emoji: "⬆️" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-center"
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-700 font-medium">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Deep Dive — House-Based Readings */}
            {profile.birthChart.deepDive && profile.birthChart.deepDive.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-600 mb-5">
                    Your Chart, Decoded
                  </h3>
                  <div className="space-y-4">
                    {profile.birthChart.deepDive.map((reading, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        className="rounded-xl bg-white p-4 border border-indigo-100 shadow-sm"
                      >
                        <p className="text-sm text-gray-700 leading-relaxed">{reading}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Chart Strengths & Challenges */}
            <AnimatedSection delay={0.35}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-600 mb-4">
                    Chart Strengths
                  </h3>
                  <ul className="space-y-2.5">
                    {profile.birthChart.strengths.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-amber-600 mb-4">
                    Chart Challenges
                  </h3>
                  <ul className="space-y-2.5">
                    {profile.birthChart.challenges.map((c, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-amber-500 mt-0.5">~</span>
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* Relationships & Career from Chart */}
            <InsightCard
              title="Love & Relationships"
              content={profile.birthChart.relationships}
              gradient="from-rose-50 to-pink-50"
              delay={0.45}
            />
            <InsightCard
              title="Career & Ambition"
              content={profile.birthChart.career}
              gradient="from-blue-50 to-indigo-50"
              delay={0.5}
            />

            {/* Notable Aspects */}
            <AnimatedSection delay={0.55}>
              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-purple-600 mb-4">
                  Notable Aspects
                </h3>
                <ul className="space-y-3">
                  {profile.birthChart.notableAspects.map((aspect, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.06 }}
                      className="text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-purple-300"
                    >
                      {aspect}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        )}

        {activeTab === "relationships" && (
          <div className="space-y-4">
            <InsightCard
              title="Attachment Tendency"
              content={profile.relationshipTendencies.attachmentTendency}
              gradient="from-rose-50 to-pink-50"
              delay={0.05}
            />
            <InsightCard
              title="Communication Style"
              content={profile.relationshipTendencies.communicationStyle}
              gradient="from-violet-50 to-indigo-50"
              delay={0.1}
            />
            <InsightCard
              title="Conflict Patterns"
              content={profile.relationshipTendencies.conflictPattern}
              gradient="from-amber-50 to-orange-50"
              delay={0.15}
            />
            <InsightCard
              title="Emotional Needs"
              content={profile.relationshipTendencies.emotionalNeeds}
              gradient="from-cyan-50 to-teal-50"
              delay={0.2}
            />
            <InsightCard
              title="Ideal Partner Dynamics"
              content={profile.relationshipTendencies.idealPartnerDynamics}
              gradient="from-pink-50 to-rose-50"
              delay={0.25}
            />

            <AnimatedSection delay={0.3}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-600 mb-4">
                  Compatibility Insights
                </h3>
                <ul className="space-y-3">
                  {profile.compatibilityInsights.map((insight, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-500 leading-relaxed pl-4 border-l-2 border-indigo-200"
                    >
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        )}

        {activeTab === "career" && (
          <div className="space-y-4">
            <InsightCard
              title="Leadership Style"
              content={profile.careerAlignment.leadershipStyle}
              gradient="from-blue-50 to-indigo-50"
              delay={0.05}
            />
            <InsightCard
              title="Motivation Style"
              content={profile.careerAlignment.motivationStyle}
              gradient="from-emerald-50 to-teal-50"
              delay={0.1}
            />
            <InsightCard
              title="Collaboration Preference"
              content={profile.careerAlignment.collaborationPreference}
              gradient="from-violet-50 to-purple-50"
              delay={0.15}
            />

            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-600 mb-4">
                  Ideal Environments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.careerAlignment.idealEnvironments.map((env, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-amber-600 mb-4">
                  Burnout Triggers
                </h3>
                <ul className="space-y-2">
                  {profile.careerAlignment.burnoutTriggers.map((trigger, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-500"
                    >
                      <span className="text-amber-500 mt-0.5">!</span>
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        )}

        {activeTab === "growth" && (
          <div className="space-y-4">
            <AnimatedSection>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-600 mb-5">
                  Growth Recommendations
                </h3>
                <ul className="space-y-4">
                  {profile.growthRecommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
                    >
                      <span className="text-indigo-400 font-mono text-xs mt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Exploration Prompts */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-600 mb-4">
                  Go Deeper
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Explore these questions to understand yourself more deeply.
                </p>
                <div className="space-y-2">
                  {profile.explorationPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        sessionStorage.setItem("pos_explore_question", prompt);
                        router.push("/explore");
                      }}
                      className="w-full text-left p-3 rounded-xl bg-white hover:bg-indigo-50 text-sm text-gray-600 hover:text-gray-800 transition-all border border-gray-200 hover:border-indigo-200 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}

        {/* Explore CTA */}
        <AnimatedSection delay={0.4} className="mt-12 text-center">
          <button
            onClick={() => router.push("/explore")}
            className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            Explore your personality deeper →
          </button>
        </AnimatedSection>
      </div>
    </main>
  );
}
