'use client';

import { motion } from 'framer-motion';
import { Edit2, CheckCircle } from 'lucide-react';
import { OnboardingData } from '../onboarding/OnboardingContainer';

interface Props {
  data: OnboardingData;
  onEdit: (step: number) => void;
}

const roleLabels: Record<string, string> = {
  investor: 'Investisseur',
  owner: 'Propriétaire',
  agent: 'Agent immobilier',
  manager: 'Gestionnaire',
  tenant: 'Locataire',
};

const experienceLabels: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
};

const budgetLabels: Record<string, string> = {
  '0-100k': 'Moins de 100 000 €',
  '100-300k': '100 000 € - 300 000 €',
  '300-500k': '300 000 € - 500 000 €',
  '500k-1m': '500 000 € - 1 000 000 €',
  '1m+': 'Plus de 1 000 000 €',
};

const goalLabels: Record<string, string> = {
  rental: 'Revenus locatifs',
  flipping: 'Revente rapide',
  primary: 'Résidence principale',
  secondary: 'Résidence secondaire',
  diversification: 'Diversification',
  location: 'Meilleure localisation',
  longterm: 'Patrimoine long terme',
};

const locationLabels: Record<string, string> = {
  paris: 'Paris & Île-de-France',
  'cote-azur': 'Côte d\'Azur',
  alpes: 'Alpes & Montagnes',
  campagne: 'Campagne & Nature',
  etranger: 'À l\'étranger',
  flexible: 'Flexible / Pas de préférence',
};

export function Summary({ data, onEdit }: Props) {
  const sections = [
    { label: 'Votre rôle', value: roleLabels[data.role], step: 0 },
    { label: 'Expérience', value: experienceLabels[data.experience], step: 1 },
    { label: 'Objectifs', value: `${data.goals.length} sélectionnés`, step: 2 },
    { label: 'Budget', value: budgetLabels[data.budget], step: 3 },
    { label: 'Localisation', value: `${data.location.length} sélectionnée${data.location.length > 1 ? 's' : ''}`, step: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Récapitulatif</h3>
        <p className="text-gray-600">Vérifiez vos informations avant de continuer</p>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-between group hover:border-gray-300 transition-colors"
          >
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{section.label}</div>
              <div className="font-semibold text-gray-900">{section.value}</div>
            </div>
            <button
              onClick={() => onEdit(section.step)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Edit2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Détail des objectifs */}
      {data.goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Objectifs détaillés</div>
          <div className="flex flex-wrap gap-2">
            {data.goals.map(goal => (
              <span key={goal} className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm border border-gray-200">
                <CheckCircle size={12} className="text-green-500" />
                {goalLabels[goal]}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Détail des localisations */}
      {data.location.length > 0 && !data.location.includes('flexible') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Zones sélectionnées</div>
          <div className="flex flex-wrap gap-2">
            {data.location.map(loc => (
              <span key={loc} className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm border border-gray-200">
                <CheckCircle size={12} className="text-blue-500" />
                {locationLabels[loc]}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}