'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { incidentSummary } from '@/data/mockData';
import Badge from '@/components/shared/Badge';
import ConfidenceMeter from '@/components/shared/ConfidenceMeter';
import { Shield, Clock, Server, Zap } from 'lucide-react';

export default function IncidentSummary() {
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
              {incidentSummary.id}
            </span>
            <Badge variant={incidentSummary.severity} dot>
              Critical
            </Badge>
            <Badge variant="active" dot>
              Active
            </Badge>
          </div>
          <h2 className="text-h2 mb-2">
            {incidentSummary.title}
          </h2>
          <p className="text-small leading-relaxed max-w-2xl">
            {incidentSummary.description}
          </p>
        </div>
        <ConfidenceMeter value={incidentSummary.confidence} size="lg" className="ml-6" />
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
            <p className="text-[13px] text-text-primary font-medium mt-0.5">
              {incidentSummary.attackVector.split(' → ')[0]}
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
              {incidentSummary.affectedAssets} systems
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-info-bg flex items-center justify-center">
            <Clock className="w-4 h-4 text-info-text" />
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium">
              First Seen
            </p>
            <p className="text-[13px] text-text-primary font-medium mt-0.5">
              {incidentSummary.firstSeen}
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
              {incidentSummary.lastActivity}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
