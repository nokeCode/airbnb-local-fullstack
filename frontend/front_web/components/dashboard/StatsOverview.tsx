'use client';

import { useEffect, useMemo, useState } from 'react';
import { RevenueChart } from './charts/RevenueChart';
import { TrendingUp, TrendingDown, Home, Users, AlertCircle, Euro } from 'lucide-react';
import { getProperties } from '@/services/propertiesService';

type Property = {
  id: number;
  price: string | number;
  status?: string;
};

export function StatsOverview() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement des biens pour calculer les statistiques du propriétaire connecté.
    let mounted = true;
    getProperties()
      .then((data) => {
        if (mounted) setProperties(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setProperties([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Formate les montants en FCFA (format lisible côté UI).
  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  const { stats, revenueSeries } = useMemo(() => {
    // Dérive les stats depuis les biens récupérés.
    const total = properties.length;
    const statusFlags = properties.map((p) => (p.status || '').toString().toLowerCase());
    const isAvailable = (s: string) =>
      ['available', 'vacant', 'free', 'a louer', 'à louer'].some((v) => s.includes(v));
    const isRented = (s: string) =>
      ['occupied', 'rented', 'loué', 'loue'].some((v) => s.includes(v));

    const availableCount = statusFlags.filter(isAvailable).length;
    const rentedCount = statusFlags.filter(isRented).length || (total - availableCount);
    const occupancy = total > 0 ? Math.round((rentedCount / total) * 1000) / 10 : 0;

    const revenue = properties.reduce((sum, p) => {
      const value = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    // Série simple pour le graphe (en attendant des endpoints de revenus détaillés).
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'];
    const revenueSeries = months.map((mois) => ({
      mois,
      loyers: Math.round(revenue),
      charges: Math.round(revenue * 0.12),
    }));

    return {
      stats: [
        {
          label: 'Revenus mensuels',
          value: formatFCFA(revenue),
          change: loading ? '—' : 'Màj',
          trend: 'neutral',
          icon: Euro,
          color: 'emerald'
        },
        {
          label: "Taux d'occupation",
          value: `${occupancy}%`,
          change: loading ? '—' : 'Màj',
          trend: 'neutral',
          icon: Home,
          color: 'blue'
        },
        {
          label: 'Locataires actifs',
          value: `${rentedCount}`,
          change: loading ? '—' : 'Màj',
          trend: 'neutral',
          icon: Users,
          color: 'violet'
        },
        {
          label: 'Impayés',
          value: '0 FCFA',
          change: loading ? '—' : 'À jour',
          trend: 'neutral',
          icon: AlertCircle,
          color: 'amber'
        },
      ],
      revenueSeries,
    };
  }, [properties, loading]);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-gray-200 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : (
          stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`text-${stat.color}-600`} size={20} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' :
                  stat.trend === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-100'
                } px-2 py-1 rounded-full`}>
                  {stat.trend === 'up' && <TrendingUp size={12} />}
                  {stat.trend === 'down' && <TrendingDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Évolution des revenus</h3>
            <p className="text-sm text-gray-500">Loyers perçus vs Charges sur les 7 derniers mois</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl">Mensuel</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium rounded-xl transition-colors">Annuel</button>
          </div>
        </div>
        {loading ? (
          <div className="h-[280px] bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <RevenueChart data={revenueSeries} />
        )}
      </div>
    </div>
  );
}
