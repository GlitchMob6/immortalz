'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { recommendations } from '@/data/mockData';
import Badge from '@/components/shared/Badge';
import { ArrowRight } from 'lucide-react';

export default function Recommendations() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <h3 className="text-caption text-text-tertiary mb-5">RECOMMENDATIONS</h3>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="flex items-start justify-between p-4 rounded-lg border border-border-default
              hover:bg-surface-tertiary transition-colors duration-150 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={rec.priority}>
                  {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                </Badge>
                <h4 className="text-[14px] font-medium text-text-primary">
                  {rec.title}
                </h4>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {rec.description}
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
              text-accent hover:bg-accent-light transition-colors duration-150 whitespace-nowrap ml-4
              opacity-0 group-hover:opacity-100"
            >
              {rec.action}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
