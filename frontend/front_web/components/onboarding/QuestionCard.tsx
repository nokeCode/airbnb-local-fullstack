'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface QuestionCardProps {
  children: ReactNode;
  className?: string;
}

export function QuestionCard({ children, className = '' }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}