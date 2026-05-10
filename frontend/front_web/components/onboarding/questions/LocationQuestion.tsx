'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, Building2, TreePine, Waves, Mountain } from 'lucide-react';
import { OnboardingData } from '../OnboardingContainer';

const locations = [
  { id: 'paris', label: 'Paris & Île-de-France', icon: Building2 },
  { id: 'cote-azur', label: 'Côte d\'Azur', icon: Waves },
  { id: 'alpes', label: 'Alpes & Montagnes', icon: Mountain },
  { id: 'campagne', label: 'Campagne & Nature', icon: TreePine },
  { id: 'etranger', label: 'À l\'étranger', icon: Globe },
  { id: 'flexible', label: 'Flexible / Pas de préférence', icon: MapPin },
];

interface Props {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string[]) => void;
}

export function LocationQuestion({ data, updateData }: Props) {
  const toggleLocation = (locId: string) => {
    if (locId === 'flexible') {
      updateData('location', ['flexible']);
      return;
    }
    
    const newLocations = data.location.includes(locId)
      ? data.location.filter(l => l !== locId)
      : [...data.location.filter(l => l !== 'flexible'), locId];
    updateData('location', newLocations);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        Où souhaitez-vous investir ? (plusieurs choix possibles)
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {locations.map((loc, idx) => {
          const Icon = loc.icon;
          const isSelected = data.location.includes(loc.id);
          
          return (
            <motion.button
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => toggleLocation(loc.id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <div className={`p-3 rounded-xl ${
                isSelected ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <Icon size={28} />
              </div>
              <span className="font-medium text-center text-sm">{loc.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}