'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react';

const fallbackData = [
  { mois: 'Jan', gratuit: 120, basic: 45, popular: 28, premium: 12 },
  { mois: 'Fev', gratuit: 135, basic: 52, popular: 32, premium: 14 },
  { mois: 'Mar', gratuit: 142, basic: 58, popular: 38, premium: 15 },
  { mois: 'Avr', gratuit: 156, basic: 67, popular: 45, premium: 18 },
  { mois: 'Mai', gratuit: 168, basic: 78, popular: 52, premium: 22 },
  { mois: 'Juin', gratuit: 180, basic: 89, popular: 62, premium: 28 },
];

const plans = [
  { key: 'gratuit', label: 'Gratuit', color: '#6b7280' },
  { key: 'basic', label: 'Basic', color: '#10b981' },
  { key: 'popular', label: 'Plus Populaire', color: '#6366f1' },
  { key: 'premium', label: 'Premium', color: '#f59e0b' },
];

export function SubscriptionChart({
  data = fallbackData,
  loading = false,
}: {
  data?: typeof fallbackData;
  loading?: boolean;
}) {
  const currentMonth = data[data.length - 1] || fallbackData[0];
  const totalPaying = (currentMonth.basic || 0) + (currentMonth.popular || 0) + (currentMonth.premium || 0);
  const totalUsers = (currentMonth.gratuit || 0) + totalPaying;
  const conversionRate = totalUsers ? ((totalPaying / totalUsers) * 100).toFixed(1) : '0.0';

  return (
    <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Évolution des abonnements</h3>
          <p className="text-sm text-gray-400">Répartition par plan sur 6 mois</p>
        </div>
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <CreditCard className="text-emerald-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Taux de conversion</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{conversionRate}%</span>
            <span className="text-emerald-400 text-sm flex items-center gap-0.5">
              <ArrowUpRight size={14} />
              +2.3%
            </span>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">MRR estimé</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">24.8K FCFA</span>
            <span className="text-emerald-400 text-sm flex items-center gap-0.5">
              <TrendingUp size={14} />
              +12%
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[250px] bg-gray-800/40 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mois" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            {plans.map((plan) => (
              <Bar
                key={plan.key}
                dataKey={plan.key}
                name={plan.label}
                fill={plan.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-400">Total utilisateurs ce mois: <span className="text-white font-semibold">{totalUsers}</span></span>
        <button className="text-indigo-400 hover:text-indigo-300">Voir détails </button>
      </div>
    </div>
  );
}
