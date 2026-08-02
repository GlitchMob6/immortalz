'use client';

import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'outlined' | 'ghost';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = true, padding = 'md', className, children, ...props }, ref) => {
    const paddingMap = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantStyles = {
      default: 'bg-surface border border-border-default rounded-xl shadow-[var(--shadow-1)]',
      outlined: 'bg-transparent border border-border-default rounded-xl',
      ghost: 'bg-transparent rounded-xl',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingMap[padding],
          hover && 'transition-all duration-200 hover:shadow-[var(--shadow-2)] hover:-translate-y-[2px]',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
