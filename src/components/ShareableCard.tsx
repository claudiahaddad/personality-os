"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

interface Props {
  archetype: string;
  description: string;
  traits: string[];
  mbtiType: string;
  enneagramType: string;
}

export default function ShareableCard({
  archetype,
  description,
  traits,
  mbtiType,
  enneagramType,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const text = `My Personality OS archetype: ${archetype}\n${description}\n\nTraits: ${traits.join(", ")}\n\n${mbtiType} | Enneagram ${enneagramType}`;

    if (navigator.share) {
      await navigator.share({ title: "My Personality OS Profile", text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [archetype, description, traits, mbtiType, enneagramType]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0a2e] via-[#1a1145] to-[#0d1b3e] p-8 border border-white/[0.08]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/60 mb-1">
            Personality OS
          </p>
          <h2 className="text-2xl font-light text-white mb-2 tracking-tight">
            {archetype}
          </h2>
          <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-md">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {traits.slice(0, 4).map((trait) => (
              <span
                key={trait}
                className="px-3 py-1 rounded-full text-xs bg-white/[0.06] text-white/60 border border-white/[0.06]"
              >
                {trait}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-white/30">
            <span className="px-2 py-1 rounded bg-white/[0.04]">
              {mbtiType}
            </span>
            <span className="px-2 py-1 rounded bg-white/[0.04]">
              Enneagram {enneagramType}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="mt-4 w-full py-3 rounded-xl text-sm font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white/80 transition-all border border-white/[0.06] cursor-pointer"
      >
        {copied ? "Copied to clipboard" : "Share your archetype"}
      </button>
    </motion.div>
  );
}
