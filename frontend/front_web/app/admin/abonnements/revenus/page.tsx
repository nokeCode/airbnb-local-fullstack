'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Users, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const revenueData = [
  { mois: 'Jan', abonnements: 12000, transactions: 3500, total: 15500 },
  { mois: 'Fév', abonnements: 13500, transactions: 4200, total: 17700 },
  { mois: 'Mar', abonnements: 14800, transactions: 3800, total: 18600 },
  { mois: 'Avr', abonnements: 16200, transactions: 5100, total: 21300 },
  { mois: 'Mai', abonnements: 18500, transactions: 4800, total: 23300 },
  { mois: 'Juin', abonnements: 21000, transactions: 6200, total: 27200 },
];

const churnData = [
  { categorie: 'Starter', taux: 5.2, clients: 23 },
  { categorie: 'Pro', taux: 3.1, clients: 8 },
  { categorie: 'Enterprise', taux: 1.8, clients: 2 },
];

export default function RevenueDetails() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        <Link href="/admin/abonnements" className="hover:text-white flex items-center gap-2">
          <ArrowLeft size={16} />
          Retour aux abonnements
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Analyse des revenus</h1>
        <p className="text-gray-400">Métriques financières et tendances d'abonnement</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">ARR (Annual Recurring Revenue)</p>
          <p className="text-2xl font-bold text-white">326,400 €</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
            <TrendingUp size={14} />
            <span>+18.2%</span>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">ARPU (Revenu moyen/utilisateur)</p>
          <p className="text-2xl font-bold text-white">42.50 €</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
            <TrendingUp size={14} />
            <span>+5.3%</span>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Churn Rate</p>
          <p className="text-2xl font-bold text-white">3.8%</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
            <TrendingDown size={14} />
            <span>-0.5% (bon)</span>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">LTV (Lifetime Value)</p>
          <p className="text-2xl font-bold text-white">1,247 €</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
            <TrendingUp size={14} />
            <span>+12.1%</span>
          </div>
        </div>
      </div>

      {/* Graphique Revenus */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Évolution des revenus (6 mois)</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">6 mois</button>
            <button className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg text-sm">1 an</button>
            <button className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg text-sm">Tout</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorAbonnements" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mois" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => `${value}€`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Area type="monotone" dataKey="abonnements" name="Abonnements" stroke="#6366f1" fillOpacity={1} fill="url(#colorAbonnements)" />
            <Area type="monotone" dataKey="transactions" name="Transactions" stroke="#10b981" fillOpacity={1} fill="url(#colorTransactions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Churn Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Taux de désabonnement par plan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={churnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="categorie" stroke="#6b7280" />
              <YAxis stroke="#6b7280" unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Bar dataKey="taux" name="Taux de churn (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Répartition des revenus</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Abonnements Starter</p>
                  <p className="text-sm text-gray-500">456 utilisateurs</p>
                </div>
              </div>
              <p className="text-emerald-400 font-bold">4,555 €/mois</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-indigo-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Abonnements Pro</p>
                  <p className="text-sm text-gray-500">234 utilisateurs</p>
                </div>
              </div>
              <p className="text-indigo-400 font-bold">7,017 €/mois</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-purple-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Abonnements Enterprise</p>
                  <p className="text-sm text-gray-500">89 utilisateurs</p>
                </div>
              </div>
              <p className="text-purple-400 font-bold">8,899 €/mois</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}