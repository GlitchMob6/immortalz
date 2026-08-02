'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useStats, useRecentAttacks } from '@/lib/liveData';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import Badge from '@/components/shared/Badge';
import { Database, Brain, Code } from 'lucide-react';

export default function EvidencePanel() {
  const stats = useStats();
  const attacks = useRecentAttacks(3);

  const totalLogs = stats?.events_processed || 12847;
  const recentLogs = stats?.events_24h || 520;

  const a0 = attacks[0];
  const a1 = attacks[1];
  const a2 = attacks[2];

  const evidenceItems = [
    {
      type: 'Authentication & Brute Force Telemetry',
      confidence: 96,
      logsConsulted: totalLogs,
      reasoning: a0
        ? `Pattern analysis of repeated authentication events from ${a0.source_ip} targeting account '${a0.user}' indicates automated password spraying and credential probing across the local network.`
        : 'Pattern analysis of 847 failed login attempts from IP range 185.234.72.0/24 indicates automated password spraying using a credential list.',
      query: a0
        ? `GET /soc-logs/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "term": { "source_ip.keyword": "${a0.source_ip}" } },\n        { "term": { "event_type.keyword": "${a0.event_type}" } }\n      ]\n    }\n  }\n}`
        : `GET /soc-logs/_search\n{\n  "query": { "term": { "source_ip.keyword": "185.234.72.19" } }\n}`,
    },
    {
      type: 'Network & Port Scan Telemetry',
      confidence: 91,
      logsConsulted: Math.floor(totalLogs * 0.4),
      reasoning: a1
        ? `Reconnaissance scan detected from ${a1.source_ip} targeting port ${a1.port} on destination host ${a1.dest_ip}. Correlates with initial access probing.`
        : 'Reconnaissance scan detected targeting 14 internal servers on TCP ports 22, 3389, and 445.',
      query: a1
        ? `GET /soc-logs/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "term": { "event_type.keyword": "port_scan" } },\n        { "term": { "port": ${a1.port} } }\n      ]\n    }\n  }\n}`
        : `GET /soc-logs/_search\n{\n  "query": { "term": { "event_type.keyword": "port_scan" } }\n}`,
    },
    {
      type: 'Payload & Execution Inspection',
      confidence: 88,
      logsConsulted: recentLogs,
      reasoning: a2
        ? `Suspicious payload signature flagged from ${a2.source_ip}: "${a2.payload || 'cmd.exe /c whoami'}". Matches known MITRE Initial Access patterns.`
        : 'Suspicious payload signature flagged in HTTP requests matching SQLi and RCE exploit strings.',
      query: a2
        ? `GET /soc-logs/_search\n{\n  "query": {\n    "match": { "payload": "${(a2.payload || '').slice(0, 20)}" }\n  }\n}`
        : `GET /soc-logs/_search\n{\n  "query": { "exists": { "field": "payload" } }\n}`,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-caption text-text-tertiary">EVIDENCE & REASONING</h3>
        <span className="text-[11px] text-low-text flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
          Live MCP Queries
        </span>
      </div>
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
