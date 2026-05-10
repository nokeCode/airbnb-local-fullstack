'use client';

import { Header } from "@/components/dashboard/Header";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getContracts, getContractPayments } from '@/services/contractsService';
import { getProperties, getPropertyExpenses } from '@/services/propertiesService';

type Contract = {
  id: number;
  amount: string | number;
  contract_type: 'rent' | 'sale' | string;
  property_details?: { title?: string };
  client_details?: { first_name?: string; last_name?: string };
};

type Property = {
  id: number;
  title: string;
};

type Payment = {
  id: number;
  amount: string | number;
  status?: string;
  payment_date?: string;
  created_at?: string;
};

type Expense = {
  id: number;
  amount: string | number;
  description?: string;
  expense_date?: string;
  start_date?: string;
  end_date?: string;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  type: 'revenu' | 'charge';
  montant: number;
  statut: 'reçu' | 'payé' | 'en retard';
  bien: string;
};

export default function FinancesPage() {
  const [filtre, setFiltre] = useState<'tous' | 'revenu' | 'charge'>('tous');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [paymentsMap, setPaymentsMap] = useState<Record<number, Payment[]>>({});
  const [expensesMap, setExpensesMap] = useState<Record<number, Expense[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement contrats + biens puis paiements/dépenses associés.
    let mounted = true;
    Promise.all([getContracts(), getProperties()])
      .then(async ([ctrs, props]) => {
        if (!mounted) return;
        const contractsData = Array.isArray(ctrs) ? ctrs : [];
        const propertiesData = Array.isArray(props) ? props : [];
        setContracts(contractsData);
        setProperties(propertiesData);

        // Récupération des paiements par contrat.
        const paymentsEntries = await Promise.all(
          contractsData.map(async (c: Contract) => {
            try {
              const list = await getContractPayments(c.id);
              return [c.id, Array.isArray(list) ? list : []] as const;
            } catch {
              return [c.id, []] as const;
            }
          })
        );
        if (mounted) setPaymentsMap(Object.fromEntries(paymentsEntries));

        // Récupération des dépenses par bien.
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
        setContracts([]);
        setProperties([]);
        setPaymentsMap({});
        setExpensesMap({});
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

  const { transactions, statsFinances } = useMemo(() => {
    // Construit la liste des transactions à partir des paiements et dépenses.
    const tx: Transaction[] = [];

    contracts.forEach((c) => {
      const propertyTitle = c.property_details?.title || 'Bien';
      const payments = paymentsMap[c.id] || [];

      payments.forEach((p) => {
        const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount;
        const date = p.payment_date || p.created_at || new Date().toISOString().slice(0, 10);
        const status = (p.status || '').toLowerCase();
        const statut = status.includes('late') || status.includes('retard') ? 'en retard' : 'reçu';

        tx.push({
          id: `pay-${c.id}-${p.id}`,
          date,
          description: `Paiement - ${propertyTitle}`,
          type: 'revenu',
          montant: Number.isFinite(amount) ? amount : 0,
          statut,
          bien: propertyTitle,
        });
      });
    });

    properties.forEach((p) => {
      const expenses = expensesMap[p.id] || [];
      expenses.forEach((e) => {
        const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
        const date = e.expense_date || e.start_date || new Date().toISOString().slice(0, 10);

        tx.push({
          id: `exp-${p.id}-${e.id}`,
          date,
          description: e.description || `Dépense - ${p.title}`,
          type: 'charge',
          montant: Number.isFinite(amount) ? -Math.abs(amount) : 0,
          statut: 'payé',
          bien: p.title,
        });
      });
    });

    // Agrégats financiers.
    const revenus = tx.filter(t => t.type === 'revenu').reduce((s, t) => s + t.montant, 0);
    const charges = tx.filter(t => t.type === 'charge').reduce((s, t) => s + Math.abs(t.montant), 0);
    const cashflow = revenus - charges;

    const statsFinances = [
      { label: 'Revenus du mois', value: formatFCFA(revenus), change: 'Màj', icon: Wallet, color: 'emerald' },
      { label: 'Charges du mois', value: formatFCFA(charges), change: 'Màj', icon: TrendingUp, color: 'red' },
      { label: 'Cash-flow net', value: formatFCFA(cashflow), change: 'Màj', icon: ArrowUpRight, color: 'blue' },
      { label: 'Impayés', value: formatFCFA(0), change: 'À jour', icon: AlertCircle, color: 'amber' },
    ];

    return { transactions: tx, statsFinances };
  }, [contracts, properties, paymentsMap, expensesMap]);

  const transactionsFiltrees = transactions.filter(t =>
    filtre === 'tous' ? true : t.type === filtre
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Finances"
        subtitle="Suivi de vos revenus, charges et cash-flow"
        actionLabel="Nouvelle transaction"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsFinances.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {['tous', 'revenu', 'charge'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltre(f as typeof filtre)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filtre === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'tous' ? 'Toutes' : f === 'revenu' ? 'Revenus' : 'Charges'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                <FileText size={16} />
                Rapport fiscal
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Download size={16} />
                Exporter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Bien</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4" colSpan={5}>
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                )}
                {!loading && transactionsFiltrees.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          t.type === 'revenu' ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                          {t.type === 'revenu' ? (
                            <ArrowUpRight size={16} className="text-emerald-600" />
                          ) : (
                            <ArrowDownRight size={16} className="text-red-600" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.bien}</td>
                    <td className={`px-6 py-4 font-bold ${
                      t.type === 'revenu' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {t.montant > 0 ? '+' : ''}{formatFCFA(Math.abs(t.montant))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.statut === 'reçu' || t.statut === 'payé'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Simulation fiscale 2024</h3>
              <p className="text-indigo-100 text-sm">Estimez vos impôts sur les revenus fonciers</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">~ {formatFCFA(2450)}</p>
              <p className="text-indigo-200 text-sm">Impôt estimé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
