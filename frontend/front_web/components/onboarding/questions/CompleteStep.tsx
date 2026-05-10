// components/onboarding/questions/CompleteStep.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { OnboardingData } from '../OnboardingContainer';

interface Props {
  data: OnboardingData;
}

const roleLabels: Record<string, string> = {
  tenant: 'Locataire',
  agent: 'Agent immobilier',
  owner: 'Propriétaire',
  investor: 'Investisseur',
  manager: 'Gestionnaire',
};

export function CompleteStep({ data }: Props) {
  const isTenant = data.role === 'tenant';
  const isAgent = data.role === 'agent';

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="inline-flex"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Parfait, votre profil est prêt !
        </h3>
        <p className="text-gray-600">
          {isTenant 
            ? "Nous allons vous proposer les biens qui correspondent à vos critères."
            : isAgent
            ? "Votre tableau de bord agent est configuré pour optimiser votre activité."
            : "Votre espace personnel est configuré."}
        </p>
      </motion.div>

      {/* Récapitulatif conditionnel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Sparkles size={16} className="text-yellow-500" />
          <span className="font-medium">Récapitulatif de votre profil</span>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-500">Profil:</span>
            <span className="font-semibold text-gray-900 bg-gray-200 px-3 py-1 rounded-full">
              {roleLabels[data.role] || data.role}
            </span>
          </div>
          
          {isTenant && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Budget max:</span>
                <span className="font-medium text-gray-900">{data.tenantBudget}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Zones:</span>
                <span className="font-medium text-gray-900">{data.tenantLocation?.length || 0} sélectionnées</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Types:</span>
                <span className="font-medium text-gray-900">{data.tenantPropertyType?.join(', ')}</span>
              </div>
            </>
          )}
          
          {isAgent && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Expérience:</span>
                <span className="font-medium text-gray-900">{data.agentExperience}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Spécialités:</span>
                <span className="font-medium text-gray-900">{data.agentSpecialty?.length || 0} sélectionnées</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Zones:</span>
                <span className="font-medium text-gray-900">{data.agentZone?.length || 0} zones</span>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-500"
      >
        Cliquez sur "Terminer" pour accéder à votre tableau de bord
      </motion.div>
    </div>
  );
}