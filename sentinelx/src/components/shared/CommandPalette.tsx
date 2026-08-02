'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { commandPaletteItems } from '@/data/mockData';
import { useEffect, useState, useCallback } from 'react';
import { Search, FileSearch, Zap, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: (actionId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commandPaletteItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        onAction?.(filtered[selectedIndex].id);
        onClose();
      }
    },
    [filtered, selectedIndex, onClose, onAction]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setQuery('');
      setSelectedIndex(0);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/10 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-xl border border-border-default shadow-[var(--shadow-3)] w-full max-w-lg overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-border-default">
              <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search investigations, actions..."
                className="flex-1 h-12 bg-transparent border-none outline-none text-[14px] text-text-primary placeholder:text-text-tertiary"
              />
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-surface-secondary transition-colors"
              >
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center text-[13px] text-text-tertiary py-8">
                  No results found
                </p>
              ) : (
                <>
                  {/* Group: Investigations */}
                  {filtered.some((item) => item.type === 'investigation') && (
                    <div className="px-3 mb-1">
                      <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium px-2 py-1">
                        Investigations
                      </p>
                      {filtered
                        .filter((item) => item.type === 'investigation')
                        .map((item, i) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onAction?.(item.id);
                              onClose();
                            }}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors
                              ${selectedIndex === i ? 'bg-accent-light' : 'hover:bg-surface-secondary'}`}
                          >
                            <FileSearch className="w-4 h-4 text-text-tertiary" />
                            <div className="flex-1">
                              <span className="text-[13px] text-text-primary">{item.label}</span>
                              <span className="text-mono text-[11px] text-text-tertiary ml-2">
                                {item.id}
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Group: Actions */}
                  {filtered.some((item) => item.type === 'action') && (
                    <div className="px-3 mt-1">
                      <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium px-2 py-1">
                        Actions
                      </p>
                      {filtered
                        .filter((item) => item.type === 'action')
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onAction?.(item.id);
                              onClose();
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left hover:bg-surface-secondary transition-colors"
                          >
                            <Zap className="w-4 h-4 text-text-tertiary" />
                            <span className="text-[13px] text-text-primary flex-1">{item.label}</span>
                            {item.shortcut && (
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border-default text-[10px] font-mono text-text-tertiary">
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border-default flex items-center gap-4 text-[11px] text-text-tertiary">
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-surface-secondary border border-border-default text-[9px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-surface-secondary border border-border-default text-[9px]">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-surface-secondary border border-border-default text-[9px]">Esc</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
