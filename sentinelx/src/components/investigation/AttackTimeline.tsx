'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainerSlow } from '@/lib/animations';
import { useRecentAttacks, type LogEntry } from '@/lib/liveData';
import Badge from '@/components/shared/Badge';
import { useState } from 'react';
import { ChevronDown, Database } from 'lucide-react';

interface TimelineEventData {
  time: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  details?: string;
  source?: string;
}

function formatTimeOnly(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch {
    return '09:20:00';
  }
}

function severityVariant(sev: string): 'critical' | 'high' | 'medium' | 'low' {
  if (sev === 'critical' || sev === 'high' || sev === 'medium' || sev === 'low') return sev;
  return 'low';
}

function TimelineEvent({ event, index, isLast }: { event: TimelineEventData; index: number; isLast: boolean }) {
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
        {!isLast && (
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
  const attacks = useRecentAttacks(6);

  const events: TimelineEventData[] = attacks.map((log) => ({
    time: formatTimeOnly(log['@timestamp']),
    title: `${log.event_type.replace(/_/g, ' ').toUpperCase()} — ${log.source_ip}`,
    description: log.message,
    severity: severityVariant(log.severity),
    details: `Payload: ${log.payload || 'N/A'} | Destination: ${log.dest_ip}:${log.port} | User: ${log.user} | MITRE: ${log.mitre_tactic || 'TA0001 Initial Access'}`,
    source: 'SOC In-Memory Log Streamer',
  }));

  return (
    <motion.div
      variants={staggerContainerSlow}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-caption text-text-tertiary">LIVE ATTACK TIMELINE</h3>
        <span className="text-[11px] text-low-text flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
          Real-Time Telemetry
        </span>
      </div>
      <div className="ml-1">
        {events.length === 0 ? (
          <div className="py-6 text-center text-small text-text-tertiary">
            Waiting for live telemetry stream…
          </div>
        ) : (
          events.map((event, i) => (
            <TimelineEvent key={`${event.time}-${i}`} event={event} index={i} isLast={i === events.length - 1} />
          ))
        )}
      </div>
    </motion.div>
  );
}
