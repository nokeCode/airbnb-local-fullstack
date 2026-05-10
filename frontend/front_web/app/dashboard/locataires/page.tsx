'use client';

import { Header } from "@/components/dashboard/Header";
import {
  Mail,
  Phone,
  Home,
  Calendar,
  FileText,
  MoreHorizontal,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getContracts } from '@/services/contractsService';

type Contract = {
  id: number;
  amount: string | number;
  start_date: string;
  end_date?: string | null;
  contract_type: 'rent' | 'sale' | string;
  property_details?: { title?: string };
  client_details?: { first_name?: string; last_name?: string; email?: string; phone?: string };
};

type Locataire = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  bien: string;
  loyer: number;
  debutBail: string;
  finBail: string;
  statut: 'actif' | 'retard' | 'fin';
  dernierPaiement: string;
  garant: string;
  avatar: string;
};

const statuts = {
  actif: { label: 'À jour', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  retard: { label: 'Impayé', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  fin: { label: 'Bail finissant', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function LocatairesPage() {
  const [search, setSearch] = useState('');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement des contrats pour construire la liste des locataires.
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

  const locataires = useMemo<Locataire[]>(() => {
    // Transforme les contrats en fiches locataires (uniquement pour la location).
    return contracts
      .filter((c) => c.contract_type === 'rent')
      .map((c) => {
        const amount = typeof c.amount === 'string' ? parseFloat(c.amount) : c.amount;
        const clientName = c.client_details
          ? `${c.client_details.first_name || ''} ${c.client_details.last_name || ''}`.trim()
          : `Locataire ${c.id}`;
        const initials = clientName.split(' ').map(s => s[0]).join('').slice(0, 2);

        const fin = c.end_date || '';
        const finDate = fin ? new Date(fin) : null;
        const isEnding = finDate ? (finDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 180 : false;

        return {
          id: c.id,
          nom: clientName || `Locataire ${c.id}`,
          email: c.client_details?.email || `locataire${c.id}@example.com`,
          telephone: c.client_details?.phone || '+228 90 00 00 00',
          bien: c.property_details?.title || 'Bien',
          loyer: Number.isFinite(amount) ? amount : 0,
          debutBail: c.start_date,
          finBail: fin || '—',
          statut: isEnding ? 'fin' : 'actif',
          dernierPaiement: 'Ce mois-ci',
          garant: 'Oui',
          avatar: initials || 'L',
        };
      });
  }, [contracts]);

  const locatairesFiltres = locataires.filter(l =>
    l.nom.toLowerCase().includes(search.toLowerCase()) ||
    l.bien.toLowerCase().includes(search.toLowerCase())
  );

  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Locataires"
        subtitle="Gestion de vos locataires et baux"
        actionLabel="Nouveau locataire"
        actionHref="/dashboard/locataires/ajouter"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un locataire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Locataire</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Bien loué</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Bail</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>Chargement des locataires...</td>
                  </tr>
                )}
                {!loading && locatairesFiltres.map((loc) => {
                  const statut = statuts[loc.statut];
                  return (
                    <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {loc.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{loc.nom}</p>
                            <p className="text-xs text-gray-500">Garant: {loc.garant}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            {loc.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            {loc.telephone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Home size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{loc.bien}</p>
                            <p className="text-xs text-gray-500">{formatFCFA(loc.loyer)}/mois</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm">Du {loc.debutBail}</p>
                            <p className="text-xs text-gray-500">au {loc.finBail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statut.color}`}>
                          <statut.icon size={14} />
                          {statut.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Voir contrat">
                            <FileText size={18} />
                          </button>
                          <a href="/dashboard/messages" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Envoyer message">
                            <Mail size={18} />
                          </a>
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
      </div>
    </div>
  );
}
