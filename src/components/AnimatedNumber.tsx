'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatting';

interface AnimatedNumberProps {
  value: number;
  formatType?: 'number' | 'currency' | 'percent' | 'multiplier' | 'bps';
  className?: string;
}

export default function AnimatedNumber({ value, formatType = 'number', className = '' }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);

  useEffect(() => {
    const controls = animate(motionValue, value, { 
      duration: 0.3,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value, motionValue]);

  const display = useTransform(motionValue, (current) => {
    if (formatType === 'currency') return formatCurrency(current);
    if (formatType === 'percent') return formatPercent(current);
    if (formatType === 'multiplier') return `${current.toFixed(2)}×`;
    if (formatType === 'bps') return `${current.toFixed(4)}%`;
    return formatNumber(current);
  });

  return <motion.span className={className}>{display}</motion.span>;
}
