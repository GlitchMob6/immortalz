'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLiveLogStream, type LogEntry } from '@/lib/liveData';
import { Radio, Shield, AlertTriangle, Eye, Crosshair, Globe } from 'lucide-react';

const severityColors: Record<string, string> = {
  critical: 'var(--critical-text)',
  high: 'var(--high-text)',
  medium: 'var(--medium-text)',
  low: 'var(--text-tertiary)',
};

const eventIcons: Record<string, React.ReactNode> = {
  failed_login: <Shield className="w-3 h-3" />,
  port_scan: <Crosshair className="w-3 h-3" />,
  suspicious_payload: <AlertTriangle className="w-3 h-3" />,
  successful_login: <Eye className="w-3 h-3" />,
  normal_traffic: <Globe className="w-3 h-3" />,
};

function formatLogTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch { return '--:--:--'; }
}

function LogRow({ log }: { log: LogEntry }) {
  const color = severityColors[log.severity] || severityColors.low;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-2 py-2 border-b border-border-subtle last:border-b-0"
    >
      <div
        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {eventIcons[log.event_type] || <Globe className="w-3 h-3" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-text-primary leading-snug line-clamp-2">
          {log.message}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-mono text-[10px] text-text-tertiary">{formatLogTime(log['@timestamp'])}</span>
          <span
            className="text-[9px] font-medium uppercase tracking-wider"
            style={{ color }}
          >
            {log.severity}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AITeamPanel() {
  const { logs, isConnected } = useLiveLogStream(30);

  // Show most recent first
  const displayLogs = [...logs].reverse();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-critical-text" />
          <h3 className="text-caption text-text-tertiary">LIVE LOG FEED</h3>
        </div>
        <span className={`text-[11px] flex items-center gap-1.5 ${isConnected ? 'text-low-text' : 'text-text-tertiary'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-low-text animate-pulse-dot' : 'bg-border-default'}`} />
          {isConnected ? 'Live' : 'Connecting…'}
        </span>
      </div>

      <div className="bg-surface border border-border-default rounded-xl p-3 shadow-[var(--shadow-1)] max-h-[calc(100vh-140px)] overflow-y-auto">
        {displayLogs.length === 0 ? (
          <div className="text-center text-[12px] text-text-tertiary py-6 italic">
            Waiting for logs…
          </div>
        ) : (
          displayLogs.map((log, i) => (
            <LogRow key={`${log['@timestamp']}-${i}`} log={log} />
          ))
        )}
      </div>

      {/* Stats footer */}
      <div className="px-1 flex items-center justify-between text-[10px] text-text-tertiary">
        <span>{logs.length} events buffered</span>
        <span className="text-mono">{logs.filter(l => l.severity === 'critical').length} critical</span>
      </div>
    </motion.div>
  );
}
