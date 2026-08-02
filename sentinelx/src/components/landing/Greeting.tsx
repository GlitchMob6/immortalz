'use client';

import { getGreeting } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useStats } from '@/lib/liveData';

export default function Greeting() {
  const stats = useStats();

  const eventsProcessed = stats?.events_processed ?? 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="text-center pt-16 pb-8"
    >
      <motion.h1
        variants={fadeInUp}
        className="text-display text-text-primary mb-3"
      >
        {getGreeting()}.
      </motion.h1>
      <motion.p
        variants={fadeInUp}
        className="text-[17px] text-text-secondary font-normal"
      >
        <span className="text-text-primary font-medium">
          {eventsProcessed.toLocaleString()}
        </span>{' '}
        security events processed today.
      </motion.p>
    </motion.div>
  );
}
