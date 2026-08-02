'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useStats } from '@/lib/liveData';
import { AlertTriangle, AlertCircle, Search, CheckCircle } from 'lucide-react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
}

function StatCard({ value, label, icon, accentColor }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-surface border border-border-default rounded-xl p-5 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)] hover:-translate-y-[2px] transition-all duration-200"
      style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}14` }}
        >
          {icon}
        </div>
      </div>
      <div className="text-h1 mb-0.5">{value}</div>
      <div className="text-small">{label}</div>
    </motion.div>
  );
}

export default function StatsGrid() {
  const stats = useStats();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-4 max-w-3xl mx-auto mb-10"
    >
      <StatCard
        value={stats?.critical_incidents ?? 0}
        label="Critical Incidents"
        icon={<AlertTriangle className="w-4.5 h-4.5" style={{ color: 'var(--critical-text)' }} />}
        accentColor="var(--critical-text)"
      />
      <StatCard
        value={stats?.medium_alerts ?? 0}
        label="Medium Alerts"
        icon={<AlertCircle className="w-4.5 h-4.5" style={{ color: 'var(--medium-text)' }} />}
        accentColor="var(--medium-text)"
      />
      <StatCard
        value={stats?.active_investigations ?? 0}
        label="Active Investigations"
        icon={<Search className="w-4.5 h-4.5" style={{ color: 'var(--active-text)' }} />}
        accentColor="var(--active-text)"
      />
      <StatCard
        value={`${stats?.resolved_rate ?? 0}%`}
        label="Resolved Rate"
        icon={<CheckCircle className="w-4.5 h-4.5" style={{ color: 'var(--low-text)' }} />}
        accentColor="var(--low-text)"
      />
    </motion.div>
  );
}
