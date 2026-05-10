'use client';

import { AlertTriangle, CheckCircle2, XCircle, Info, ArrowRight, Bell } from 'lucide-react';

const fallbackAlerts = [
  {
    id: 1,
    type: 'error',
    title: '3 paiements échoués',
    message: 'Nécessitent attention immédiate - cartes expirées',
    time: '5 min',
    icon: XCircle,
    color: 'text-red-400 bg-red-400/10 border-red-400/20'
  },
  {
    id: 2,
    type: 'warning',
    title: '5 comptes en attente',
    message: 'Validation requise depuis plus de 48h',
    time: '2h',
    icon: AlertTriangle,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  },
  {
    id: 3,
    type: 'success',
    title: 'Objectif mensuel atteint',
    message: 'Revenus +15% par rapport aux prévisions',
    time: '1j',
    icon: CheckCircle2,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  },
  {
    id: 4,
    type: 'info',
    title: 'Mise à jour système',
    message: 'V2.4.0 disponible - déploiement demain 02h00',
    time: '2j',
    icon: Info,
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  }
];

export function AlertsPanel({
  alerts = fallbackAlerts,
  loading = false,
}: {
  alerts?: typeof fallbackAlerts;
  loading?: boolean;
}) {
  const list = loading ? fallbackAlerts : alerts;

  return (
    <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Bell className="text-red-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Alertes système</h3>
            <p className="text-sm text-gray-400">{list.length} alertes actives</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {list.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${alert.color} hover:bg-opacity-20 transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                <Icon size={20} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{alert.message}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs text-white hover:underline">Voir détails </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Priorité critique: <span className="text-red-400 font-semibold">1</span></span>
          <button className="text-indigo-400 hover:text-indigo-300">Gérer les alertes</button>
        </div>
      </div>
    </div>
  );
}
