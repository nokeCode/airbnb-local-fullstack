'use client';

import {
  UserPlus,
  CreditCard,
  Building2,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';

const fallbackActivities = [
  {
    id: 1,
    type: 'user',
    action: 'Nouvel utilisateur inscrit',
    details: 'Marie Martin (Propriétaire) - vérification en attente',
    time: 'Il y a 5 minutes',
    icon: UserPlus,
    color: 'text-blue-400 bg-blue-400/10'
  },
  {
    id: 2,
    type: 'payment',
    action: 'Paiement reçu',
    details: 'Abonnement Pro - Pierre Moreau - 29.99 FCFA',
    time: 'Il y a 12 minutes',
    icon: CreditCard,
    color: 'text-emerald-400 bg-emerald-400/10'
  },
  {
    id: 3,
    type: 'property',
    action: 'Nouveau bien ajouté',
    details: 'Appartement T3 - Paris 15e - 1,200 FCFA/mois',
    time: 'Il y a 28 minutes',
    icon: Building2,
    color: 'text-purple-400 bg-purple-400/10'
  },
  {
    id: 4,
    type: 'maintenance',
    action: 'Intervention urgente',
    details: 'Fuite d\'eau - Résidence du Parc - Artisan assigné',
    time: 'Il y a 45 minutes',
    icon: Wrench,
    color: 'text-amber-400 bg-amber-400/10'
  },
  {
    id: 5,
    type: 'system',
    action: 'Mise à jour complétée',
    details: 'Version 2.4.0 déployée avec succès',
    time: 'Il y a 2 heures',
    icon: CheckCircle2,
    color: 'text-indigo-400 bg-indigo-400/10'
  }
];

export function RecentActivity({
  items = fallbackActivities,
  loading = false,
}: {
  items?: typeof fallbackActivities;
  loading?: boolean;
}) {
  const list = loading ? fallbackActivities : items;

  return (
    <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Activité récente</h3>
          <p className="text-sm text-gray-400">Dernières actions sur la plateforme</p>
        </div>
        <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
          Voir tout
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {list.map((activity: any) => {
          const Icon = activity.icon || UserPlus;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors group">
              <div className={`p-3 rounded-xl ${activity.color || 'text-blue-400 bg-blue-400/10'}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white">{activity.action}</h4>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">{activity.details}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white">
                <ArrowRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-3 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-400 transition-colors text-sm font-medium">
        Charger plus d'activités
      </button>
    </div>
  );
}
