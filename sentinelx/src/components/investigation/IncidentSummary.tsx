'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useRecentAttacks, useStats } from '@/lib/liveData';
import Badge from '@/components/shared/Badge';
import ConfidenceMeter from '@/components/shared/ConfidenceMeter';
import { Shield, Clock, Server, Zap } from 'lucide-react';

function formatUTCTime(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC';
  } catch {
    return '16:20 UTC';
  }
}

export default function IncidentSummary() {
  const attacks = useRecentAttacks(1);
  const stats = useStats();

  const attack = attacks[0];
  const severity = (attack?.severity === 'critical' || attack?.severity === 'high' || attack?.severity === 'medium' || attack?.severity === 'low')
    ? attack.severity
    : 'critical';

  const title = attack
    ? `Active Threat: ${attack.event_type.replace(/_/g, ' ').toUpperCase()} from ${attack.source_ip}`
    : 'Credential Theft via Password Spraying → Lateral Movement';

  const description = attack
    ? `${attack.message}. Coordinated telemetry indicates anomalous behavior targeting internal host ${attack.dest_ip} on port ${attack.port}. Live AI analysis has flagged this IP for active containment.`
    : 'A coordinated password spraying attack was detected targeting accounts. The attacker successfully initiated lateral movement across the internal network.';

  const id = attack
    ? `INC-${new Date(attack['@timestamp']).getFullYear()}-${attack['@timestamp'].slice(14, 19).replace(':', '')}`
    : 'INC-2024-0847';

  const attackVector = attack
    ? `${attack.source_ip} → ${attack.event_type.replace(/_/g, ' ')} → ${attack.dest_ip}:${attack.port}`
    : 'External → Credential Access';

  const affectedAssets = stats ? Math.max(3, stats.unique_source_ips) : 14;
  const lastActivity = attack ? formatUTCTime(attack['@timestamp']) : 'Now';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-mono text-text-tertiary text-[12px]">
              {id}
            </span>
            <Badge variant={severity} dot>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>
            <Badge variant="active" dot>
              Active
            </Badge>
          </div>
          <h2 className="text-h2 mb-2">
            {title}
          </h2>
          <p className="text-small leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
        <ConfidenceMeter value={96} size="lg" className="ml-6" />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-4 gap-4 pt-5 border-t border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-active-bg flex items-center justify-center">
            <Zap className="w-4 h-4 text-active-text" />
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium">
              Attack Vector
            </p>
            <p className="text-[13px] text-text-primary font-medium mt-0.5 truncate max-w-[130px]">
              {attackVector.split(' → ')[0]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-critical-bg flex items-center justify-center">
            <Server className="w-4 h-4 text-critical-text" />
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium">
              Affected Assets
            </p>
            <p className="text-[13px] text-text-primary font-medium mt-0.5">
              {affectedAssets} systems
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-info-bg flex items-center justify-center">
            <Clock className="w-4 h-4 text-info-text" />
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium">
              Status
            </p>
            <p className="text-[13px] text-text-primary font-medium mt-0.5">
              Streaming Live
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-high-bg flex items-center justify-center">
            <Shield className="w-4 h-4 text-high-text" />
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium">
              Last Activity
            </p>
            <p className="text-[13px] text-text-primary font-medium mt-0.5">
              {lastActivity}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
