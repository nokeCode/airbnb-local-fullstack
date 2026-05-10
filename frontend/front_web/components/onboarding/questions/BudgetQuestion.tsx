'use client';

import { motion } from 'framer-motion';
import { Euro } from 'lucide-react';
import { OnboardingData } from '../OnboardingContainer';

const budgets = [
  { id: '0-100k', label: 'Moins de 100 000 €', range: '0 - 100k' },
  { id: '100-300k', label: '100 000 € - 300 000 €', range: '100k - 300k' },
  { id: '300-500k', label: '300 000 € - 500 000 €', range: '300k - 500k' },
  { id: '500k-1m', label: '500 000 € - 1 000 000 €', range: '500k - 1M' },
  { id: '1m+', label: 'Plus de 1 000 000 €', range: '1M+' },
];

interface Props {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string) => void;
}

export function BudgetQuestion({ data, updateData }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        Quel est votre budget d'investissement ?
      </p>
      
      <div className="space-y-3">
        {budgets.map((budget, idx) => {
          const isSelected = data.budget === budget.id;
          
          return (
            <motion.button
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => updateData('budget', budget.id)}
              className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Euro size={20} className={isSelected ? 'text-white' : 'text-gray-600'} />
                </div>
                <span className="font-semibold text-lg">{budget.label}</span>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}