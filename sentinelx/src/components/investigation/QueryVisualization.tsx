'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainerSlow } from '@/lib/animations';
import { useStats, useRecentAttacks } from '@/lib/liveData';
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
  const stats = useStats();
  const attacks = useRecentAttacks(1);
  const attack = attacks[0];

  const targetIp = attack?.source_ip || '185.234.72.19';
  const eventType = attack?.event_type || 'failed_login';

  const elasticsearchQuery = `GET /soc-logs/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "source_ip.keyword": "${targetIp}" } },
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ]
    }
  },
  "sort": [ { "@timestamp": { "order": "desc" } } ],
  "size": 50
}`;

  return (
    <motion.div
      variants={staggerContainerSlow}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-caption text-text-tertiary">QUERY VISUALIZATION</h3>
        <span className="text-[11px] text-low-text flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
          Live AI Translation
        </span>
      </div>

      <FlowStep
        icon={<MessageSquare className="w-3.5 h-3.5 text-accent" />}
        label="NATURAL LANGUAGE"
        content="Investigate today's highest risk incident across SOC telemetry and map attacker progression"
        accentColor="var(--accent)"
      />

      <FlowStep
        icon={<Brain className="w-3.5 h-3.5 text-info-text" />}
        label="AI UNDERSTANDING"
        content="User requires a real-time investigation across the SOC in-memory store for critical alerts from active attacker IP ranges, cross-referencing auth and payload logs."
        accentColor="var(--info-text)"
      />

      <FlowStep
        icon={<Code className="w-3.5 h-3.5 text-agent-network" />}
        label="GENERATED ELASTICSEARCH / MCP QUERY"
        content={elasticsearchQuery}
        accentColor="var(--agent-network)"
        isCode
      />

      <FlowStep
        icon={<Database className="w-3.5 h-3.5 text-medium-text" />}
        label="RETRIEVED LOGS"
        content={`${(stats?.events_processed || 12847).toLocaleString()} live telemetry events scanned. Retrieved ${(stats?.critical_incidents || 6)} critical security events from ${targetIp}.`}
        accentColor="var(--medium-text)"
      />

      <FlowStep
        icon={<Lightbulb className="w-3.5 h-3.5 text-high-text" />}
        label="REASONING"
        content={`The Investigator agent correlated ${eventType.replace('_', ' ')} events from ${targetIp}, confirming multi-stage threat progression across the internal network.`}
        accentColor="var(--high-text)"
      />

      <FlowStep
        icon={<CheckCircle className="w-3.5 h-3.5 text-low-text" />}
        label="FINAL ANSWER"
        content={`Live telemetry confirms active threat from ${targetIp}. Automated containment and firewall rule deployment recommended. See Incident Summary for asset details.`}
        accentColor="var(--low-text)"
        showArrow={false}
      />
    </motion.div>
  );
}
