'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const fallbackData = [
  { mois: 'Jan', revenus: 12500, objectif: 12000 },
  { mois: 'Fev', revenus: 14200, objectif: 13500 },
  { mois: 'Mar', revenus: 13800, objectif: 15000 },
  { mois: 'Avr', revenus: 18500, objectif: 16500 },
  { mois: 'Mai', revenus: 21200, objectif: 19000 },
  { mois: 'Juin', revenus: 24800, objectif: 22000 },
];

export function RevenueOverview({
  data = fallbackData,
  loading = false,
}: {
  data?: typeof fallbackData;
  loading?: boolean;
}) {
  const totalRevenus = data.reduce((acc, curr) => acc + curr.revenus, 0);
  const totalObjectif = data.reduce((acc, curr) => acc + curr.objectif, 0);
  const progression = totalObjectif ? ((totalRevenus - totalObjectif) / totalObjectif * 100).toFixed(1) : '0.0';

  return (
    <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Vue d'ensemble des revenus</h3>
          <p className="text-sm text-gray-400">Comparaison revenus vs objectifs</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
            <option>6 derniers mois</option>
            <option>12 derniers mois</option>
            <option>Cette année</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Revenus totaux</p>
          <p className="text-2xl font-bold text-white">{totalRevenus.toLocaleString()} FCFA</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Objectif</p>
          <p className="text-2xl font-bold text-gray-300">{totalObjectif.toLocaleString()} FCFA</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Progression</p>
          <div className={`flex items-center gap-2 text-2xl font-bold ${Number(progression) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {Number(progression) >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {progression}%
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[280px] bg-gray-800/40 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorObjectif" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mois" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => `${value} FCFA`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="revenus" name="Revenus réels" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenus)" strokeWidth={2} />
            <Area type="monotone" dataKey="objectif" name="Objectifs" stroke="#10b981" fillOpacity={1} fill="url(#colorObjectif)" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
