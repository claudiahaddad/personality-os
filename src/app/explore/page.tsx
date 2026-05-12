"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { PersonalityProfile, ExplorationMessage } from "@/lib/types";

const emptySubscribe = () => () => {};

export default function ExplorePage() {
  const router = useRouter();
  const storedProfile = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("pos_profile"),
    () => null
  );
  const profile = storedProfile
    ? (JSON.parse(storedProfile) as PersonalityProfile)
    : null;

  const [messages, setMessages] = useState<ExplorationMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const redirected = useRef(false);
  const initialQuestionHandled = useRef(false);

  const sendQuestion = useCallback(
    async (
      question: string,
      currentProfile: PersonalityProfile,
      currentMessages: ExplorationMessage[]
    ) => {
      const userMsg: ExplorationMessage = { role: "user", content: question };
      const updatedMessages = [...currentMessages, userMsg];
      setMessages(updatedMessages);
      setInputValue("");
      setLoading(true);

      try {
        const res = await fetch("/api/explore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: currentProfile,
            question,
            history: updatedMessages,
          }),
        });

        if (!res.ok) throw new Error("Exploration failed");

        const { content } = await res.json();
        setMessages([...updatedMessages, { role: "assistant", content }]);
      } catch {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              "I wasn't able to generate a response right now. Please ensure the OpenAI API key is configured and try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!profile && !redirected.current) {
      redirected.current = true;
      router.push("/onboarding");
      return;
    }

    if (profile && !initialQuestionHandled.current) {
      initialQuestionHandled.current = true;
      const initialQuestion = sessionStorage.getItem("pos_explore_question");
      if (initialQuestion) {
        sessionStorage.removeItem("pos_explore_question");
        const p = profile;
        setTimeout(() => sendQuestion(initialQuestion, p, []), 0);
      }
    }
  }, [profile, router, sendQuestion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !profile || loading) return;
    sendQuestion(inputValue.trim(), profile, messages);
  };

  const extractFollowUps = (content: string): string[] => {
    return content
      .split("\n")
      .filter((line) => line.trim().startsWith("→"))
      .map((line) => line.replace(/^→\s*/, "").trim());
  };

  if (!profile) {
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

  return (
    <main className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-100/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-medium text-gray-800">
              Explore Your Personality
            </h1>
            <p className="text-[10px] text-gray-400">
              Ask anything about yourself — powered by your personality synthesis
            </p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            ← Back to profile
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <h2
                className="text-2xl font-light text-gray-700 mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                What would you like to explore?
              </h2>
              <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
                Ask anything about your personality, relationships, career, or
                inner patterns.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                {profile.explorationPrompts.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuestion(prompt, profile, messages)}
                    className="text-left p-3 rounded-xl bg-white hover:bg-indigo-50 text-xs text-gray-500 hover:text-gray-700 transition-all border border-gray-200 hover:border-indigo-200 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`${msg.role === "user" ? "ml-auto max-w-md" : ""}`}
              >
                {msg.role === "user" ? (
                  <div className="px-5 py-3 rounded-2xl rounded-br-sm bg-indigo-600 text-white text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 leading-[1.8] whitespace-pre-wrap">
                      {msg.content
                        .split("\n")
                        .filter((line) => !line.trim().startsWith("→"))
                        .join("\n")
                        .trim()}
                    </div>
                    {extractFollowUps(msg.content).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {extractFollowUps(msg.content).map((followUp, j) => (
                          <button
                            key={j}
                            onClick={() =>
                              sendQuestion(followUp, profile, messages)
                            }
                            disabled={loading}
                            className="text-left px-3 py-2 rounded-lg bg-white hover:bg-indigo-50 text-xs text-indigo-600 hover:text-indigo-700 transition-all border border-gray-200 hover:border-indigo-200 cursor-pointer disabled:opacity-50"
                          >
                            → {followUp}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full"
              />
              Reflecting...
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-gray-200 px-6 py-4 bg-white/80 backdrop-blur-xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex items-center gap-3"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your personality..."
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Ask
          </button>
        </form>
      </div>
    </main>
  );
}
