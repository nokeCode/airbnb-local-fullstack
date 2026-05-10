'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Home, 
  TrendingUp, 
  Shield, 
  MapPin, 
  Clock,
  Building
} from 'lucide-react';
import { OnboardingData } from '../OnboardingContainer';

const goals = [
  { id: 'rental', label: 'Revenus locatifs', icon: DollarSign },
  { id: 'flipping', label: 'Revente rapide', icon: TrendingUp },
  { id: 'primary', label: 'Résidence principale', icon: Home },
  { id: 'secondary', label: 'Résidence secondaire', icon: Building },
  { id: 'diversification', label: 'Diversification', icon: Shield },
  { id: 'location', label: 'Meilleure localisation', icon: MapPin },
  { id: 'longterm', label: 'Patrimoine long terme', icon: Clock },
];

interface Props {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string[]) => void;
}

export function GoalsQuestion({ data, updateData }: Props) {
  const toggleGoal = (goalId: string) => {
    const newGoals = data.goals.includes(goalId)
      ? data.goals.filter(g => g !== goalId)
      : [...data.goals, goalId];
    updateData('goals', newGoals);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        Sélectionnez vos objectifs d'investissement (plusieurs choix possibles)
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {goals.map((goal, idx) => {
          const Icon = goal.icon;
          const isSelected = data.goals.includes(goal.id);
          
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleGoal(goal.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{goal.label}</span>
            </motion.button>
          );
        })}
      </div>

      {data.goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gray-100 rounded-xl text-center text-sm text-gray-600"
        >
          {data.goals.length} objectif{data.goals.length > 1 ? 's' : ''} sélectionné{data.goals.length > 1 ? 's' : ''}
        </motion.div>
      )}
    </div>
  );
}