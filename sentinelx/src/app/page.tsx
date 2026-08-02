'use client';

import { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/layout/TopBar';
import Greeting from '@/components/landing/Greeting';
import StatsGrid from '@/components/landing/StatsGrid';
import InvestigationInput from '@/components/landing/InvestigationInput';
import SuggestedPrompts from '@/components/landing/SuggestedPrompts';
import RecentInvestigations from '@/components/landing/RecentInvestigations';
import CommandPalette from '@/components/shared/CommandPalette';

// Investigation workspace components
import InvestigationLog from '@/components/layout/InvestigationLog';
import AITeamPanel from '@/components/agents/AITeamPanel';
import Pipeline from '@/components/investigation/Pipeline';
import IncidentSummary from '@/components/investigation/IncidentSummary';
import AttackTimeline from '@/components/investigation/AttackTimeline';
import MitreMapping from '@/components/investigation/MitreMapping';
import EvidencePanel from '@/components/investigation/EvidencePanel';
import QueryVisualization from '@/components/investigation/QueryVisualization';
import ThreatMap from '@/components/investigation/ThreatMap';
import ThreatPrediction from '@/components/investigation/ThreatPrediction';
import Recommendations from '@/components/investigation/Recommendations';

import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'investigation';

export default function HomePage() {
  const [view, setView] = useState<View>('dashboard');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'investigations' | 'reports'>('dashboard');

  // Workspace card visibility state (progressive reveal)
  const [visibleCards, setVisibleCards] = useState(0);

  const handleInvestigate = useCallback((query: string) => {
    setView('investigation');
    setActiveTab('investigations');
    setVisibleCards(0);

    // Progressively reveal investigation cards
    const delays = [800, 1800, 2800, 3600, 4400, 5200, 6000, 6800];
    delays.forEach((delay, i) => {
      setTimeout(() => setVisibleCards((prev) => Math.max(prev, i + 1)), delay);
    });
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setView('dashboard');
    setActiveTab('dashboard');
  }, []);

  // Ctrl+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      <TopBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'dashboard') handleBackToDashboard();
        }}
        onCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onAction={(id) => {
          if (id === 'new') handleInvestigate("Investigate today's highest risk incident");
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — Investigation Log */}
        <aside className="w-[360px] border-r border-border-default bg-surface flex-shrink-0 overflow-hidden flex flex-col">
          <InvestigationLog onNewQuery={handleInvestigate} />
        </aside>

        {/* CENTER — Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-canvas">
          <AnimatePresence mode="wait">
            {view === 'dashboard' ? (
              /* ═══════ LANDING DASHBOARD ═══════ */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-5 pb-16 max-w-5xl mx-auto"
              >
                <Greeting />
                <StatsGrid />
                <InvestigationInput onSubmit={handleInvestigate} variant="landing" />
                <SuggestedPrompts onSelect={handleInvestigate} />
                <RecentInvestigations />
              </motion.div>
            ) : (
              /* ═══════ INVESTIGATION WORKSPACE ═══════ */
              <motion.div
                key="investigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-5"
              >
                <div className="max-w-3xl mx-auto">
                  {/* Pipeline always shows first */}
                  <Pipeline />

                  {/* Progressive card reveal */}
                  <AnimatePresence>
                    {visibleCards >= 1 && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <IncidentSummary />
                      </motion.div>
                    )}

                    {visibleCards >= 2 && (
                      <motion.div
                        key="timeline"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <AttackTimeline />
                      </motion.div>
                    )}

                    {visibleCards >= 3 && (
                      <motion.div
                        key="mitre"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <MitreMapping />
                      </motion.div>
                    )}

                    {visibleCards >= 4 && (
                      <motion.div
                        key="evidence"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <EvidencePanel />
                      </motion.div>
                    )}

                    {visibleCards >= 5 && (
                      <motion.div
                        key="query"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <QueryVisualization />
                      </motion.div>
                    )}

                    {visibleCards >= 6 && (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ThreatMap />
                      </motion.div>
                    )}

                    {visibleCards >= 7 && (
                      <motion.div
                        key="prediction"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ThreatPrediction />
                      </motion.div>
                    )}

                    {visibleCards >= 8 && (
                      <motion.div
                        key="recommendations"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Recommendations />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT — AI Investigation Team */}
        <aside className="w-[290px] border-l border-border-default bg-canvas flex-shrink-0 overflow-y-auto px-4 py-5">
          <AITeamPanel />
        </aside>
      </div>
    </div>
  );
}
