'use client';

import { Header } from "@/components/dashboard/Header";
import {
  TrendingUp,
  TrendingDown,
  Home,
  Users,
  Euro,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { getProperties } from '@/services/propertiesService';
import { getContracts } from '@/services/contractsService';

type Property = {
  id: number;
  title: string;
  price: string | number;
  status?: string;
};

type Contract = {
  id: number;
  amount: string | number;
  start_date: string;
  end_date?: string | null;
  contract_type: 'rent' | 'sale' | string;
  property_details?: { title?: string };
  client_details?: { first_name?: string; last_name?: string };
};

export default function StatistiquesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charge les biens et les contrats pour calculer des statistiques plus fiables.
    let mounted = true;
    Promise.all([getProperties(), getContracts()])
      .then(([props, ctrs]) => {
        if (!mounted) return;
        setProperties(Array.isArray(props) ? props : []);
        setContracts(Array.isArray(ctrs) ? ctrs : []);
      })
      .catch(() => {
        if (!mounted) return;
        setProperties([]);
        setContracts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Formate les montants en FCFA.
  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  const {
    statsCards,
    revenueData,
    occupancyData,
    propertyPerformance
  } = useMemo(() => {
    // Calcul des indicateurs à partir des contrats + biens.
    const total = properties.length;
    const statusFlags = properties.map((p) => (p.status || '').toString().toLowerCase());
    const isAvailable = (s: string) =>
      ['available', 'vacant', 'free', 'a louer', 'à louer'].some((v) => s.includes(v));
    const isRented = (s: string) =>
      ['occupied', 'rented', 'loué', 'loue'].some((v) => s.includes(v));

    const availableCount = statusFlags.filter(isAvailable).length;
    const rentedCount = statusFlags.filter(isRented).length || (total - availableCount);
    const occupancy = total > 0 ? Math.round((rentedCount / total) * 1000) / 10 : 0;

    // Revenus mensuels basés sur les contrats de location.
    const monthlyRevenue = contracts
      .filter((c) => c.contract_type === 'rent')
      .reduce((sum, c) => {
        const value = typeof c.amount === 'string' ? parseFloat(c.amount) : c.amount;
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0);

    // Revenus de vente ajoutés au cumul annuel (one-shot).
    const salesRevenue = contracts
      .filter((c) => c.contract_type === 'sale')
      .reduce((sum, c) => {
        const value = typeof c.amount === 'string' ? parseFloat(c.amount) : c.amount;
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0);

    const annualRevenue = monthlyRevenue * 12 + salesRevenue;

    // Série mensuelle (sans endpoint d'historique) : estimation simple.
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const revenueData = months.map((mois) => ({
      mois,
      revenus: Math.round(monthlyRevenue),
      objectif: Math.round(monthlyRevenue * 1.05),
    }));

    // Occupation mensuelle (valeur actuelle répétée en attendant des stats historiques).
    const occupancyData = months.map((mois) => ({
      mois,
      taux: Math.round(occupancy),
    }));

    // Performance par bien (estimation annuelle + charges fictives).
    const propertyPerformance = properties.slice(0, 4).map((p) => {
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      const yearly = (Number.isFinite(price) ? price : 0) * 12;
      const charges = yearly * 0.12;
      const roi = yearly > 0 ? Math.round(((yearly - charges) / yearly) * 1000) / 10 : 0;
      return {
        name: p.title,
        revenus: yearly,
        charges,
        roi,
      };
    });

    const statsCards = [
      {
        title: 'Revenus annuels',
        value: formatFCFA(annualRevenue),
        change: loading ? '—' : 'Màj',
        trend: 'up',
        icon: Euro,
        color: 'emerald'
      },
      {
        title: "Taux d'occupation moyen",
        value: `${occupancy}%`,
        change: loading ? '—' : 'Màj',
        trend: 'up',
        icon: Home,
        color: 'blue'
      },
      {
        title: 'Contrats actifs',
        value: `${contracts.length}`,
        change: loading ? '—' : 'Màj',
        trend: 'up',
        icon: Calendar,
        color: 'violet'
      },
      {
        title: 'Rotation locataires',
        value: '8.5%',
        change: loading ? '—' : 'Màj',
        trend: 'down',
        icon: Users,
        color: 'amber'
      }
    ];

    return { statsCards, revenueData, occupancyData, propertyPerformance };
  }, [properties, contracts, loading]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Statistiques"
        subtitle="Analyse détaillée de votre patrimoine immobilier"
        actionLabel="Exporter rapport"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Évolution des revenus</h3>
                <p className="text-sm text-gray-500">Comparaison avec objectifs annuels</p>
              </div>
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(v) => `${v} FCFA`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FCFA`, '']}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenus" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenus)" />
                <Line type="monotone" dataKey="objectif" stroke="#6B7280" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Taux d'occupation</h3>
                <p className="text-sm text-gray-500">Évolution mensuelle (%)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  Occupation
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[80, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => [`${value}%`, "Taux d'occupation"]} />
                <Line type="monotone" dataKey="taux" stroke="#10B981" strokeWidth={3} dot={{fill: '#10B981', strokeWidth: 2, r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Performance par bien</h3>
              <p className="text-sm text-gray-500">Rentabilité et charges annuelles</p>
            </div>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
              Voir détails →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyPerformance.map((prop, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-3">{prop.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Revenus</span>
                    <span className="font-medium text-gray-900">{formatFCFA(prop.revenus)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Charges</span>
                    <span className="font-medium text-red-600">{formatFCFA(prop.charges)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">ROI</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm">
                      {prop.roi}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
