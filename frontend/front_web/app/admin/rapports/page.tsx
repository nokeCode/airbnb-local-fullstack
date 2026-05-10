'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Euro,
  Activity
} from 'lucide-react';
import { getAdminReports } from '@/services/adminService';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const fallbackUserGrowthData = [
  { mois: 'Jan', locataires: 120, proprietaires: 45, agents: 12, investisseurs: 8 },
  { mois: 'Fev', locataires: 145, proprietaires: 52, agents: 15, investisseurs: 10 },
  { mois: 'Mar', locataires: 180, proprietaires: 68, agents: 18, investisseurs: 15 },
  { mois: 'Avr', locataires: 220, proprietaires: 85, agents: 25, investisseurs: 22 },
  { mois: 'Mai', locataires: 280, proprietaires: 110, agents: 32, investisseurs: 30 },
  { mois: 'Juin', locataires: 350, proprietaires: 145, agents: 45, investisseurs: 42 },
];

const fallbackRevenueByRole = [
  { name: 'Proprietaires', value: 45, color: '#10B981' },
  { name: 'Agents', value: 30, color: '#6366F1' },
  { name: 'Investisseurs', value: 20, color: '#F59E0B' },
  { name: 'Locataires', value: 5, color: '#6B7280' },
];

const fallbackPropertyStats = [
  { type: 'Appartements', count: 456, occupation: 92 },
  { type: 'Maisons', count: 234, occupation: 88 },
  { type: 'Studios', count: 189, occupation: 95 },
  { type: 'Lofts', count: 67, occupation: 85 },
  { type: 'Commerces', count: 45, occupation: 78 },
];

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminReports()
      .then((data) => {
        if (!mounted) return;
        setReportData(data || null);
      })
      .catch(() => {
        if (!mounted) return;
        setReportData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const userGrowthData = reportData?.user_growth || fallbackUserGrowthData;
  const revenueByRole = reportData?.revenue_by_role || fallbackRevenueByRole;
  const propertyStats = reportData?.property_stats || fallbackPropertyStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Rapports & Statistiques</h1>
          <p className="text-gray-400">Analyses detaillees de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors">
            <Calendar size={18} />
            Avril 2024
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
            <Download size={18} />
            Exporter rapport
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Users className="text-indigo-400" size={24} />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} />
              +24%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">1,247</p>
          <p className="text-gray-400 text-sm">Utilisateurs actifs</p>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Building2 className="text-emerald-400" size={24} />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} />
              +18%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">991</p>
          <p className="text-gray-400 text-sm">Biens enregistres</p>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Euro className="text-amber-400" size={24} />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} />
              +32%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">48.5K€</p>
          <p className="text-gray-400 text-sm">Revenus ce mois</p>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Activity className="text-purple-400" size={24} />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} />
              +5%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">89.2%</p>
          <p className="text-gray-400 text-sm">Taux d'occupation</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Croissance des utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorLoc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mois" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="locataires" stackId="1" stroke="#6366f1" fill="url(#colorLoc)" name="Locataires" />
              <Area type="monotone" dataKey="proprietaires" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Proprietaires" />
              <Area type="monotone" dataKey="agents" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Agents" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Role */}
        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Repartition des revenus par role</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByRole}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 min-w-[150px]">
              {revenueByRole.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400 text-sm">{item.name}</span>
                  <span className="text-white font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Stats */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Statistiques des biens par type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={propertyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="type" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }} />
            <Bar dataKey="count" name="Nombre de biens" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="occupation" name="Taux d'occupation (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Chargement des rapports...</div>
      )}
    </div>
  );
}
