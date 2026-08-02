'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import {
  BarChart3,
  Clock,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Filter,
  Info,
} from 'lucide-react';

interface TimeSlotData {
  time: string;
  hourLabel: string;
  peakAlerts: number; // Critical + High severity
  mediumAlerts: number; // Medium severity
  lowAlerts: number;
  details: {
    primaryVector: string;
    attackType: string;
    topIp: string;
  };
}

const HOURLY_DATA_24H: TimeSlotData[] = [
  { time: '00:00', hourLabel: '00:00 - 01:00', peakAlerts: 2, mediumAlerts: 6, lowAlerts: 14, details: { primaryVector: 'SSH Brute Force', attackType: 'Failed Auth', topIp: '185.220.101.5' } },
  { time: '01:00', hourLabel: '01:00 - 02:00', peakAlerts: 1, mediumAlerts: 5, lowAlerts: 12, details: { primaryVector: 'Port Scan', attackType: 'Reconnaissance', topIp: '45.155.204.18' } },
  { time: '02:00', hourLabel: '02:00 - 03:00', peakAlerts: 3, mediumAlerts: 8, lowAlerts: 15, details: { primaryVector: 'FTP Enumeration', attackType: 'Scan', topIp: '185.220.101.5' } },
  { time: '03:00', hourLabel: '03:00 - 04:00', peakAlerts: 1, mediumAlerts: 4, lowAlerts: 10, details: { primaryVector: 'ICMP Ping Sweep', attackType: 'Discovery', topIp: '91.234.56.78' } },
  { time: '04:00', hourLabel: '04:00 - 05:00', peakAlerts: 0, mediumAlerts: 3, lowAlerts: 9, details: { primaryVector: 'DNS Query Burst', attackType: 'Anomaly', topIp: '103.42.180.5' } },
  { time: '05:00', hourLabel: '05:00 - 06:00', peakAlerts: 2, mediumAlerts: 7, lowAlerts: 11, details: { primaryVector: 'SSH Brute Force', attackType: 'Credential Attack', topIp: '185.234.72.19' } },
  { time: '06:00', hourLabel: '06:00 - 07:00', peakAlerts: 4, mediumAlerts: 9, lowAlerts: 18, details: { primaryVector: 'RDP Login Spray', attackType: 'Credential Attack', topIp: '185.220.101.5' } },
  { time: '07:00', hourLabel: '07:00 - 08:00', peakAlerts: 5, mediumAlerts: 11, lowAlerts: 22, details: { primaryVector: 'API Auth Anomaly', attackType: 'Valid Accounts', topIp: '45.155.204.18' } },
  { time: '08:00', hourLabel: '08:00 - 09:00', peakAlerts: 7, mediumAlerts: 14, lowAlerts: 35, details: { primaryVector: 'SQLi Attempt', attackType: 'Web Exploitation', topIp: '185.220.101.5' } },
  { time: '09:00', hourLabel: '09:00 - 10:00', peakAlerts: 9, mediumAlerts: 18, lowAlerts: 40, details: { primaryVector: 'SQL Injection', attackType: 'Exploitation', topIp: '185.220.101.5' } },
  { time: '10:00', hourLabel: '10:00 - 11:00', peakAlerts: 11, mediumAlerts: 22, lowAlerts: 42, details: { primaryVector: 'Privilege Escalation Attempt', attackType: 'Lateral Move', topIp: '185.220.101.5' } },
  { time: '11:00', hourLabel: '11:00 - 12:00', peakAlerts: 8, mediumAlerts: 16, lowAlerts: 38, details: { primaryVector: 'HTTP Directory Traversal', attackType: 'Path Traversal', topIp: '194.180.174.22' } },
  { time: '12:00', hourLabel: '12:00 - 13:00', peakAlerts: 6, mediumAlerts: 15, lowAlerts: 36, details: { primaryVector: 'SSH Dictionary Attack', attackType: 'Brute Force', topIp: '45.155.204.18' } },
  { time: '13:00', hourLabel: '13:00 - 14:00', peakAlerts: 12, mediumAlerts: 24, lowAlerts: 45, details: { primaryVector: 'Database SQLi Spike', attackType: 'SQL Injection', topIp: '185.220.101.5' } },
  { time: '14:00', hourLabel: '14:00 - 15:00', peakAlerts: 15, mediumAlerts: 28, lowAlerts: 52, details: { primaryVector: "SQLi (' OR '1'='1) & Lateral Move", attackType: 'Multi-Stage Exploit', topIp: '185.220.101.5' } },
  { time: '15:00', hourLabel: '15:00 - 16:00', peakAlerts: 14, mediumAlerts: 26, lowAlerts: 48, details: { primaryVector: 'Unauthorized SSH/FTP Access', attackType: 'Account Compromise', topIp: '185.220.101.5' } },
  { time: '16:00', hourLabel: '16:00 - 17:00', peakAlerts: 10, mediumAlerts: 20, lowAlerts: 40, details: { primaryVector: 'Exfiltration Attempt', attackType: 'Data Transfer', topIp: '185.220.101.5' } },
  { time: '17:00', hourLabel: '17:00 - 18:00', peakAlerts: 7, mediumAlerts: 16, lowAlerts: 35, details: { primaryVector: 'Suspicious DNS Tunnel', attackType: 'Exfiltration', topIp: '91.234.56.78' } },
  { time: '18:00', hourLabel: '18:00 - 19:00', peakAlerts: 5, mediumAlerts: 12, lowAlerts: 28, details: { primaryVector: 'Port Scan Sweep', attackType: 'Reconnaissance', topIp: '185.234.72.19' } },
  { time: '19:00', hourLabel: '19:00 - 20:00', peakAlerts: 4, mediumAlerts: 10, lowAlerts: 24, details: { primaryVector: 'Failed Admin Auth', attackType: 'Brute Force', topIp: '45.155.204.18' } },
  { time: '20:00', hourLabel: '20:00 - 21:00', peakAlerts: 3, mediumAlerts: 8, lowAlerts: 20, details: { primaryVector: 'FTP Login Spray', attackType: 'Credential Access', topIp: '185.220.101.5' } },
  { time: '21:00', hourLabel: '21:00 - 22:00', peakAlerts: 2, mediumAlerts: 7, lowAlerts: 16, details: { primaryVector: 'Automated Vulnerability Scan', attackType: 'Scanner Traffic', topIp: '103.42.180.5' } },
  { time: '22:00', hourLabel: '22:00 - 23:00', peakAlerts: 3, mediumAlerts: 6, lowAlerts: 15, details: { primaryVector: 'SSH Root Spray', attackType: 'Brute Force', topIp: '185.220.101.5' } },
  { time: '23:00', hourLabel: '23:00 - 24:00', peakAlerts: 2, mediumAlerts: 5, lowAlerts: 12, details: { primaryVector: 'SMB Port Enum', attackType: 'Scan', topIp: '91.234.56.78' } },
];

const BI_HOURLY_DATA: TimeSlotData[] = [
  { time: '00:00', hourLabel: '00:00 - 02:00', peakAlerts: 3, mediumAlerts: 11, lowAlerts: 26, details: { primaryVector: 'SSH Brute Force & Scan', attackType: 'Failed Auth / Recon', topIp: '185.220.101.5' } },
  { time: '02:00', hourLabel: '02:00 - 04:00', peakAlerts: 4, mediumAlerts: 12, lowAlerts: 25, details: { primaryVector: 'FTP Enum & ICMP Ping', attackType: 'Scan / Discovery', topIp: '185.220.101.5' } },
  { time: '04:00', hourLabel: '04:00 - 06:00', peakAlerts: 2, mediumAlerts: 10, lowAlerts: 20, details: { primaryVector: 'DNS Burst & SSH Brute Force', attackType: 'Credential Attack', topIp: '185.234.72.19' } },
  { time: '06:00', hourLabel: '06:00 - 08:00', peakAlerts: 9, mediumAlerts: 20, lowAlerts: 40, details: { primaryVector: 'RDP Login Spray & API Auth', attackType: 'Credential Attack', topIp: '185.220.101.5' } },
  { time: '08:00', hourLabel: '08:00 - 10:00', peakAlerts: 16, mediumAlerts: 32, lowAlerts: 75, details: { primaryVector: 'SQLi Attempt & Injection', attackType: 'Web Exploitation', topIp: '185.220.101.5' } },
  { time: '10:00', hourLabel: '10:00 - 12:00', peakAlerts: 19, mediumAlerts: 38, lowAlerts: 80, details: { primaryVector: 'Privilege Esc & Path Traversal', attackType: 'Lateral Move', topIp: '185.220.101.5' } },
  { time: '12:00', hourLabel: '12:00 - 14:00', peakAlerts: 18, mediumAlerts: 39, lowAlerts: 81, details: { primaryVector: 'Database SQLi Spike', attackType: 'SQL Injection', topIp: '185.220.101.5' } },
  { time: '14:00', hourLabel: '14:00 - 16:00', peakAlerts: 29, mediumAlerts: 54, lowAlerts: 100, details: { primaryVector: "SQLi (' OR '1'='1) & Account Comp.", attackType: 'Multi-Stage Exploit', topIp: '185.220.101.5' } },
  { time: '16:00', hourLabel: '16:00 - 18:00', peakAlerts: 17, mediumAlerts: 36, lowAlerts: 75, details: { primaryVector: 'Exfiltration & DNS Tunnel', attackType: 'Data Exfiltration', topIp: '185.220.101.5' } },
  { time: '18:00', hourLabel: '18:00 - 20:00', peakAlerts: 9, mediumAlerts: 22, lowAlerts: 52, details: { primaryVector: 'Port Sweep & Failed Auth', attackType: 'Reconnaissance', topIp: '45.155.204.18' } },
  { time: '20:00', hourLabel: '20:00 - 22:00', peakAlerts: 5, mediumAlerts: 15, lowAlerts: 36, details: { primaryVector: 'FTP Spray & Vuln Scan', attackType: 'Credential Access', topIp: '103.42.180.5' } },
  { time: '22:00', hourLabel: '22:00 - 24:00', peakAlerts: 5, mediumAlerts: 11, lowAlerts: 27, details: { primaryVector: 'SSH Root Spray & SMB Enum', attackType: 'Brute Force', topIp: '185.220.101.5' } },
];

export default function AlertTimeOfDayChart() {
  const [resolution, setResolution] = useState<'hourly' | 'bihourly'>('bihourly');
  const [filterMode, setFilterMode] = useState<'all' | 'peak' | 'medium'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(7); // Default to 14:00-16:00 peak interval

  const data = resolution === 'hourly' ? HOURLY_DATA_24H : BI_HOURLY_DATA;
  const maxPeak = Math.max(...data.map((d) => d.peakAlerts), 1);
  const maxMedium = Math.max(...data.map((d) => d.mediumAlerts), 1);
  const maxTotal = Math.max(...data.map((d) => d.peakAlerts + d.mediumAlerts), 1);

  const totalPeakAlerts = data.reduce((sum, d) => sum + d.peakAlerts, 0);
  const totalMediumAlerts = data.reduce((sum, d) => sum + d.mediumAlerts, 0);

  const selectedSlot = data[hoveredIndex !== null ? hoveredIndex : selectedIndex] || data[0];

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-surface border border-border-default rounded-xl p-6 shadow-[var(--shadow-1)] space-y-6 mb-6"
    >
      {/* Header with Title and Filter Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-critical-text animate-pulse-dot" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              24-HOUR VISUAL REPORT | ALL TIMINGS OF DAY
            </span>
          </div>
          <h3 className="text-h2 text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            SOC Alert Intensity — Peak Alerts &amp; Medium Alerts by Time of Day
          </h3>
          <p className="text-small text-text-secondary mt-1">
            Visual breakdown of Peak alerts (Critical &amp; High severity) and Medium alerts across all timings of the day.
          </p>
        </div>

        {/* Controls: Resolution & Alert Severity Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Resolution toggle */}
          <div className="flex rounded-lg bg-surface-secondary border border-border-default p-0.5">
            <button
              onClick={() => {
                setResolution('bihourly');
                setSelectedIndex(7);
              }}
              className={`px-3 py-1.5 rounded-md text-small font-medium transition-all ${
                resolution === 'bihourly'
                  ? 'bg-accent text-white shadow-[var(--shadow-1)]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              2-Hour Timings
            </button>
            <button
              onClick={() => {
                setResolution('hourly');
                setSelectedIndex(14);
              }}
              className={`px-3 py-1.5 rounded-md text-small font-medium transition-all ${
                resolution === 'hourly'
                  ? 'bg-accent text-white shadow-[var(--shadow-1)]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              24-Hour Hourly
            </button>
          </div>

          {/* Severity filter toggle */}
          <div className="flex rounded-lg bg-surface-secondary border border-border-default p-0.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md text-small font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-surface border border-border-default text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilterMode('peak')}
              className={`px-3 py-1.5 rounded-md text-small font-medium transition-all flex items-center gap-1.5 ${
                filterMode === 'peak'
                  ? 'bg-critical-bg border border-critical-border text-critical-text shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-critical-text" />
              Peak Alerts Only
            </button>
            <button
              onClick={() => setFilterMode('medium')}
              className={`px-3 py-1.5 rounded-md text-small font-medium transition-all flex items-center gap-1.5 ${
                filterMode === 'medium'
                  ? 'bg-medium-bg border border-medium-border text-medium-text shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-medium-text" />
              Medium Alerts Only
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlight Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-secondary border border-border-subtle rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-caption text-text-tertiary">PEAK ALERT TIME WINDOW</span>
            <p className="text-mono text-[18px] text-critical-text font-bold mt-1">
              14:00 - 16:00 UTC
            </p>
            <p className="text-[11px] text-text-secondary mt-0.5">
              29 Peak Alerts | SQLi &amp; Lateral Move
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-critical-bg border border-critical-border flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-critical-text" />
          </div>
        </div>

        <div className="bg-surface-secondary border border-border-subtle rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-caption text-text-tertiary">TOTAL DAILY ALERT VOLUME</span>
            <p className="text-mono text-[18px] text-text-primary font-bold mt-1">
              {totalPeakAlerts} Peak <span className="text-text-tertiary">/</span> {totalMediumAlerts} Medium
            </p>
            <p className="text-[11px] text-text-secondary mt-0.5">
              436 Total correlated security events
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-medium-bg border border-medium-border flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-medium-text" />
          </div>
        </div>

        <div className="bg-surface-secondary border border-border-subtle rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-caption text-text-tertiary">PRIMARY HOSTILE SOURCE</span>
            <p className="text-mono text-[18px] text-text-primary font-bold mt-1">
              IP 185.220.101.5
            </p>
            <p className="text-[11px] text-critical-text mt-0.5 font-medium">
              Risk Score 100/100 — Multi-Stage Attack
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent-muted flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-accent" />
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="bg-surface-secondary/40 border border-border-subtle rounded-xl p-6 relative">
        {/* Selected / Hovered Summary Popover Bar */}
        <div className="mb-6 p-4 rounded-xl bg-surface border border-border-default shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-secondary border border-border-default flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-mono font-semibold text-text-primary">
                  {selectedSlot.hourLabel} UTC
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-surface-secondary text-text-secondary border border-border-subtle">
                  Top IP: {selectedSlot.details.topIp}
                </span>
              </div>
              <p className="text-[12px] text-text-secondary mt-0.5">
                Primary Attack Vector: <span className="text-text-primary font-medium">{selectedSlot.details.primaryVector}</span> ({selectedSlot.details.attackType})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-caption text-text-tertiary block">PEAK ALERTS (CRITICAL/HIGH)</span>
              <span className="text-mono text-[18px] font-bold text-critical-text">
                {selectedSlot.peakAlerts} incidents
              </span>
            </div>
            <div className="w-px h-8 bg-border-default hidden sm:block" />
            <div className="text-right">
              <span className="text-caption text-text-tertiary block">MEDIUM ALERTS</span>
              <span className="text-mono text-[18px] font-bold text-medium-text">
                {selectedSlot.mediumAlerts} incidents
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visual Representation */}
        <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3 pt-6 px-2 border-b border-border-default">
          {data.map((slot, index) => {
            const isHovered = hoveredIndex === index;
            const isSelected = selectedIndex === index;
            const isActive = isHovered || isSelected;

            // Calculate heights as percentages of max
            const peakHeight = Math.max(8, Math.round((slot.peakAlerts / maxPeak) * 100));
            const mediumHeight = Math.max(8, Math.round((slot.mediumAlerts / maxMedium) * 100));

            return (
              <div
                key={slot.time}
                onClick={() => setSelectedIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group relative"
              >
                {/* Hover tooltip for small screens or quick inspect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: -8 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-12 z-20 bg-surface border border-border-default rounded-lg px-2.5 py-1.5 shadow-[var(--shadow-2)] text-center whitespace-nowrap pointer-events-none"
                    >
                      <p className="text-[10px] font-mono font-bold text-text-primary">{slot.time} UTC</p>
                      <p className="text-[10px] font-mono text-critical-text">
                        {slot.peakAlerts} Peak <span className="text-text-tertiary">|</span> <span className="text-medium-text">{slot.mediumAlerts} Med</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bar group (grouped column bar chart) */}
                <div className="flex items-end gap-1 w-full max-w-[36px] h-[190px]">
                  {/* Peak Alerts Bar */}
                  {(filterMode === 'all' || filterMode === 'peak') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${peakHeight}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-t from-critical-bg to-critical-text shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                          : 'bg-critical-text/80 group-hover:bg-critical-text'
                      }`}
                      title={`${slot.peakAlerts} Peak Alerts at ${slot.time}`}
                    />
                  )}

                  {/* Medium Alerts Bar */}
                  {(filterMode === 'all' || filterMode === 'medium') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${mediumHeight}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-t from-medium-bg to-medium-text shadow-[0_0_12px_rgba(245,158,11,0.45)]'
                          : 'bg-medium-text/75 group-hover:bg-medium-text'
                      }`}
                      title={`${slot.mediumAlerts} Medium Alerts at ${slot.time}`}
                    />
                  )}
                </div>

                {/* X-Axis Time Label */}
                <span
                  className={`text-[10px] font-mono transition-colors ${
                    isActive
                      ? 'text-text-primary font-bold'
                      : 'text-text-tertiary group-hover:text-text-secondary'
                  }`}
                >
                  {slot.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-critical-text shadow-sm" />
              <span className="text-small font-medium text-text-primary">Peak Alerts (Critical / High)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-medium-text shadow-sm" />
              <span className="text-small font-medium text-text-primary">Medium Alerts</span>
            </div>
          </div>
          <div className="text-caption text-text-tertiary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-accent" />
            Click any bar to inspect specific time of day threat vectors
          </div>
        </div>
      </div>
    </motion.div>
  );
}
