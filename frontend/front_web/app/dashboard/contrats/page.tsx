'use client';

import { Header } from "@/components/dashboard/Header";
import {
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getContracts } from '@/services/contractsService';

type Contract = {
  id: number;
  amount: string | number;
  start_date: string;
  end_date?: string | null;
  contract_type: 'rent' | 'sale' | string;
  document?: string | null;
  property_details?: { title?: string };
  client_details?: { first_name?: string; last_name?: string; email?: string };
  created_at?: string;
};

const getStatutConfig = (endDate: string | null | undefined) => {
  // Calcule le statut à partir de la date de fin.
  if (!endDate) {
    return {
      label: 'Actif',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: FileText,
      joursRestants: null as number | null
    };
  }

  const fin = new Date(endDate);
  const now = new Date();
  const diffDays = Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 180 && diffDays >= 0) {
    return {
      label: `Fin dans ${diffDays} jours`,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: Clock,
      joursRestants: diffDays
    };
  }

  if (diffDays < 0) {
    return {
      label: 'Expiré',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: FileText,
      joursRestants: diffDays
    };
  }

  return {
    label: 'Actif',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: FileText,
    joursRestants: diffDays
  };
};

export default function ContratsPage() {
  const [filtre, setFiltre] = useState<'tous' | 'actifs' | 'fin_proche' | 'archives'>('tous');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement des contrats selon le rôle via l'API.
    let mounted = true;
    getContracts()
      .then((data) => {
        if (mounted) setContracts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setContracts([]);
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

  const { filtered, expiringCount } = useMemo(() => {
    // Filtre la liste selon l'état calculé.
    const mapped = contracts.map((c) => {
      const statut = getStatutConfig(c.end_date);
      return { ...c, _statut: statut };
    });

    const expiring = mapped.filter((c) => c._statut.joursRestants !== null && c._statut.joursRestants <= 180 && c._statut.joursRestants >= 0).length;

    const filtered = mapped.filter((c) => {
      if (filtre === 'tous') return true;
      if (filtre === 'actifs') return c._statut.joursRestants === null || (c._statut.joursRestants ?? 0) > 180;
      if (filtre === 'fin_proche') return c._statut.joursRestants !== null && c._statut.joursRestants <= 180 && c._statut.joursRestants >= 0;
      if (filtre === 'archives') return c._statut.joursRestants !== null && c._statut.joursRestants < 0;
      return true;
    });

    return { filtered, expiringCount: expiring };
  }, [contracts, filtre]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header 
        title="Baux & Contrats" 
        subtitle="Gestion de vos contrats de location"
        actionLabel="Nouveau bail"
        actionHref="/dashboard/contrats/ajouter"
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Alerte fin de bail proche */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-amber-600" size={24} />
          <div className="flex-1">
            <p className="font-medium text-amber-900">{expiringCount} bail(s) arrivent à échéance dans moins de 6 mois</p>
            <p className="text-sm text-amber-700">Pensez à contacter vos locataires pour le renouvellement</p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700">
            Voir détails
          </button>
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {['tous', 'actifs', 'fin_proche', 'archives'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f as typeof filtre)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtre === f
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'tous' ? 'Tous les baux' : f === 'actifs' ? 'Baux actifs' : f === 'fin_proche' ? 'Fin proche' : 'Archives'}
            </button>
          ))}
        </div>

        {/* Liste des contrats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contrat</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Locataire & Bien</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Période</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4" colSpan={6}>
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                )}

                {!loading && filtered.map((contrat) => {
                  const statut = getStatutConfig(contrat.end_date);
                  const amount = typeof contrat.amount === 'string' ? parseFloat(contrat.amount) : contrat.amount;
                  const clientName = contrat.client_details
                    ? `${contrat.client_details.first_name || ''} ${contrat.client_details.last_name || ''}`.trim()
                    : 'Client';
                  const propertyTitle = contrat.property_details?.title || 'Bien';

                  return (
                    <tr key={contrat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">CTR-{contrat.id}</p>
                            <p className="text-xs text-gray-500">{contrat.contract_type === 'sale' ? 'Vente' : 'Location'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{clientName || 'Client'}</p>
                        <p className="text-sm text-gray-500">{propertyTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p>{contrat.start_date} → {contrat.end_date || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{Number.isFinite(amount) ? formatFCFA(amount as number) : '—'}</p>
                          <p className="text-xs text-gray-500">{contrat.contract_type === 'rent' ? 'Loyer mensuel' : 'Montant de vente'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statut.color}`}>
                          <statut.icon size={14} />
                          {statut.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Voir">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Télécharger">
                            <Download size={18} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modèles de contrats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Modèles de contrats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Bail meublé', 'Bail vide', 'Bail commercial'].map((modele) => (
              <div key={modele} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="text-gray-400 group-hover:text-emerald-600" size={24} />
                  <span className="text-xs text-gray-400">PDF</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{modele}</h4>
                <p className="text-sm text-gray-500">Template à jour</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
