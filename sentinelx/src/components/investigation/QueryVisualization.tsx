'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainerSlow } from '@/lib/animations';
import { queryVisualization } from '@/data/mockData';
import { ArrowDown, MessageSquare, Brain, Code, Database, Lightbulb, CheckCircle } from 'lucide-react';

interface FlowStepProps {
  icon: React.ReactNode;
  label: string;
  content: string;
  accentColor: string;
  isCode?: boolean;
  showArrow?: boolean;
}

function FlowStep({ icon, label, content, accentColor, isCode, showArrow = true }: FlowStepProps) {
  return (
    <motion.div variants={fadeInUp}>
      <div
        className="rounded-lg border border-border-default p-4 bg-surface"
        style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
      >
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-caption" style={{ color: accentColor }}>
            {label}
          </span>
        </div>
        {isCode ? (
          <pre className="text-mono text-[11px] leading-relaxed bg-surface-secondary rounded-md p-3 overflow-x-auto">
            {content}
          </pre>
        ) : (
          <p className="text-[13px] text-text-primary leading-relaxed">{content}</p>
        )}
      </div>
      {showArrow && (
        <div className="flex justify-center py-2">
          <ArrowDown className="w-4 h-4 text-border-default" />
        </div>
      )}
    </motion.div>
  );
}

export default function QueryVisualization() {
  return (
    <motion.div
      variants={staggerContainerSlow}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <h3 className="text-caption text-text-tertiary mb-5">QUERY VISUALIZATION</h3>

      <FlowStep
        icon={<MessageSquare className="w-3.5 h-3.5 text-accent" />}
        label="NATURAL LANGUAGE"
        content={queryVisualization.naturalLanguage}
        accentColor="var(--accent)"
      />

      <FlowStep
        icon={<Brain className="w-3.5 h-3.5 text-info-text" />}
        label="AI UNDERSTANDING"
        content={queryVisualization.understanding}
        accentColor="var(--info-text)"
      />

      <FlowStep
        icon={<Code className="w-3.5 h-3.5 text-agent-network" />}
        label="GENERATED ELASTICSEARCH QUERY"
        content={queryVisualization.elasticsearchQuery}
        accentColor="var(--agent-network)"
        isCode
      />

      <FlowStep
        icon={<Database className="w-3.5 h-3.5 text-medium-text" />}
        label="RETRIEVED LOGS"
        content={`${queryVisualization.retrievedCount} critical event retrieved. Cross-correlating with 24,891 related events.`}
        accentColor="var(--medium-text)"
      />

      <FlowStep
        icon={<Lightbulb className="w-3.5 h-3.5 text-high-text" />}
        label="REASONING"
        content={queryVisualization.reasoning}
        accentColor="var(--high-text)"
      />

      <FlowStep
        icon={<CheckCircle className="w-3.5 h-3.5 text-low-text" />}
        label="FINAL ANSWER"
        content="Multi-stage credential theft attack identified. Full kill chain mapped across 6 MITRE ATT&CK tactics. See Incident Summary above for complete analysis."
        accentColor="var(--low-text)"
        showArrow={false}
      />
    </motion.div>
  );
}
