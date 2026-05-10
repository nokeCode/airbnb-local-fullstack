'use client';

import { Header } from "@/components/dashboard/Header";
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  MapPin,
  Calendar,
  Plus,
  Filter
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getProperties, getPropertyExpenses } from '@/services/propertiesService';

type Property = {
  id: number;
  title: string;
  address?: string;
};

type Expense = {
  id: number;
  amount: string | number;
  description?: string;
  start_date?: string;
  end_date?: string;
  expense_date?: string;
};

type Intervention = {
  id: string;
  titre: string;
  bien: string;
  adresse: string;
  urgence: 'haute' | 'moyenne' | 'basse';
  statut: 'en_cours' | 'planifie' | 'a_faire' | 'termine';
  dateSignalement: string;
  dateIntervention: string | null;
  prestataire: string | null;
  cout: number;
  description: string;
};

const configUrgence = {
  haute: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  moyenne: { label: 'Moyen', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  basse: { label: 'Faible', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
};

const configStatut = {
  en_cours: { label: 'En cours', color: 'bg-orange-100 text-orange-700' },
  planifie: { label: 'Planifiée', color: 'bg-blue-100 text-blue-700' },
  a_faire: { label: 'À faire', color: 'bg-gray-100 text-gray-700' },
  termine: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700' },
};

export default function MaintenancePage() {
  const [filtreStatut, setFiltreStatut] = useState<'tous' | 'en_cours' | 'planifie' | 'a_faire' | 'termine'>('tous');
  const [properties, setProperties] = useState<Property[]>([]);
  const [expensesMap, setExpensesMap] = useState<Record<number, Expense[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charge les biens puis leurs dépenses pour alimenter la maintenance.
    let mounted = true;
    getProperties()
      .then(async (props) => {
        if (!mounted) return;
        const list = Array.isArray(props) ? props : [];
        setProperties(list);

        const expensesEntries = await Promise.all(
          list.map(async (p: Property) => {
            try {
              const data = await getPropertyExpenses(p.id);
              return [p.id, Array.isArray(data) ? data : []] as const;
            } catch {
              return [p.id, []] as const;
            }
          })
        );

        if (mounted) setExpensesMap(Object.fromEntries(expensesEntries));
      })
      .catch(() => {
        if (mounted) {
          setProperties([]);
          setExpensesMap({});
        }
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

  const interventions = useMemo<Intervention[]>(() => {
    // Construit des interventions à partir des dépenses.
    const result: Intervention[] = [];

    properties.forEach((p) => {
      const expenses = expensesMap[p.id] || [];
      expenses.forEach((e, idx) => {
        const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
        const dateSignalement = e.start_date || e.expense_date || new Date().toISOString().slice(0, 10);
        const dateIntervention = e.end_date || null;

        result.push({
          id: `exp-${p.id}-${e.id}`,
          titre: e.description || 'Intervention de maintenance',
          bien: p.title,
          adresse: p.address || 'Adresse non renseignée',
          urgence: idx === 0 ? 'haute' : idx === 1 ? 'moyenne' : 'basse',
          statut: dateIntervention ? 'termine' : 'en_cours',
          dateSignalement,
          dateIntervention,
          prestataire: null,
          cout: Number.isFinite(amount) ? amount : 0,
          description: e.description || 'Détails non renseignés',
        });
      });
    });

    return result;
  }, [properties, expensesMap]);

  const interventionsFiltrees = interventions.filter(i =>
    filtreStatut === 'tous' ? true : i.statut === filtreStatut
  );

  const stats = useMemo(() => {
    // Compteurs rapides par statut.
    const enCours = interventions.filter(i => i.statut === 'en_cours').length;
    const urgentes = interventions.filter(i => i.urgence === 'haute').length;
    const planifiees = interventions.filter(i => i.statut === 'planifie').length;
    const terminees = interventions.filter(i => i.statut === 'termine').length;
    return { enCours, urgentes, planifiees, terminees };
  }, [interventions]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header 
        title="Maintenance" 
        subtitle="Suivi des interventions et travaux"
        actionLabel="Nouvelle demande"
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'En cours', value: stats.enCours, color: 'orange', icon: Clock },
            { label: 'Urgentes', value: stats.urgentes, color: 'red', icon: AlertTriangle },
            { label: 'Planifiées', value: stats.planifiees, color: 'blue', icon: Calendar },
            { label: 'Terminées', value: stats.terminees, color: 'emerald', icon: CheckCircle2 },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['tous', 'en_cours', 'planifie', 'a_faire', 'termine'].map((s) => (
              <button
                key={s}
                onClick={() => setFiltreStatut(s as typeof filtreStatut)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filtreStatut === s
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'tous' ? 'Toutes' : 
                 s === 'en_cours' ? 'En cours' : 
                 s === 'planifie' ? 'Planifiées' : 
                 s === 'a_faire' ? 'À faire' : 'Terminées'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter size={16} />
            Filtrer par bien
          </button>
        </div>

        <div className="space-y-4">
          {loading && (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))
          )}

          {!loading && interventionsFiltrees.map((intervention) => {
            const urgence = configUrgence[intervention.urgence];
            const statut = configStatut[intervention.statut];
            
            return (
              <div key={intervention.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{intervention.titre}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${urgence.color}`}>
                        <urgence.icon size={12} />
                        {urgence.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statut.color}`}>
                        {statut.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin size={14} />
                      {intervention.bien} • {intervention.adresse}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{intervention.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        Signalé le {new Date(intervention.dateSignalement).toLocaleDateString('fr-FR')}
                      </div>
                      {intervention.dateIntervention && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Wrench size={14} className="text-gray-400" />
                          Intervention le {new Date(intervention.dateIntervention).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      {intervention.prestataire && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Prestataire:</span> {intervention.prestataire}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{formatFCFA(intervention.cout)}</p>
                      <p className="text-xs text-gray-500">estimé</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Détails
                      </button>
                      {intervention.statut !== 'termine' && (
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700">
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Prestataires favoris</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { nom: 'Plombier Express', specialite: 'Plomberie', tel: '01 23 45 67 89', note: 4.8 },
              { nom: 'Chauffage Pro', specialite: 'Chauffage', tel: '01 23 45 67 90', note: 4.5 },
              { nom: 'Menuiserie Dupont', specialite: 'Menuiserie', tel: '01 23 45 67 91', note: 4.9 },
            ].map((prestataire, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{prestataire.nom}</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">★ {prestataire.note}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{prestataire.specialite}</p>
                <p className="text-sm text-gray-600">{prestataire.tel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
