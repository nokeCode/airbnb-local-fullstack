// components/onboarding/questions/tenant/TenantQuestions.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Euro, MapPin, Home, Calendar, 
  Wifi, Car, WashingMachine, Trees, 
  Check, Building, Warehouse 
} from 'lucide-react';
import { OnboardingData } from '../../OnboardingContainer';

// Étape 1: Budget du locataire
export function BudgetStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const budgets = [
    { id: '0-500', label: 'Moins de 500€', description: 'Chambre ou studio petit budget' },
    { id: '500-800', label: '500€ - 800€', description: 'Studio ou T1 confortable' },
    { id: '800-1200', label: '800€ - 1 200€', description: 'T2 ou T3 selon la zone' },
    { id: '1200-1800', label: '1 200€ - 1 800€', description: 'T3-T4 familial' },
    { id: '1800+', label: 'Plus de 1 800€', description: 'Grand appartement ou maison' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Quel est votre budget mensuel maximum ?</p>
      <div className="grid gap-3">
        {budgets.map((budget) => (
          <motion.button
            key={budget.id}
            onClick={() => updateData('tenantBudget', budget.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              data.tenantBudget === budget.id
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${data.tenantBudget === budget.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Euro className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{budget.label}</div>
                <div className="text-sm text-gray-500">{budget.description}</div>
              </div>
            </div>
            {data.tenantBudget === budget.id && <Check className="w-5 h-5 text-blue-600" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Étape 2: Localisation
export function LocationStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const zones = [
    'Paris centre', 'Banlieue proche', 'Grand Paris', 'Lyon', 'Marseille', 
    'Bordeaux', 'Toulouse', 'Nantes', 'Strasbourg', 'Lille', 'Remote / Télétravail'
  ];

  const toggleZone = (zone: string) => {
    const current = data.tenantLocation || [];
    const updated = current.includes(zone) 
      ? current.filter(z => z !== zone)
      : [...current, zone];
    updateData('tenantLocation', updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Où souhaitez-vous habiter ? (plusieurs choix possibles)</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {zones.map((zone) => {
          const isSelected = data.tenantLocation?.includes(zone);
          return (
            <motion.button
              key={zone}
              onClick={() => toggleZone(zone)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {zone}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 3: Type de bien
export function PropertyTypeStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const types = [
    { id: 'studio', label: 'Studio', icon: Home },
    { id: 't2', label: 'T2 / 2 pièces', icon: Building },
    { id: 't3', label: 'T3 / 3 pièces', icon: Building },
    { id: 't4+', label: 'T4 et plus', icon: Building },
    { id: 'house', label: 'Maison', icon: Home },
    { id: 'loft', label: 'Loft / Atelier', icon: Warehouse },
  ];

  const toggleType = (type: string) => {
    const current = data.tenantPropertyType || [];
    const updated = current.includes(type) 
      ? current.filter(t => t !== type)
      : [...current, type];
    updateData('tenantPropertyType', updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Quels types de biens vous intéressent ?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = data.tenantPropertyType?.includes(type.id);
          return (
            <motion.button
              key={type.id}
              onClick={() => toggleType(type.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`p-3 rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{type.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 4: Critères / Équipements
export function AmenitiesStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const amenities = [
    { id: 'furnished', label: 'Meublé', icon: Home },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'wifi', label: 'Internet haut débit', icon: Wifi },
    { id: 'washer', label: 'Machine à laver', icon: WashingMachine },
    { id: 'garden', label: 'Jardin / Balcon', icon: Trees },
    { id: 'new', label: 'Récent/ Rénové', icon: Check },
  ];

  const toggleAmenity = (amenity: string) => {
    const current = data.tenantAmenities || [];
    const updated = current.includes(amenity) 
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateData('tenantAmenities', updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Vos critères importants (optionnel)</p>
      <div className="grid grid-cols-2 gap-3">
        {amenities.map((amenity) => {
          const Icon = amenity.icon;
          const isSelected = data.tenantAmenities?.includes(amenity.id);
          return (
            <motion.button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">{amenity.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Étape 5: Date d'emménagement
export function MoveInDateStep({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const dates = [
    { id: 'immediate', label: 'Dès que possible', sublabel: 'Urgent' },
    { id: '1month', label: 'Dans 1 mois', sublabel: 'Recherche active' },
    { id: '3months', label: 'Dans 3 mois', sublabel: 'Préparation' },
    { id: '6months', label: 'Dans 6 mois+', sublabel: 'Prospection' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">Quand souhaitez-vous emménager ?</p>
      <div className="grid gap-3">
        {dates.map((date) => (
          <motion.button
            key={date.id}
            onClick={() => updateData('tenantMoveInDate', date.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              data.tenantMoveInDate === date.id
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${data.tenantMoveInDate === date.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{date.label}</div>
                <div className="text-sm text-gray-500">{date.sublabel}</div>
              </div>
            </div>
            {data.tenantMoveInDate === date.id && <Check className="w-5 h-5 text-blue-600" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export const TenantQuestions = {
  BudgetStep,
  LocationStep,
  PropertyTypeStep,
  AmenitiesStep,
  MoveInDateStep
};