'use client';

import {
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

const defaultStats = [
  {
    label: 'Utilisateurs totaux',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'indigo',
    detail: 'dont 156 nouveaux ce mois'
  },
  {
    label: 'Biens immobiliers',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: Building2,
    color: 'emerald',
    detail: '892 loués, 342 vacants'
  },
  {
    label: 'Revenus mensuels',
    value: '45,290 FCFA',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'amber',
    detail: 'Abonnements + Transactions'
  },
  {
    label: 'Taux conversion',
    value: '68.4%',
    change: '-2.3%',
    trend: 'down',
    icon: Activity,
    color: 'purple',
    detail: 'Essai -> Payant'
  },
  {
    label: 'Utilisateurs actifs',
    value: '1,892',
    change: '+5.7%',
    trend: 'up',
    icon: UserCheck,
    color: 'blue',
    detail: 'Sur les 30 derniers jours'
  },
  {
    label: 'Alertes système',
    value: '3',
    change: '2 critiques',
    trend: 'neutral',
    icon: AlertTriangle,
    color: 'red',
    detail: 'Requièrent attention'
  }
];

export function StatsCards({
  stats = defaultStats,
  loading = false,
}: {
  stats?: typeof defaultStats;
  loading?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {(loading ? defaultStats : stats).map((stat, idx) => {
        const Icon = stat.icon;
        const colorClasses = {
          indigo: 'from-indigo-500 to-purple-600 shadow-indigo-500/20',
          emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
          amber: 'from-amber-500 to-orange-600 shadow-amber-500/20',
          purple: 'from-purple-500 to-pink-600 shadow-purple-500/20',
          blue: 'from-blue-500 to-cyan-600 shadow-blue-500/20',
          red: 'from-red-500 to-rose-600 shadow-red-500/20',
        }[stat.color];

        return (
          <div key={idx} className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 bg-gradient-to-br ${colorClasses} rounded-xl shadow-lg`}>
                <Icon className="text-white" size={20} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' :
                stat.trend === 'down' ? 'bg-red-500/10 text-red-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                {stat.trend === 'up' && <TrendingUp size={12} />}
                {stat.trend === 'down' && <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
            <p className="text-xs text-gray-500">{stat.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
