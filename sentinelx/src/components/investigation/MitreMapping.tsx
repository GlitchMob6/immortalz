'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useStats } from '@/lib/liveData';
import { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface MitreTactic {
  id: string;
  name: string;
  techniques: string[];
  detected: boolean;
  activeCount: number;
}

export default function MitreMapping() {
  const stats = useStats();
  const eb = stats?.event_breakdown || {};

  const failedLogins = eb['failed_login'] || 0;
  const portScans = eb['port_scan'] || 0;
  const payloads = eb['suspicious_payload'] || 0;

  const tactics: MitreTactic[] = [
    {
      id: 'TA0043',
      name: 'Reconnaissance',
      techniques: ['Active Scanning', 'Gather Victim Identity'],
      detected: portScans > 0,
      activeCount: portScans,
    },
    {
      id: 'TA0001',
      name: 'Initial Access',
      techniques: ['Valid Accounts', 'Brute Force'],
      detected: failedLogins > 0 || payloads > 0,
      activeCount: failedLogins + payloads,
    },
    {
      id: 'TA0002',
      name: 'Execution',
      techniques: ['PowerShell', 'Command Line Interface'],
      detected: payloads > 0,
      activeCount: payloads,
    },
    {
      id: 'TA0003',
      name: 'Persistence',
      techniques: ['Registry Run Keys', 'Scheduled Task'],
      detected: payloads > 5,
      activeCount: Math.floor(payloads / 2),
    },
    {
      id: 'TA0004',
      name: 'Privilege Escalation',
      techniques: ['Access Token Manipulation'],
      detected: failedLogins > 10,
      activeCount: Math.floor(failedLogins / 3),
    },
    {
      id: 'TA0005',
      name: 'Defense Evasion',
      techniques: ['Disable Security Tools', 'Obfuscated Files'],
      detected: payloads > 0,
      activeCount: payloads,
    },
    {
      id: 'TA0006',
      name: 'Credential Access',
      techniques: ['OS Credential Dumping', 'Brute Force'],
      detected: failedLogins > 0,
      activeCount: failedLogins,
    },
    {
      id: 'TA0008',
      name: 'Lateral Movement',
      techniques: ['Remote Desktop Protocol', 'SMB/Windows Admin Shares'],
      detected: failedLogins > 5 || payloads > 3,
      activeCount: Math.max(1, Math.floor((failedLogins + payloads) / 4)),
    },
    {
      id: 'TA0010',
      name: 'Exfiltration',
      techniques: ['Exfiltration Over Alternative Protocol (DNS)'],
      detected: payloads > 2,
      activeCount: Math.max(1, Math.floor(payloads / 2)),
    },
    {
      id: 'TA0040',
      name: 'Impact',
      techniques: ['Data Encrypted for Impact'],
      detected: payloads > 10,
      activeCount: Math.floor(payloads / 5),
    },
  ];

  const detectedCount = tactics.filter(t => t.detected).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] mb-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-caption text-text-tertiary">MITRE ATT&CK FRAMEWORK MAPPING</h3>
          <span className="text-[11px] text-low-text flex items-center gap-1.5 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-low-text animate-pulse-dot" />
            Live Telemetry
          </span>
        </div>
        <span className="text-[12px] font-medium text-critical-text">
          {detectedCount} of {tactics.length} Tactics Active
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {tactics.map((tactic) => (
          <TacticChip key={tactic.id} tactic={tactic} />
        ))}
      </div>
    </motion.div>
  );
}

function TacticChip({ tactic }: { tactic: MitreTactic }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <motion.button
        variants={fadeInUp}
        onClick={() => setShowDetail(true)}
        className={`
          relative px-4 py-2.5 rounded-lg border text-[13px] font-medium
          transition-all duration-200 text-left flex items-center gap-2
          ${
            tactic.detected
              ? 'bg-critical-bg border-critical-border text-critical-text hover:shadow-[var(--shadow-2)] hover:scale-[1.02]'
              : 'bg-surface-secondary border-border-default text-text-tertiary hover:bg-surface-tertiary'
          }
        `}
      >
        <span>{tactic.name}</span>
        {tactic.detected && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-critical-text text-white font-mono">
            {tactic.activeCount}
          </span>
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

              <div className="mb-5">
                <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-2 font-medium">
                  Detected Techniques in Live Stream
                </p>
                <div className="space-y-2">
                  {tactic.techniques.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border-subtle"
                    >
                      <span className="text-[13px] text-text-primary font-medium">{tech}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-critical-bg text-critical-text font-medium">
                        {tactic.detected ? 'Active in Telemetry' : 'Monitored'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-critical-text" />
                  <span className="text-small font-medium text-text-primary">
                    {tactic.detected ? `${tactic.activeCount} live event correlation hits` : 'No anomalies detected'}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-[12px] font-medium text-text-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
