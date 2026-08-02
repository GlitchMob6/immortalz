'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { mitreTactics, type MitreTactic } from '@/data/mockData';
import { useState } from 'react';
import { X } from 'lucide-react';

function TacticChip({ tactic }: { tactic: MitreTactic }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <motion.button
        variants={fadeInUp}
        onClick={() => setShowDetail(true)}
        className={`
          relative px-4 py-2.5 rounded-lg border text-[13px] font-medium
          transition-all duration-200 text-left
          ${
            tactic.detected
              ? 'bg-critical-bg border-critical-border text-critical-text hover:shadow-[var(--shadow-2)] hover:scale-[1.02]'
              : 'bg-surface-secondary border-border-default text-text-tertiary hover:bg-surface-tertiary'
          }
        `}
      >
        <span>{tactic.name}</span>
        {tactic.detected && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-critical-text" />
        )}
      </motion.button>

      {/* Detail overlay */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-xl border border-border-default shadow-[var(--shadow-3)] p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-mono text-[11px] text-text-tertiary mb-1">{tactic.id}</p>
                  <h3 className="text-h3">{tactic.name}</h3>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="w-7 h-7 rounded-lg hover:bg-surface-secondary flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-caption mb-3">TECHNIQUES DETECTED</p>
                {tactic.techniques.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-secondary text-[13px]"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${tactic.detected ? 'bg-critical-text' : 'bg-border-default'}`} />
                    <span className="text-text-primary">{tech}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <span className={`text-[12px] font-medium ${tactic.detected ? 'text-critical-text' : 'text-text-tertiary'}`}>
                  {tactic.detected ? '● Detected in this incident' : '○ Not detected'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function MitreMapping() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-caption text-text-tertiary">MITRE ATT&CK MAPPING</h3>
        <span className="text-[12px] text-text-tertiary">
          {mitreTactics.filter((t) => t.detected).length}/{mitreTactics.length} tactics detected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {mitreTactics.map((tactic) => (
          <TacticChip key={tactic.id} tactic={tactic} />
        ))}
      </div>
    </motion.div>
  );
}
