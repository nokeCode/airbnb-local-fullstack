// components/onboarding/ProgressBar.tsx
'use client';

import { motion } from 'framer-motion';

interface Props {
  progress: number;
}

export function ProgressBar({ progress }: Props) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}