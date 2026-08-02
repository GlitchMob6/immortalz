'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface InvestigationInputProps {
  onSubmit: (query: string) => void;
  variant?: 'landing' | 'compact';
  placeholder?: string;
}

export default function InvestigationInput({
  onSubmit,
  variant = 'landing',
  placeholder = 'What would you like to investigate today?',
}: InvestigationInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const isLanding = variant === 'landing';

  return (
    <motion.form
      variants={fadeInUp}
      initial={isLanding ? 'hidden' : undefined}
      animate={isLanding ? 'visible' : undefined}
      onSubmit={handleSubmit}
      className={isLanding ? 'max-w-2xl mx-auto mb-8' : 'w-full'}
    >
      <div
        className={`
          relative flex items-center bg-surface border border-border-default rounded-xl
          shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)] hover:border-accent-muted
          transition-all duration-200 focus-within:border-accent focus-within:shadow-[var(--shadow-2)]
          ${isLanding ? 'h-14' : 'h-11'}
        `}
      >
        <Search className={`${isLanding ? 'w-5 h-5 ml-5' : 'w-4 h-4 ml-4'} text-text-tertiary flex-shrink-0`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`
            flex-1 bg-transparent border-none outline-none
            text-text-primary placeholder:text-text-tertiary
            ${isLanding ? 'text-[15px] px-4' : 'text-[13px] px-3'}
          `}
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className={`
            flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover
            text-white transition-all duration-150
            disabled:opacity-30 disabled:cursor-not-allowed
            ${isLanding ? 'w-10 h-10 mr-2' : 'w-8 h-8 mr-1.5'}
          `}
        >
          <ArrowRight className={isLanding ? 'w-5 h-5' : 'w-4 h-4'} />
        </button>
      </div>
    </motion.form>
  );
}
