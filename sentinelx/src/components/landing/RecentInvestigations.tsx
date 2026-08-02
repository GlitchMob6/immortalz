'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useRecentAttacks, type LogEntry } from '@/lib/liveData';
import Badge from '@/components/shared/Badge';
import { ArrowRight, Clock } from 'lucide-react';

function severityVariant(severity: string): 'critical' | 'high' | 'medium' | 'low' {
  if (severity === 'critical') return 'critical';
  if (severity === 'high') return 'high';
  if (severity === 'medium') return 'medium';
  return 'low';
}

function formatTime(ts: string): string {
  try {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
  } catch {
    return 'Recently';
  }
}

function generateId(log: LogEntry, i: number): string {
  return `INV-${new Date(log['@timestamp']).getFullYear()}-${String(8400 + i).padStart(4, '0')}`;
}

function generateTitle(log: LogEntry): string {
  switch (log.event_type) {
    case 'failed_login':
      return `Brute Force — ${log.source_ip} → ${log.user}`;
    case 'port_scan':
      return `Port Scan — ${log.source_ip} → ${log.dest_ip}:${log.port}`;
    case 'suspicious_payload':
      return `Malicious Payload — ${log.source_ip}`;
    default:
      return `Suspicious Activity — ${log.source_ip}`;
  }
}

export default function RecentInvestigations() {
  const attacks = useRecentAttacks(5);

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
        Recent Alerts
      </motion.h2>
      <div className="space-y-2">
        {attacks.length === 0 ? (
          <motion.div variants={fadeInUp} className="text-center text-[13px] text-text-tertiary py-8">
            Waiting for live data…
          </motion.div>
        ) : (
          attacks.map((attack, i) => {
            const id = generateId(attack, i);
            const title = generateTitle(attack);
            const variant = severityVariant(attack.severity);
            const timeAgo = formatTime(attack['@timestamp']);

            return (
              <motion.div
                key={`${attack['@timestamp']}-${i}`}
                variants={fadeInUp}
                className="flex items-center justify-between p-4 rounded-xl border border-border-default bg-surface
                  hover:shadow-[var(--shadow-2)] hover:-translate-y-[1px]
                  transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <Badge variant={variant} dot>
                    {attack.severity.charAt(0).toUpperCase() + attack.severity.slice(1)}
                  </Badge>
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">
                      {title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-mono text-text-tertiary">{id}</span>
                      <span className="text-text-tertiary">·</span>
                      <span className="flex items-center gap-1 text-[12px] text-text-tertiary">
                        <Clock className="w-3 h-3" />
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="active" dot>
                    Active
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
