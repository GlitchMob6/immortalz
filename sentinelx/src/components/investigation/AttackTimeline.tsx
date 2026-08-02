'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainerSlow } from '@/lib/animations';
import { attackTimeline, type TimelineEventData } from '@/data/mockData';
import Badge from '@/components/shared/Badge';
import { useState } from 'react';
import { ChevronDown, Database } from 'lucide-react';

function TimelineEvent({ event, index }: { event: TimelineEventData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex gap-4"
    >
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full border-2 flex-shrink-0 z-10 ${
            event.severity === 'critical'
              ? 'border-critical-text bg-critical-bg'
              : event.severity === 'high'
              ? 'border-high-text bg-high-bg'
              : event.severity === 'medium'
              ? 'border-medium-text bg-medium-bg'
              : 'border-info-text bg-info-bg'
          }`}
        />
        {index < attackTimeline.length - 1 && (
          <div className="w-[2px] flex-1 bg-border-default min-h-[24px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 -mt-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left group"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-mono text-[12px] text-text-tertiary font-medium">
              {event.time}
            </span>
            <Badge variant={event.severity}>
              {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
            </Badge>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-auto"
            >
              <ChevronDown className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
          <h3 className="text-[14px] font-medium text-text-primary mb-1">
            {event.title}
          </h3>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {event.description}
          </p>
        </button>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-lg bg-surface-secondary border border-border-subtle">
                <p className="text-[13px] text-text-primary leading-relaxed mb-3">
                  {event.details}
                </p>
                {event.source && (
                  <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
                    <Database className="w-3 h-3" />
                    <span>Source: {event.source}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function AttackTimeline() {
  return (
    <motion.div
      variants={staggerContainerSlow}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <h3 className="text-caption text-text-tertiary mb-5">ATTACK TIMELINE</h3>
      <div className="ml-1">
        {attackTimeline.map((event, i) => (
          <TimelineEvent key={event.time} event={event} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
