'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useRecentAttacks, useStats } from '@/lib/liveData';
import Badge from '@/components/shared/Badge';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Recommendations() {
  const attacks = useRecentAttacks(1);
  const stats = useStats();
  const topAttack = attacks[0];
  const targetIp = topAttack?.source_ip || '185.234.72.19';

  const [executed, setExecuted] = useState<Record<number, boolean>>({});

  const recommendations = [
    {
      priority: 'critical' as const,
      title: `Isolate Attacker Host IP (${targetIp})`,
      description: `Immediately deploy automated firewall drop rules at the edge for ${targetIp} and terminate active RDP/SSH sessions on affected internal servers.`,
      action: 'Execute Isolation Rule',
    },
    {
      priority: 'high' as const,
      title: 'Enforce Step-Up MFA & Reset Compromised Accounts',
      description: `Force credential reset and trigger step-up MFA for account '${topAttack?.user || 'admin'}' and all user principals targeted during the password spraying event.`,
      action: 'Reset Credentials',
    },
    {
      priority: 'medium' as const,
      title: 'Tune WAF & Rate-Limiting Rules',
      description: `Adjust WAF rate-limiting threshold to 15 login attempts per minute per subnet to prevent ongoing brute-force reconnaissance from secondary IP pools.`,
      action: 'Apply WAF Profile',
    },
  ];

  const handleExecute = (idx: number) => {
    setExecuted((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-caption text-text-tertiary">RECOMMENDATIONS & AUTOMATED CONTAINMENT</h3>
          <span className="text-[11px] text-low-text flex items-center gap-1.5 ml-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
            Live Response Ready
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const isDone = !!executed[i];
          return (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-start justify-between p-4 rounded-lg border border-border-default
                hover:bg-surface-tertiary transition-colors duration-150 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={rec.priority}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                  </Badge>
                  <h4 className="text-[14px] font-medium text-text-primary">
                    {rec.title}
                  </h4>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {rec.description}
                </p>
              </div>
              <button
                onClick={() => handleExecute(i)}
                disabled={isDone}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 whitespace-nowrap ml-4 ${
                  isDone
                    ? 'bg-low-bg text-low-text border border-low-text/30 cursor-default'
                    : 'text-accent hover:bg-accent/10 border border-accent/20'
                }`}
              >
                {isDone ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-low-text" />
                    <span>Enforced</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{rec.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
