'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { evidenceItems } from '@/data/mockData';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import Badge from '@/components/shared/Badge';
import { Database, Brain, Code } from 'lucide-react';

export default function EvidencePanel() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <h3 className="text-caption text-text-tertiary mb-5">EVIDENCE & REASONING</h3>
      <div className="space-y-3">
        {evidenceItems.map((item, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <CollapsibleSection
              title={item.type}
              defaultOpen={i === 0}
              badge={
                <Badge variant={item.confidence >= 90 ? 'low' : item.confidence >= 70 ? 'medium' : 'high'}>
                  {item.confidence}% confidence
                </Badge>
              }
            >
              {/* Logs consulted */}
              <div className="flex items-center gap-2 mb-4 text-[12px] text-text-secondary">
                <Database className="w-3.5 h-3.5 text-text-tertiary" />
                <span>{item.logsConsulted.toLocaleString()} logs analyzed</span>
              </div>

              {/* Reasoning */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-3.5 h-3.5 text-accent" />
                  <span className="text-caption text-accent">REASONING</span>
                </div>
                <p className="text-[13px] text-text-primary leading-relaxed pl-5">
                  {item.reasoning}
                </p>
              </div>

              {/* Generated query */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-3.5 h-3.5 text-info-text" />
                  <span className="text-caption text-info-text">GENERATED ELASTICSEARCH QUERY</span>
                </div>
                <pre className="text-mono text-[12px] leading-relaxed bg-surface-secondary rounded-lg p-4 overflow-x-auto border border-border-subtle">
                  {item.query}
                </pre>
              </div>
            </CollapsibleSection>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
