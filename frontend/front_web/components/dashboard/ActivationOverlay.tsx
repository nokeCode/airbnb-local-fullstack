'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface ActivationOverlayProps {
  open: boolean;
  requested: boolean;
  loading: boolean;
  onRequest: (plan: string) => void;
}

const plans = [
  {
    id: 'basic',
    title: 'Basic',
    badge: null,
    price: '5 000 FCFA / mois',
    features: [
      'Jusqu’à 3 biens',
      'Tableau de bord simple',
      'Support email',
      'Accès aux messages',
    ],
  },
  {
    id: 'popular',
    title: 'Plus populaire',
    badge: 'Recommandé',
    price: '15 000 FCFA / mois',
    features: [
      'Biens illimités',
      'Statistiques avancées',
      'Support prioritaire',
      'Exports mensuels',
    ],
  },
  {
    id: 'premium',
    title: 'Premium',
    badge: null,
    price: 'Sur devis',
    features: [
      'Accompagnement dédié',
      'SLA & support 24/7',
      'Multi-agences',
      'Accès API',
    ],
  },
];

export function ActivationOverlay({
  open,
  requested,
  loading,
  onRequest,
}: ActivationOverlayProps) {
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Activation requise</h2>
          <p className="mt-2 text-base text-gray-600">
            Votre compte propriétaire est en attente. Choisissez un plan pour envoyer la demande à l’admin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left border rounded-2xl p-6 transition-all ${
                  active
                    ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                  {active && <Check size={18} className="text-emerald-600" />}
                </div>
                {plan.badge && (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 mb-2">
                    {plan.badge}
                  </span>
                )}
                <p className="text-base font-semibold text-gray-800">{plan.price}</p>
                <ul className="mt-4 text-sm text-gray-700 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Après validation par l’admin, votre dashboard sera débloqué automatiquement.
          </p>
          <button
            type="button"
            onClick={() => onRequest(selectedPlan)}
            disabled={requested || loading}
            className={`px-8 py-3 rounded-xl text-sm font-medium text-white ${
              requested ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'
            } transition-colors`}
          >
            {requested ? 'Demande envoyée' : loading ? 'Envoi...' : 'Activer'}
          </button>
        </div>
      </div>
    </div>
  );
}
