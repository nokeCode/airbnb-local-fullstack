// components/onboarding/questions/agent/AgentQuestions.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Award, MapPinned, Building2, TrendingUp, 
  Briefcase, Users, Star, Check 
} from 'lucide-react';
import { OnboardingData } from '../../OnboardingContainer';

// Étape 1: Expérience
export function ExperienceStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const experiences = [
    { id: 'junior', label: 'Moins de 2 ans', description: 'Débutant dans le métier', icon: Star },
    { id: 'confirmed', label: '2 à 5 ans', description: 'Agent confirmé', icon: Award },
    { id: 'senior', label: '5 à 10 ans', description: 'Expérience solide', icon: Award },
    { id: 'expert', label: 'Plus de 10 ans', description: 'Expert reconnu', icon: Award },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Depuis combien de temps exercez-vous ?</p>
      <div className="grid gap-3">
        {experiences.map((exp) => {
          const Icon = exp.icon;
          const isSelected = data.agentExperience === exp.id;
          return (
            <motion.button
              key={exp.id}
              onClick={() => updateData('agentExperience', exp.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`p-3 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg">{exp.label}</div>
                <div className="text-sm text-gray-500">{exp.description}</div>
              </div>
              {isSelected && <Check className="w-6 h-6 text-purple-600" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 2: Spécialité
export function SpecialtyStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const specialties = [
    { id: 'residential', label: 'Résidentiel', description: 'Appartements et maisons' },
    { id: 'luxury', label: 'Premium / Luxe', description: 'Haut standing' },
    { id: 'commercial', label: 'Commercial', description: 'Bureaux et commerces' },
    { id: 'new', label: 'Neuf / VEFA', description: 'Immobilier neuf' },
    { id: 'investment', label: 'Investissement', description: 'Rentabilité et patrimoine' },
  ];

  const toggleSpecialty = (specialty: string) => {
    const current = data.agentSpecialty || [];
    const updated = current.includes(specialty) 
      ? current.filter(s => s !== specialty)
      : [...current, specialty];
    updateData('agentSpecialty', updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Vos spécialités (plusieurs choix possibles)</p>
      <div className="grid gap-3">
        {specialties.map((spec) => {
          const isSelected = data.agentSpecialty?.includes(spec.id);
          return (
            <motion.button
              key={spec.id}
              onClick={() => toggleSpecialty(spec.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-left">
                <div className="font-bold">{spec.label}</div>
                <div className="text-sm text-gray-500">{spec.description}</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 3: Zones d'intervention
export function ZoneStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const zones = [
    'Paris 1-8', 'Paris 9-16', 'Paris 17-20', 'Boulogne', 'Neuilly', 'Levallois',
    'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nantes', 'Strasbourg', 'Lille',
    'Rennes', 'Montpellier', 'Nice', 'Partout en France'
  ];

  const toggleZone = (zone: string) => {
    const current = data.agentZone || [];
    const updated = current.includes(zone) 
      ? current.filter(z => z !== zone)
      : [...current, zone];
    updateData('agentZone', updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Vos zones d'intervention</p>
      <div className="flex flex-wrap gap-2 justify-center max-h-64 overflow-y-auto p-2">
        {zones.map((zone) => {
          const isSelected = data.agentZone?.includes(zone);
          return (
            <motion.button
              key={zone}
              onClick={() => toggleZone(zone)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPinned className="w-4 h-4" />
                {zone}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 4: Structure
export function AgencyStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const agencies = [
    { id: 'independent', label: 'Indépendant', description: 'Je travaille seul', icon: Briefcase },
    { id: 'small', label: 'Petite agence', description: 'Moins de 5 personnes', icon: Users },
    { id: 'medium', label: 'Agence moyenne', description: '5 à 20 personnes', icon: Building2 },
    { id: 'large', label: 'Grand réseau', description: 'Foncia, Century 21, etc.', icon: Building2 },
    { id: 'digital', label: '100% Digital', description: 'Proptech / En ligne', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Votre structure</p>
      <div className="grid gap-3">
        {agencies.map((agency) => {
          const Icon = agency.icon;
          const isSelected = data.agentAgency === agency.id;
          return (
            <motion.button
              key={agency.id}
              onClick={() => updateData('agentAgency', agency.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`p-3 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold">{agency.label}</div>
                <div className="text-sm text-gray-500">{agency.description}</div>
              </div>
              {isSelected && <Check className="w-6 h-6 text-purple-600" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 5: Volume de transactions
export function TransactionsStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const volumes = [
    { id: '0-10', label: '0 à 10 / an', description: 'Activité modérée' },
    { id: '10-30', label: '10 à 30 / an', description: 'Bonne activité' },
    { id: '30-50', label: '30 à 50 / an', description: 'Très actif' },
    { id: '50+', label: 'Plus de 50 / an', description: 'Top performer' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Votre volume de transactions annuel</p>
      <div className="grid grid-cols-2 gap-4">
        {volumes.map((vol) => {
          const isSelected = data.agentTransactions === vol.id;
          return (
            <motion.button
              key={vol.id}
              onClick={() => updateData('agentTransactions', vol.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-600 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <TrendingUp className={`w-8 h-8 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
              <div className="text-center">
                <div className="font-bold text-lg">{vol.label}</div>
                <div className="text-sm text-gray-500">{vol.description}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export const AgentQuestions = {
  ExperienceStep,
  SpecialtyStep,
  ZoneStep,
  AgencyStep,
  TransactionsStep
};