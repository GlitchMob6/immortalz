'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { recentInvestigations } from '@/data/mockData';
import Badge from '@/components/shared/Badge';
import { ArrowRight, Clock } from 'lucide-react';

export default function RecentInvestigations() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto mt-14"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-[13px] font-medium text-text-tertiary uppercase tracking-wider mb-4"
      >
        Recent Investigations
      </motion.h2>
      <div className="space-y-2">
        {recentInvestigations.map((inv) => (
          <motion.div
            key={inv.id}
            variants={fadeInUp}
            className="flex items-center justify-between p-4 rounded-xl border border-border-default bg-surface
              hover:shadow-[var(--shadow-2)] hover:-translate-y-[1px]
              transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <Badge variant={inv.severity} dot>
                {inv.severity.charAt(0).toUpperCase() + inv.severity.slice(1)}
              </Badge>
              <div>
                <p className="text-[14px] font-medium text-text-primary">
                  {inv.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-mono text-text-tertiary">{inv.id}</span>
                  <span className="text-text-tertiary">·</span>
                  <span className="flex items-center gap-1 text-[12px] text-text-tertiary">
                    <Clock className="w-3 h-3" />
                    {inv.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={inv.status === 'resolved' ? 'low' : 'active'} dot>
                {inv.status === 'resolved' ? 'Resolved' : 'Active'}
              </Badge>
              <ArrowRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
