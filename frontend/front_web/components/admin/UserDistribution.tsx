'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

const fallbackData = [
  { name: 'Locataires', value: 580, color: '#6366f1' },
  { name: 'Propriétaires', value: 245, color: '#10b981' },
  { name: 'Agents', value: 78, color: '#f59e0b' },
  { name: 'Investisseurs', value: 45, color: '#ec4899' },
];

export function UserDistribution({
  data = fallbackData,
  loading = false,
}: {
  data?: typeof fallbackData;
  loading?: boolean;
}) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Répartition des utilisateurs</h3>
          <p className="text-sm text-gray-400">Par type de compte</p>
        </div>
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Users className="text-indigo-400" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="h-48 bg-gray-800/40 rounded-xl animate-pulse" />
      ) : (
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white">{total}</span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>
      )}

      <div className="space-y-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">{item.value}</span>
              <span className="text-gray-500 text-xs">({total ? ((item.value / total) * 100).toFixed(1) : '0.0'}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-sm text-gray-400">Croissance ce mois</span>
        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
          <TrendingUp size={16} />
          +24.5%
        </div>
      </div>
    </div>
  );
}
