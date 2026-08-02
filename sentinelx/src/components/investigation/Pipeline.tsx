'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { investigationPipeline, type PipelineStepData } from '@/data/mockData';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

function PipelineStep({ step, index }: { step: PipelineStepData; index: number }) {
  const isComplete = step.status === 'complete';
  const isActive = step.status === 'active';
  const isPending = step.status === 'pending';

  return (
    <motion.div
      variants={fadeInUp}
      className="flex items-center gap-3 py-2"
    >
      {/* Status icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.15 }}
            className="w-5 h-5 rounded-full bg-low-bg flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-low-text" />
          </motion.div>
        )}
        {isActive && (
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
          </div>
        )}
        {isPending && (
          <div className="w-2.5 h-2.5 rounded-full bg-border-default mx-auto" />
        )}
      </div>

      {/* Label */}
      <span
        className={`text-[13px] ${
          isComplete
            ? 'text-text-secondary'
            : isActive
            ? 'text-text-primary font-medium'
            : 'text-text-tertiary'
        }`}
      >
        {step.label}
      </span>

      {/* Duration */}
      {step.duration && (
        <span className="text-[11px] text-text-tertiary ml-auto font-mono">
          {step.duration}
        </span>
      )}
    </motion.div>
  );
}

export default function Pipeline() {
  const [steps, setSteps] = useState<PipelineStepData[]>(
    investigationPipeline.map((s) => ({ ...s, status: 'pending' }))
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((_, i) => {
      // Set active
      timers.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) =>
              idx === i ? { ...s, status: 'active' } : s
            )
          );
        }, i * 600 + 300)
      );

      // Set complete
      timers.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) =>
              idx === i
                ? { ...s, status: 'complete', duration: `${(0.3 + i * 0.4).toFixed(1)}s` }
                : s
            )
          );
        }, i * 600 + 800)
      );
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-5 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
        <span className="text-caption text-accent">INVESTIGATION PIPELINE</span>
      </div>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <PipelineStep key={step.label} step={step} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
