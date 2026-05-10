'use client';

import { Header } from "@/components/dashboard/Header";
import {
  Bell,
  AlertTriangle,
  Calendar,
  Euro,
  Wrench,
  FileText,
  CheckCircle2,
  Trash2,
  Settings,
  Filter
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getProperties, getPropertyExpenses } from '@/services/propertiesService';
import { getContracts } from '@/services/contractsService';

type Property = {
  id: number;
  title: string;
  price: string | number;
  status?: string;
};

type Contract = {
  id: number;
  end_date?: string | null;
  contract_type: 'rent' | 'sale' | string;
  property_details?: { title?: string };
  client_details?: { first_name?: string; last_name?: string };
};

type Expense = {
  id: number;
  amount: string | number;
  description?: string;
  start_date?: string;
  expense_date?: string;
};

type Alerte = {
  id: string;
  type: 'paiement' | 'bail' | 'maintenance' | 'fiscal' | 'assurance';
  titre: string;
  description: string;
  date: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  lu: boolean;
  action: string;
};

const configType = {
  paiement: { icon: Euro, color: 'bg-red-100 text-red-600', label: 'Paiement' },
  bail: { icon: FileText, color: 'bg-blue-100 text-blue-600', label: 'Bail' },
  maintenance: { icon: Wrench, color: 'bg-orange-100 text-orange-600', label: 'Maintenance' },
  fiscal: { icon: Calendar, color: 'bg-violet-100 text-violet-600', label: 'Fiscal' },
  assurance: { icon: Bell, color: 'bg-gray-100 text-gray-600', label: 'Assurance' },
};

const configPriorite = {
  haute: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Urgent' },
  moyenne: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Moyen' },
  basse: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Faible' },
};

export default function AlertesPage() {
  const [filtreType, setFiltreType] = useState('tous');
  const [filtrePriorite, setFiltrePriorite] = useState('tous');
  const [properties, setProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [expensesMap, setExpensesMap] = useState<Record<number, Expense[]>>({});
  const [loading, setLoading] = useState(true);
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Charge biens + contrats + dépenses pour générer les alertes.
    let mounted = true;
    Promise.all([getProperties(), getContracts()])
      .then(async ([props, ctrs]) => {
        if (!mounted) return;
        const propertiesData = Array.isArray(props) ? props : [];
        const contractsData = Array.isArray(ctrs) ? ctrs : [];
        setProperties(propertiesData);
        setContracts(contractsData);

        const expensesEntries = await Promise.all(
          propertiesData.map(async (p: Property) => {
            try {
              const list = await getPropertyExpenses(p.id);
              return [p.id, Array.isArray(list) ? list : []] as const;
            } catch {
              return [p.id, []] as const;
            }
          })
        );
        if (mounted) setExpensesMap(Object.fromEntries(expensesEntries));
      })
      .catch(() => {
        if (!mounted) return;
        setProperties([]);
        setContracts([]);
        setExpensesMap({});
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  const alertesState = useMemo<Alerte[]>(() => {
    // Génère des alertes simples depuis biens, contrats et dépenses.
    const result: Alerte[] = [];

    properties.forEach((p) => {
      const status = (p.status || '').toLowerCase();
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;

      if (status.includes('travaux')) {
        result.push({
          id: `maintenance-${p.id}`,
          type: 'maintenance',
          titre: 'Intervention à planifier',
          description: `Maintenance à prévoir pour ${p.title}`,
          date: new Date().toISOString().slice(0, 10),
          priorite: 'haute',
          lu: !!readMap[`maintenance-${p.id}`],
          action: 'Voir détails'
        });
      }

      if (status.includes('vacant') || status.includes('available')) {
        result.push({
          id: `paiement-${p.id}`,
          type: 'paiement',
          titre: 'Bien vacant',
          description: `${p.title} n'est pas loué (loyer estimé ${formatFCFA(Number.isFinite(price) ? price : 0)})`,
          date: new Date().toISOString().slice(0, 10),
          priorite: 'moyenne',
          lu: !!readMap[`paiement-${p.id}`],
          action: 'Relancer'
        });
      }
    });

    contracts.forEach((c) => {
      if (!c.end_date) return;
      const end = new Date(c.end_date);
      const now = new Date();
      const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 180 && diffDays >= 0) {
        const propertyTitle = c.property_details?.title || 'Bien';
        result.push({
          id: `bail-${c.id}`,
          type: 'bail',
          titre: 'Bail à renouveler',
          description: `Le contrat de ${propertyTitle} arrive à échéance dans ${diffDays} jours`,
          date: new Date().toISOString().slice(0, 10),
          priorite: diffDays <= 30 ? 'haute' : 'moyenne',
          lu: !!readMap[`bail-${c.id}`],
          action: 'Voir détails'
        });
      }
    });

    Object.entries(expensesMap).forEach(([propertyId, expenses]) => {
      expenses.forEach((e) => {
        const id = `expense-${propertyId}-${e.id}`;
        result.push({
          id,
          type: 'maintenance',
          titre: 'Dépense enregistrée',
          description: e.description || 'Dépense de maintenance',
          date: e.start_date || e.expense_date || new Date().toISOString().slice(0, 10),
          priorite: 'basse',
          lu: !!readMap[id],
          action: 'Voir détails'
        });
      });
    });

    return result;
  }, [properties, contracts, expensesMap, readMap]);

  const marquerCommeLu = (id: string) => {
    // Mise à jour locale pour l'affichage des alertes lues.
    setReadMap((prev) => ({ ...prev, [id]: true }));
  };

  const supprimerAlerte = (id: string) => {
    // Marque l'alerte comme lue et filtrée (effet visuel sans backend dédié).
    setReadMap((prev) => ({ ...prev, [id]: true }));
  };

  const alertesFiltrees = alertesState.filter(a => {
    const matchType = filtreType === 'tous' || a.type === filtreType;
    const matchPriorite = filtrePriorite === 'tous' || a.priorite === filtrePriorite;
    return matchType && matchPriorite;
  });

  const nonLus = alertesState.filter(a => !a.lu).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Alertes & Notifications"
        subtitle="Centre de notifications"
        actionLabel="Paramètres"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{nonLus}</span>
            </div>
            <p className="text-sm text-gray-500">Alertes non lues</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wrench className="text-orange-600" size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{alertesState.filter(a => a.type === 'maintenance').length}</span>
            </div>
            <p className="text-sm text-gray-500">Interventions urgentes</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Euro className="text-amber-600" size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{alertesState.filter(a => a.type === 'paiement').length}</span>
            </div>
            <p className="text-sm text-gray-500">Paiements en retard</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{alertesState.filter(a => a.type === 'bail').length}</span>
            </div>
            <p className="text-sm text-gray-500">Baux à renouveler</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          </div>
          <select
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="tous">Tous les types</option>
            <option value="paiement">Paiement</option>
            <option value="bail">Bail</option>
            <option value="maintenance">Maintenance</option>
            <option value="fiscal">Fiscal</option>
            <option value="assurance">Assurance</option>
          </select>
          <select
            value={filtrePriorite}
            onChange={(e) => setFiltrePriorite(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="tous">Toutes priorités</option>
            <option value="haute">Urgent</option>
            <option value="moyenne">Moyen</option>
            <option value="basse">Faible</option>
          </select>
          <button
            onClick={() => setReadMap(Object.fromEntries(alertesState.map(a => [a.id, true])))}
            className="ml-auto text-sm text-emerald-600 font-medium hover:text-emerald-700"
          >
            Tout marquer comme lu
          </button>
        </div>

        <div className="space-y-3">
          {loading && (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))
          )}

          {!loading && alertesFiltrees.map((alerte) => {
            const type = configType[alerte.type];
            const priorite = configPriorite[alerte.priorite];

            return (
              <div
                key={alerte.id}
                className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all ${
                  !alerte.lu ? 'border-l-4 border-l-emerald-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${type.color}`}>
                      <type.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{alerte.titre}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorite.color}`}>
                          {priorite.label}
                        </span>
                        {!alerte.lu && (
                          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alerte.description}</p>
                      <p className="text-xs text-gray-400">{new Date(alerte.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                      {alerte.action}
                    </button>
                    {!alerte.lu && (
                      <button
                        onClick={() => marquerCommeLu(alerte.id)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Marquer comme lu"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => supprimerAlerte(alerte.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && alertesFiltrees.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
              <p>Aucune alerte à afficher</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-gray-400" size={20} />
            <h3 className="font-bold text-gray-900">Paramètres de notification</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Paiements en retard', checked: true },
              { label: 'Fin de bail (6 mois avant)', checked: true },
              { label: 'Nouvelles demandes de maintenance', checked: true },
              { label: 'Échéances fiscales', checked: true },
              { label: 'Nouveaux messages', checked: true },
              { label: "Baisse de taux d'occupation", checked: false },
            ].map((param, idx) => (
              <label key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-700">{param.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={param.checked}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
