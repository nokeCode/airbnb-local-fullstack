// components/onboarding/questions/RoleQuestion.tsx
'use client';

import { motion } from 'framer-motion';
import { User, Home, Building2, TrendingUp, Key } from 'lucide-react';
import { OnboardingData } from '../OnboardingContainer';

interface Props {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
}

const roles = [
  { 
    id: 'tenant', 
    label: 'Locataire', 
    description: 'Je recherche un logement',
    icon: Key,
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconColor: 'text-blue-600',
    selectedColor: 'bg-blue-600 border-blue-600'
  },
  { 
    id: 'agent', 
    label: 'Agent immobilier', 
    description: 'Je gère des biens et des clients',
    icon: Building2,
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconColor: 'text-purple-600',
    selectedColor: 'bg-purple-600 border-purple-600'
  },
  { 
    id: 'owner', 
    label: 'Propriétaire', 
    description: 'Je veux gérer mes biens',
    icon: Home,
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    iconColor: 'text-green-600',
    selectedColor: 'bg-green-600 border-green-600'
  },
  { 
    id: 'investor', 
    label: 'Investisseur', 
    description: 'Je cherche des opportunités',
    icon: TrendingUp,
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    iconColor: 'text-amber-600',
    selectedColor: 'bg-amber-600 border-amber-600'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function RoleQuestion({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center mb-6">
        Commençons par définir votre profil pour personnaliser votre expérience
      </p>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = data.role === role.id;
          
          return (
            <motion.button
              key={role.id}
              variants={itemVariants}
              onClick={() => updateData('role', role.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left group ${
                isSelected 
                  ? `${role.selectedColor} text-white shadow-lg` 
                  : `${role.color} bg-white hover:shadow-md`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : role.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {role.label}
                  </h3>
                  <p className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                    {role.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  layoutId="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-current rounded-full" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}