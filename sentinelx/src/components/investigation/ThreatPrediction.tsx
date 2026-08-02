'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useStats, useRecentAttacks } from '@/lib/liveData';
import Badge from '@/components/shared/Badge';
import ConfidenceMeter from '@/components/shared/ConfidenceMeter';
import { TrendingUp, AlertTriangle, Clock } from 'lucide-react';

export default function ThreatPrediction() {
  const stats = useStats();
  const attacks = useRecentAttacks(1);

  const totalEvents = stats?.events_processed || 742321;
  const criticals = stats?.critical_incidents || 6;
  const confidence = Math.min(98, Math.max(82, 80 + criticals * 2));

  const topAttack = attacks[0];
  const attackerIp = topAttack?.source_ip || '185.234.72.19';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-caption text-text-tertiary">THREAT PREDICTION & RISK FORECAST</h3>
          <span className="text-[11px] text-low-text flex items-center gap-1.5 ml-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
            Live AI Model
          </span>
        </div>
        <Badge variant="critical" dot>
          High Risk
        </Badge>
      </div>

      <div className="flex items-start gap-6">
        <ConfidenceMeter value={confidence} size="lg" />
        <div className="flex-1">
          <h4 className="text-[16px] font-semibold text-text-primary mb-2">
            Ransomware & Lateral Movement Deployment Likely
          </h4>
          <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
            Based on the observed attack pattern from <span className="text-mono font-medium text-text-primary">{attackerIp}</span> (repeated authentication failures → suspicious payload execution), 
            there is an <span className="text-critical-text font-medium">{confidence}% probability</span> of 
            lateral movement and ransomware deployment within the next 90 minutes. The attacker has initiated active scanning across internal assets.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-critical-bg border border-critical-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-critical-text" />
                <span className="text-[10px] text-critical-text uppercase tracking-wider font-medium">
                  Impact
                </span>
              </div>
              <p className="text-[13px] font-medium text-text-primary">Severe</p>
              <p className="text-[11px] text-text-secondary">$2.4M estimated exposure</p>
            </div>
            <div className="rounded-lg bg-high-bg border border-high-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-high-text" />
                <span className="text-[10px] text-high-text uppercase tracking-wider font-medium">
                  Time Window
                </span>
              </div>
              <p className="text-[13px] font-medium text-text-primary">~90 minutes</p>
              <p className="text-[11px] text-text-secondary">Before critical breach</p>
            </div>
            <div className="rounded-lg bg-info-bg border border-info-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-info-text" />
                <span className="text-[10px] text-info-text uppercase tracking-wider font-medium">
                  Confidence
                </span>
              </div>
              <p className="text-[13px] font-medium text-text-primary">{confidence}%</p>
              <p className="text-[11px] text-text-secondary">Based on {totalEvents.toLocaleString()} events</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
