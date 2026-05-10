'use client';

import { useEffect, useMemo, useState } from 'react';
import { OccupancyChart } from './charts/OccupancyChart';
import { ArrowRight, Wrench, AlertTriangle, Clock, CheckCircle2, Plus } from 'lucide-react';
import { getProperties } from '@/services/propertiesService';

type Property = {
  id: number;
  title: string;
  status?: string;
};

export function MaintenanceAlerts() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement des biens pour calculer l'occupation et les alertes travaux.
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

  const toStatus = (s?: string) => (s || '').toLowerCase();
  const isAvailable = (s: string) => ['available', 'vacant', 'free', 'a louer', 'à louer'].some(v => s.includes(v));
  const isRented = (s: string) => ['occupied', 'rented', 'loué', 'loue'].some(v => s.includes(v));
  const isWork = (s: string) => ['work', 'travaux'].some(v => s.includes(v));

  const { occupancyData, alerts } = useMemo(() => {
    // Calcul des compteurs d'occupation et des alertes de maintenance.
    const rented = properties.filter(p => isRented(toStatus(p.status))).length;
    const available = properties.filter(p => isAvailable(toStatus(p.status))).length;
    const work = properties.filter(p => isWork(toStatus(p.status))).length;

    const occupancyData = [
      { name: 'Loué', value: rented, color: '#10B981' },
      { name: 'Vacant', value: available, color: '#F59E0B' },
      { name: 'Travaux', value: work, color: '#EF4444' },
    ];

    const alerts = properties
      .filter(p => isWork(toStatus(p.status)))
      .slice(0, 3)
      .map((p, idx) => ({
        id: p.id,
        bien: p.title,
        probleme: 'Maintenance à planifier',
        urgence: idx === 0 ? 'haute' : idx === 1 ? 'moyenne' : 'basse',
        urgenceColor: idx === 0 ? 'bg-red-100 text-red-700 border-red-200' : idx === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-blue-100 text-blue-700 border-blue-200',
        urgenceIcon: idx === 0 ? AlertTriangle : idx === 1 ? Clock : CheckCircle2,
        date: 'À planifier',
        statut: 'en cours',
      }));

    return { occupancyData, alerts };
  }, [properties]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Taux d'occupation</h3>
            <p className="text-sm text-gray-500">Répartition de vos biens</p>
          </div>
        </div>

        {loading ? (
          <div className="h-[180px] bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-40">
              <OccupancyChart data={occupancyData} />
            </div>
            <div className="flex-1 space-y-2">
              {occupancyData.map((item) => {
                const total = occupancyData.reduce((acc, i) => acc + i.value, 0);
                const pct = total > 0 ? Math.round((item.value / total) * 1000) / 10 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name} ({item.value})</span>
                    </div>
                    <span className="font-semibold text-gray-900">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Interventions</h3>
              <p className="text-sm text-gray-500">Maintenance & réparations</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Voir tout
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-sm text-gray-500">Aucune intervention en cours.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alerte) => (
              <div key={alerte.id} className={`p-4 rounded-xl border ${alerte.urgenceColor} bg-opacity-30 hover:shadow-md transition-all cursor-pointer`}>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <alerte.urgenceIcon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{alerte.probleme}</h4>
                      <span className="text-xs font-medium px-2 py-0.5 bg-white rounded-full shadow-sm">
                        {alerte.urgence === 'haute' ? 'Urgent' : alerte.urgence === 'moyenne' ? 'Moyen' : 'Faible'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{alerte.bien}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{alerte.date}</span>
                      <span className="text-xs font-medium text-gray-700">{alerte.statut}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
          <Plus size={18} />
          Signaler un problème
        </button>
      </div>
    </div>
  );
}
