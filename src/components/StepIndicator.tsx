"use client";

import { motion } from "framer-motion";

interface Props {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                i <= currentStep
                  ? "bg-indigo-500"
                  : "bg-gray-300"
              }`}
              animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span
              className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                i <= currentStep
                  ? "text-indigo-600"
                  : "text-gray-300"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-px transition-colors duration-300 mb-5 ${
                i < currentStep ? "bg-indigo-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
