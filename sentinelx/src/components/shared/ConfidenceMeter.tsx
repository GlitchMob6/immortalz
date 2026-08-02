'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ConfidenceMeter({ value, size = 'md', className }: ConfidenceMeterProps) {
  const sizeMap = {
    sm: { dimension: 40, stroke: 3, fontSize: '10px' },
    md: { dimension: 52, stroke: 4, fontSize: '13px' },
    lg: { dimension: 72, stroke: 5, fontSize: '16px' },
  };

  const { dimension, stroke, fontSize } = sizeMap[size];
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 80) return 'var(--low-text)';
    if (v >= 60) return 'var(--medium-text)';
    if (v >= 40) return 'var(--high-text)';
    return 'var(--critical-text)';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={dimension} height={dimension} className="-rotate-90">
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </svg>
      <span
        className="absolute font-semibold text-text-primary"
        style={{ fontSize }}
      >
        {value}%
      </span>
    </div>
  );
}
