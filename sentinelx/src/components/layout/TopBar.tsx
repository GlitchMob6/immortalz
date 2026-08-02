'use client';

import { cn } from '@/lib/utils';
import { Shield, Search, User } from 'lucide-react';

interface TopBarProps {
  activeTab: 'dashboard' | 'investigations' | 'reports';
  onTabChange?: (tab: 'dashboard' | 'investigations' | 'reports') => void;
  onCommandPalette?: () => void;
}

export default function TopBar({ activeTab, onTabChange, onCommandPalette }: TopBarProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'investigations' as const, label: 'Investigations' },
    { id: 'reports' as const, label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-50 h-14 bg-surface/80 backdrop-blur-md border-b border-border-default flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold text-text-primary tracking-tight">
            Veritas
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 ml-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150',
                activeTab === tab.id
                  ? 'text-text-primary bg-surface-secondary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Command palette trigger */}
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-surface-tertiary hover:bg-surface-secondary transition-colors duration-150 text-[13px] text-text-tertiary"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="ml-2 px-1.5 py-0.5 rounded bg-surface border border-border-default text-[10px] font-mono text-text-tertiary">
            ⌘K
          </kbd>
        </button>

        {/* User avatar */}
        <button className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center hover:bg-accent-muted transition-colors duration-150">
          <User className="w-4 h-4 text-accent" />
        </button>
      </div>
    </header>
  );
}
