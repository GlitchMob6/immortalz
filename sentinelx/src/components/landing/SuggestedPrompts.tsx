'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { suggestedPrompts } from '@/data/mockData';
import {
  AlertTriangle,
  Globe,
  FileText,
  Shield,
  TrendingUp,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle className="w-4 h-4 text-text-tertiary" />,
  Globe: <Globe className="w-4 h-4 text-text-tertiary" />,
  FileText: <FileText className="w-4 h-4 text-text-tertiary" />,
  Shield: <Shield className="w-4 h-4 text-text-tertiary" />,
  TrendingUp: <TrendingUp className="w-4 h-4 text-text-tertiary" />,
};

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestedPrompts.map((prompt, i) => (
          <motion.button
            key={i}
            variants={fadeInUp}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-default bg-surface
              hover:border-accent-muted hover:bg-accent-light
              text-[13px] text-text-secondary hover:text-text-primary
              transition-all duration-200 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)]"
          >
            {iconMap[prompt.icon]}
            <span>{prompt.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
