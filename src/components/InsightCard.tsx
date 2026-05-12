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
  gradient = "from-indigo-50 to-purple-50",
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${gradient} p-6 shadow-sm`}
    >
      <div className="relative">
        <h3 className="text-xs uppercase tracking-[0.2em] text-indigo-600 mb-3">
          {title}
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
