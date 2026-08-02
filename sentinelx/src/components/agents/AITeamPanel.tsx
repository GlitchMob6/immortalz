'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { agents, type AgentData } from '@/data/mockData';
import { useEffect, useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';

function AgentCard({ agent }: { agent: AgentData }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(agent.progress), 300);
    return () => clearTimeout(timer);
  }, [agent.progress]);

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-surface border border-border-default rounded-xl p-4 shadow-[var(--shadow-1)]
        hover:shadow-[var(--shadow-2)] transition-all duration-200"
    >
      {/* Agent accent line */}
      <div
        className="h-[3px] rounded-full -mt-4 -mx-4 mb-3 mx-0 rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${agent.color}, ${agent.color}40)`,
          marginLeft: '-1rem',
          marginRight: '-1rem',
          marginTop: '-1rem',
          borderTopLeftRadius: '0.75rem',
          borderTopRightRadius: '0.75rem',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${agent.color}14` }}
          >
            <Bot className="w-3.5 h-3.5" style={{ color: agent.color }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-primary">{agent.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {agent.status === 'active' ? (
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: agent.color }} />
          ) : (
            <div className="w-2 h-2 rounded-full bg-border-default" />
          )}
          <span className="text-[11px] text-text-tertiary capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Current task */}
      <p className="text-[12px] text-text-secondary mb-3 line-clamp-2 leading-relaxed">
        {agent.task}
      </p>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Progress</span>
          <span className="text-[11px] font-medium text-text-primary">{agent.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: agent.color }}
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />
        </div>
      </div>

      {/* Latest finding */}
      {agent.latestFinding && agent.status !== 'idle' && (
        <div className="mt-3 pt-3 border-t border-border-subtle">
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium mb-1">Latest Finding</p>
          <p className="text-[12px] text-text-primary leading-relaxed line-clamp-2">
            {agent.latestFinding}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function AITeamPanel() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-caption text-text-tertiary">AI INVESTIGATION TEAM</h3>
        <span className="text-[11px] text-text-tertiary">
          {agents.filter((a) => a.status === 'active').length} active
        </span>
      </div>
      {agents.map((agent) => (
        <AgentCard key={agent.name} agent={agent} />
      ))}
    </motion.div>
  );
}
