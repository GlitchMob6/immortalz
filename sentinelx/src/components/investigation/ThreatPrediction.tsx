'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import Badge from '@/components/shared/Badge';
import ConfidenceMeter from '@/components/shared/ConfidenceMeter';
import { TrendingUp, AlertTriangle, Clock } from 'lucide-react';

export default function ThreatPrediction() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-caption text-text-tertiary">THREAT PREDICTION</h3>
        <Badge variant="critical" dot>
          High Risk
        </Badge>
      </div>

      <div className="flex items-start gap-6">
        <ConfidenceMeter value={87} size="lg" />
        <div className="flex-1">
          <h4 className="text-[16px] font-semibold text-text-primary mb-2">
            Ransomware Deployment Likely
          </h4>
          <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
            Based on the observed attack pattern (credential theft → lateral movement → data staging), 
            there is an <span className="text-critical-text font-medium">87% probability</span> of 
            ransomware deployment within the next 2 hours. The attacker has already compromised backup 
            infrastructure, indicating preparation for maximum impact.
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
              <p className="text-[11px] text-text-secondary">$2.4M estimated damage</p>
            </div>
            <div className="rounded-lg bg-high-bg border border-high-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-high-text" />
                <span className="text-[10px] text-high-text uppercase tracking-wider font-medium">
                  Time Window
                </span>
              </div>
              <p className="text-[13px] font-medium text-text-primary">~2 hours</p>
              <p className="text-[11px] text-text-secondary">Before likely deployment</p>
            </div>
            <div className="rounded-lg bg-info-bg border border-info-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-info-text" />
                <span className="text-[10px] text-info-text uppercase tracking-wider font-medium">
                  Confidence
                </span>
              </div>
              <p className="text-[13px] font-medium text-text-primary">87%</p>
              <p className="text-[11px] text-text-secondary">Based on 24,891 events</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
