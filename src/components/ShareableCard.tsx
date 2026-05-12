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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-200 mb-1">
            Personality OS
          </p>
          <h2 className="text-2xl font-light text-white mb-2 tracking-tight">
            {archetype}
          </h2>
          <p className="text-indigo-100/70 text-sm mb-6 leading-relaxed max-w-md">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {traits.slice(0, 4).map((trait) => (
              <span
                key={trait}
                className="px-3 py-1 rounded-full text-xs bg-white/15 text-white/80 border border-white/10"
              >
                {trait}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-indigo-200/60">
            <span className="px-2 py-1 rounded bg-white/10">
              {mbtiType}
            </span>
            <span className="px-2 py-1 rounded bg-white/10">
              Enneagram {enneagramType}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="mt-4 w-full py-3 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all border border-gray-200 cursor-pointer"
      >
        {copied ? "Copied to clipboard" : "Share your archetype"}
      </button>
    </motion.div>
  );
}
