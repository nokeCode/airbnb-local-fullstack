'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Receipt,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  CreditCard
} from 'lucide-react';
import { getAdminTransactions } from '@/services/adminService';

const fallbackTransactions = [
  {
    id: 'TRX-001',
    date: '2024-04-21 14:30:22',
    type: 'paiement',
    montant: 850,
    statut: 'complete',
    description: 'Loyer Appartement 12 - Marie Martin',
    utilisateur: 'Marie Martin',
    role: 'owner',
    methode: 'Carte bancaire •••• 4242',
    reference: 'PAY_123456'
  }
];

const statutConfig = {
  complete: { label: 'Complété', color: 'text-emerald-400 bg-emerald-400/10', icon: CheckCircle2 },
  en_attente: { label: 'En attente', color: 'text-amber-400 bg-amber-400/10', icon: Clock },
  echoue: { label: 'Échoué', color: 'text-red-400 bg-red-400/10', icon: XCircle }
};

const typeConfig = {
  paiement: { label: 'Paiement', icon: Receipt, color: 'text-blue-400' },
  abonnement: { label: 'Abonnement', icon: CreditCard, color: 'text-purple-400' },
  remboursement: { label: 'Remboursement', icon: ArrowDownLeft, color: 'text-orange-400' }
};

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('tous');
  const [status, setStatus] = useState('tous');
  const [transactions, setTransactions] = useState(fallbackTransactions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminTransactions({
      search: search || undefined,
      type: type !== 'tous' ? type : undefined,
      status: status !== 'tous' ? status : undefined,
      page: 1,
      page_size: 50,
    })
      .then((data) => {
        if (!mounted) return;
        setTransactions(Array.isArray(data.results) && data.results.length ? data.results : fallbackTransactions);
      })
      .catch(() => {
        if (!mounted) return;
        setTransactions(fallbackTransactions);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [search, type, status]);

  const totalEntrees = transactions
    .filter((t: any) => t.statut === 'complete' && t.montant > 0)
    .reduce((acc: number, t: any) => acc + t.montant, 0);

  const totalSorties = transactions
    .filter((t: any) => t.statut === 'complete' && t.montant < 0)
    .reduce((acc: number, t: any) => acc + Math.abs(t.montant), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Transactions financières</h1>
          <p className="text-gray-400">Suivi des paiements, abonnements et remboursements</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <ArrowUpRight className="text-emerald-400" size={24} />
            </div>
            <span className="text-sm text-gray-500">Ce mois</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalEntrees.toLocaleString()} FCFA</p>
          <p className="text-sm text-emerald-400">Entrées</p>
        </div>

        <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <ArrowDownLeft className="text-red-400" size={24} />
            </div>
            <span className="text-sm text-gray-500">Ce mois</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalSorties.toLocaleString()} FCFA</p>
          <p className="text-sm text-red-400">Sorties</p>
        </div>

        <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Receipt className="text-indigo-400" size={24} />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{(totalEntrees - totalSorties).toLocaleString()} FCFA</p>
          <p className="text-sm text-indigo-400">Balance nette</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher par ID, référence, utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500">
              <option value="tous">Tous les types</option>
              <option value="paiement">Paiements</option>
              <option value="abonnement">Abonnements</option>
              <option value="remboursement">Remboursements</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500">
              <option value="tous">Tous les statuts</option>
              <option value="complete">Complétés</option>
              <option value="en_attente">En attente</option>
              <option value="echoue">Échoués</option>
            </select>
            <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center gap-2">
              <Calendar size={18} />
              Période
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="admin-card bg-[#1E293B] border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0F172A] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Transaction</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Méthode</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Montant</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-6 text-gray-500">Chargement...</td></tr>
            ) : (
              transactions.map((trx: any) => {
                const TypeIcon = typeConfig[trx.type]?.icon || Receipt;
                const StatutIcon = statutConfig[trx.statut]?.icon || CheckCircle2;
                return (
                  <tr key={trx.id} className="hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-gray-800 ${typeConfig[trx.type]?.color || 'text-blue-400'}`}>
                          <TypeIcon size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{trx.description}</p>
                          <p className="text-sm text-gray-500">{trx.id} • {trx.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(trx.date).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {trx.utilisateur?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-white text-sm">{trx.utilisateur}</p>
                          <p className="text-xs text-gray-500 capitalize">{trx.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {trx.methode}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${trx.montant > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trx.montant > 0 ? '+' : ''}{trx.montant} FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statutConfig[trx.statut]?.color || 'text-amber-400 bg-amber-400/10'}`}>
                          <StatutIcon size={12} />
                          {statutConfig[trx.statut]?.label || 'En attente'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
