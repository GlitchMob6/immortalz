'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import InvestigationInput from '@/components/landing/InvestigationInput';
import { Shield, User, ChevronRight } from 'lucide-react';
import Badge from '@/components/shared/Badge';

interface Message {
  type: 'user' | 'ai';
  content: string;
  findings?: string[];
}

const mockMessages: Message[] = [
  {
    type: 'user',
    content: "Investigate today's highest risk incident",
  },
  {
    type: 'ai',
    content:
      'I\'ve initiated a comprehensive investigation of the highest-risk security incident from the past 24 hours. A multi-stage credential theft attack has been identified with a risk score of 98/100.',
    findings: [
      'Password spraying attack from Eastern European IP range',
      '3 compromised accounts — credential dumping confirmed',
      'Lateral movement to 4 critical servers',
      'DNS tunneling exfiltration of 2.3 GB',
    ],
  },
];

export default function InvestigationLog({ onNewQuery }: { onNewQuery: (q: string) => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-default">
        <h2 className="text-[14px] font-semibold text-text-primary">Investigation Log</h2>
        <p className="text-[12px] text-text-tertiary mt-0.5">INC-2024-0847</p>
      </div>

      {/* Messages */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {mockMessages.map((msg, i) => (
          <motion.div key={i} variants={fadeInUp}>
            {msg.type === 'user' ? (
              /* User query */
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border-default flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[13px] text-text-primary font-medium">{msg.content}</p>
                </div>
              </div>
            ) : (
              /* AI investigation card */
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="bg-surface-tertiary rounded-xl p-4 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium text-accent uppercase tracking-wider">
                        Investigation Update
                      </span>
                      <Badge variant="active" dot>Active</Badge>
                    </div>
                    <p className="text-[13px] text-text-primary leading-relaxed mb-3">
                      {msg.content}
                    </p>
                    {msg.findings && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium">
                          Key Findings
                        </p>
                        {msg.findings.map((finding, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 text-[12px] text-text-secondary"
                          >
                            <ChevronRight className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                            <span>{finding}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border-default">
        <InvestigationInput
          variant="compact"
          onSubmit={onNewQuery}
          placeholder="Ask a follow-up question..."
        />
      </div>
    </div>
  );
}
