"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-indigo-500/70 mb-6">
            Personality OS
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6 text-gray-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          An infinitely explorable
          <br />
          <span className="italic text-indigo-600">map of yourself</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg mx-auto"
        >
          Synthesizing Myers-Briggs, Enneagram, Insights Discovery, and
          Astrology into one unified personality profile that makes you feel
          deeply seen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium tracking-wide transition-all duration-300 shadow-lg shadow-indigo-500/25 group"
          >
            Discover your profile
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.25em] text-gray-400"
        >
          <span>MBTI</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Enneagram</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Insights</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Astrology</span>
        </motion.div>
      </div>
    </main>
  );
}
