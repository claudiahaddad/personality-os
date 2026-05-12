"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  content: string;
  gradient?: string;
  delay?: number;
}

export default function InsightCard({
  title,
  content,
  gradient = "from-indigo-500/10 to-purple-500/10",
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br ${gradient} p-6 backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">
        <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-300/70 mb-3">
          {title}
        </h3>
        <p className="text-white/80 text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
