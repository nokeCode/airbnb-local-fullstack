'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getProperties } from '@/services/propertiesService';

type Property = {
  id: number;
  title: string;
  address: string;
  price: string | number;
  status?: string;
  owner_name?: string;
};

export function RecentPayments() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des biens pour simuler les derniers paiements.
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

  const payments = useMemo(() => {
    // Transformation simple des biens en lignes de paiements.
    const toStatus = (s?: string) => (s || '').toLowerCase();
    const isRented = (s: string) => ['occupied', 'rented', 'loué', 'loue'].some(v => s.includes(v));
    const isAvailable = (s: string) => ['available', 'vacant', 'free', 'a louer', 'à louer'].some(v => s.includes(v));

    return properties.slice(0, 4).map((p) => {
      const status = toStatus(p.status);
      const amount = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      const montant = Number.isFinite(amount) ? `${Math.round(amount).toLocaleString('fr-FR')} FCFA` : '—';
      const state = isRented(status) ? 'payé' : isAvailable(status) ? 'attente' : 'en retard';
      return {
        id: p.id,
        locataire: p.owner_name || 'Locataire',
        bien: p.title,
        montant,
        date: 'Ce mois-ci',
        status: state,
        type: 'Loyer',
      };
    });
  }, [properties]);

  const getIcon = (status: string) => {
    if (status === 'payé') return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' };
    if (status === 'en retard') return { icon: AlertCircle, color: 'text-red-600 bg-red-50' };
    return { icon: Clock, color: 'text-amber-600 bg-amber-50' };
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Derniers paiements</h3>
          <p className="text-sm text-gray-500">Suivi des loyers et charges récents</p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
          Voir tout
          <ArrowRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const meta = getIcon(p.status);
            return (
              <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div className={`p-2 rounded-xl ${meta.color}`}>
                  <meta.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-gray-900 truncate">{p.locataire}</h4>
                    <span className="font-bold text-gray-900">{p.montant}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-500 truncate">{p.bien}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'payé' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'en retard' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {p.status === 'payé' ? 'Payé' : p.status === 'en retard' ? 'En retard' : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
