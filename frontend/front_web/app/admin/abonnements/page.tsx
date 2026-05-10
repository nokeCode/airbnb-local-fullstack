'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Check, 
  X, 
  MoreHorizontal, 
  TrendingUp, 
  Users, 
  Zap,
  Crown,
  Building2,
  ArrowRight
} from 'lucide-react'; import { getAdminSubscriptions } from '@/services/adminService';

const fallbackPlans = [
  {
    id: 'gratuit',
    nom: 'Gratuit',
    prix: 0,
    frequence: 'mensuel',
    utilisateurs: 1240,
    revenus: 0,
    fonctionnalites: ['1 bien', '3 locataires', 'Support email'],
    couleur: 'gray',
    populaire: false
  },
  {
    id: 'starter',
    nom: 'Starter',
    prix: 9.99,
    frequence: 'mensuel',
    utilisateurs: 456,
    revenus: 4555,
    fonctionnalites: ['5 biens', '20 locataires', 'Support prioritaire', 'Rapports basiques'],
    couleur: 'emerald',
    populaire: false
  },
  {
    id: 'pro',
    nom: 'Pro',
    prix: 29.99,
    frequence: 'mensuel',
    utilisateurs: 234,
    revenus: 7017,
    fonctionnalites: ['Biens illimitÃ©s', 'Locataires illimitÃ©s', 'Support 24/7', 'Analytics avancÃ©s', 'API access'],
    couleur: 'indigo',
    populaire: true
  },
  {
    id: 'enterprise',
    nom: 'Enterprise',
    prix: 99.99,
    frequence: 'mensuel',
    utilisateurs: 89,
    revenus: 8899,
    fonctionnalites: ['Tout Pro', 'Multi-agences', 'White-label', 'DÃ©diÃ© support', 'SLA garanti'],
    couleur: 'purple',
    populaire: false
  }
];

export default function SubscriptionsManagement() {  const [plansData, setPlansData] = useState(fallbackPlans);  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  useEffect(() => {
        let mounted = true;    
        getAdminSubscriptions()      
        .then((data) => {        
          if (!mounted) return;        
          setPlansData(Array.isArray(data) && data.length ? data : fallbackPlans);      })      .catch(() => {       if (!mounted) return;        setPlansData(fallbackPlans);      })      .finally(() => {        if (mounted) setLoading(false);     });   return () => {      mounted = false;    };  }, []);

  const totalMRR = plansData.reduce((acc, plan) => acc + plan.revenus, 0);
  const totalUsers = plansData.reduce((acc, plan) => acc + plan.utilisateurs, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gestion des abonnements</h1>
          <p className="text-gray-400">Configurez les plans et suivez les revenus rÃ©currents</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
          <Zap size={18} />
          CrÃ©er un plan
        </button>
      </div>

      {/* Stats MRR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Crown className="text-white" size={24} />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Mensuel</span>
          </div>
          <p className="text-4xl font-bold mb-1">{totalMRR.toLocaleString()} â‚¬</p>
          <p className="text-indigo-200">MRR (Monthly Recurring Revenue)</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-emerald-300">
            <TrendingUp size={16} />
            <span>+12.5% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Users className="text-emerald-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalUsers}</p>
          <p className="text-gray-400">Utilisateurs payants</p>
          <p className="text-sm text-emerald-400 mt-2">68.4% de conversion</p>
        </div>

        <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Building2 className="text-amber-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">156</p>
          <p className="text-gray-400">Nouveaux ce mois</p>
          <p className="text-sm text-gray-500 mt-2">Objectif: 200</p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plansData.map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-[#1E293B] border rounded-2xl p-6 relative ${
              plan.populaire ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-gray-800'
            }`}
          >
            {plan.populaire && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  PLUS POPULAIRE
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{plan.nom}</h3>
              <button 
                onClick={() => setEditingPlan(plan.id)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{plan.prix}â‚¬</span>
              <span className="text-gray-500">/mois</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Utilisateurs</span>
                <span className="text-white font-semibold">{plan.utilisateurs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Revenus</span>
                <span className="text-emerald-400 font-semibold">{plan.revenus.toLocaleString()}â‚¬/mois</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {plan.fonctionnalites.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                  <Check size={14} className="text-emerald-400" />
                  {feat}
                </div>
              ))}
            </div>

            <button className="w-full py-3 border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 text-gray-300 rounded-xl transition-all flex items-center justify-center gap-2 group">
              Modifier le plan
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Lien vers revenus dÃ©taillÃ©s */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <TrendingUp className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Analyse dÃ©taillÃ©e des revenus</h3>
            <p className="text-gray-400">Graphiques, churn rate, LTV, cohortes...</p>
          </div>
        </div>
        <a 
          href="/admin/abonnements/revenus" 
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
        >
          Voir les rapports
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}
