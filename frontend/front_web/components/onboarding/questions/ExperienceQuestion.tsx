'use client';

import { motion } from 'framer-motion';
import { Sprout, TreePine, Mountain } from 'lucide-react';
import { OnboardingData } from '../OnboardingContainer';

const experiences = [
  { 
    id: 'beginner', 
    label: 'Débutant', 
    description: 'Je débute dans l\'immobilier',
    icon: Sprout,
    color: 'bg-green-100 text-green-700'
  },
  { 
    id: 'intermediate', 
    label: 'Intermédiaire', 
    description: 'J\'ai quelques années d\'expérience',
    icon: TreePine,
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 'expert', 
    label: 'Expert', 
    description: 'Je suis un professionnel confirmé',
    icon: Mountain,
    color: 'bg-purple-100 text-purple-700'
  },
];

interface Props {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string) => void;
}

export function ExperienceQuestion({ data, updateData }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        Quel est votre niveau d expérience ?
      </p>
      
      <div className="grid gap-4">
        {experiences.map((exp, idx) => {
          const Icon = exp.icon;
          const isSelected = data.experience === exp.id;
          
          return (
            <motion.button
              key={exp.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => updateData('experience', exp.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all text-center ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-xl scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-lg'
              }`}
            >
              <div className={`inline-flex p-4 rounded-full mb-4 ${
                isSelected ? 'bg-white/20' : exp.color
              }`}>
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{exp.label}</h3>
              <p className={isSelected ? 'text-white/80' : 'text-gray-500'}>
                {exp.description}
              </p>
              
              {isSelected && (
                <motion.div
                  layoutId="check"
                  className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center"
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