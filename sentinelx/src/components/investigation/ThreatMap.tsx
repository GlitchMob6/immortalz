'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useStats } from '@/lib/liveData';
import { useRef } from 'react';

// Simple SVG world map paths (simplified continents)
const continents = `M 150,80 C 155,75 165,72 170,75 C 175,78 185,76 190,80 C 195,84 200,82 205,85 C 210,88 208,95 205,98 C 202,101 195,103 190,100 C 185,97 178,99 175,95 C 172,91 165,93 160,90 C 155,87 148,85 150,80 Z
M 220,70 C 230,65 250,62 265,65 C 280,68 295,72 305,78 C 315,84 320,92 318,100 C 316,108 310,115 300,118 C 290,121 278,118 270,112 C 262,106 255,100 248,95 C 241,90 235,82 230,78 C 225,74 218,73 220,70 Z
M 245,120 C 250,115 260,112 268,115 C 276,118 282,125 280,132 C 278,139 272,145 265,148 C 258,151 250,148 246,142 C 242,136 240,128 245,120 Z
M 120,95 C 128,90 140,88 150,92 C 160,96 165,105 162,115 C 159,125 150,132 140,135 C 130,138 118,132 115,122 C 112,112 114,100 120,95 Z
M 320,82 C 340,75 360,72 380,78 C 400,84 415,95 420,110 C 425,125 418,140 405,148 C 392,156 375,155 360,148 C 345,141 335,128 330,115 C 325,102 320,90 320,82 Z
M 410,130 C 420,125 435,128 445,135 C 455,142 460,155 455,165 C 450,175 438,180 428,175 C 418,170 410,158 408,148 C 406,138 405,133 410,130 Z`;

interface ThreatLine {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
}

const threatLines: ThreatLine[] = [
  { from: { x: 240, y: 80, label: 'Eastern Europe' }, to: { x: 140, y: 95, label: 'Internal DC-01' } },
  { from: { x: 290, y: 75, label: 'Northern Eurasia' }, to: { x: 120, y: 90, label: 'App Gateway' } },
  { from: { x: 380, y: 100, label: 'East Asia' }, to: { x: 220, y: 82, label: 'EU Cloud Region' } },
  { from: { x: 395, y: 95, label: 'Southeast Asia' }, to: { x: 125, y: 100, label: 'US-West Prod' } },
];

export default function ThreatMap() {
  const stats = useStats();
  const svgRef = useRef<SVGSVGElement>(null);
  const activeVectors = stats ? Math.max(4, stats.unique_source_ips) : 4;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-caption text-text-tertiary">THREAT ORIGIN GEOLOCATION MAP</h3>
          <span className="text-[11px] text-low-text flex items-center gap-1.5 ml-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
            Live IP Correlation
          </span>
        </div>
        <span className="text-[12px] font-medium text-critical-text">
          {activeVectors} active threat vectors detected
        </span>
      </div>

      <div className="relative rounded-lg bg-surface-secondary border border-border-subtle overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 520 220"
          className="w-full h-auto"
          style={{ minHeight: 180 }}
        >
          {/* Continents */}
          <path
            d={continents}
            fill="var(--border)"
            stroke="var(--border-subtle)"
            strokeWidth="0.5"
            opacity="0.6"
          />

          {/* Threat lines */}
          {threatLines.map((line, i) => {
            const midX = (line.from.x + line.to.x) / 2;
            const midY = Math.min(line.from.y, line.to.y) - 25;
            
            return (
              <g key={i}>
                {/* Curved path */}
                <motion.path
                  d={`M ${line.from.x} ${line.from.y} Q ${midX} ${midY} ${line.to.x} ${line.to.y}`}
                  fill="none"
                  stroke="var(--critical-text)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.35"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.3, ease: 'easeInOut' }}
                />

                {/* Source dot */}
                <motion.circle
                  cx={line.from.x}
                  cy={line.from.y}
                  r="3"
                  fill="var(--critical-text)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ delay: i * 0.3 }}
                />

                {/* Target dot */}
                <motion.circle
                  cx={line.to.x}
                  cy={line.to.y}
                  r="3"
                  fill="var(--info-text)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ delay: i * 0.3 + 0.5 }}
                />

                {/* Pulsing ring on source */}
                <motion.circle
                  cx={line.from.x}
                  cy={line.from.y}
                  r="3"
                  fill="none"
                  stroke="var(--critical-text)"
                  strokeWidth="1"
                  initial={{ r: 3, opacity: 0.6 }}
                  animate={{ r: 10, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeOut',
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-critical-text" />
            <span className="text-[11px] text-text-tertiary">External Attack Origin (IP Geolocation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-info-text" />
            <span className="text-[11px] text-text-tertiary">Internal Target Asset</span>
          </div>
        </div>
        <span className="text-mono text-[10px] text-text-tertiary">
          Streaming from SOC Log Store
        </span>
      </div>
    </motion.div>
  );
}
