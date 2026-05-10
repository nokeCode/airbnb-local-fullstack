'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FileText, MessageSquare, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { getApplications, updateApplication } from '@/services/applicationsService';
import type { Application } from '@/types/location';

export default function CandidaturesPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'all' | 'pending' | 'under_review' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getApplications({ scope: 'owner' })
      .then((data) => {
        if (mounted) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setItems([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (status === 'all') return items;
    return items.filter((a) => a.status === status);
  }, [items, status]);

  const onAction = async (id: number, nextStatus: 'accepted' | 'rejected') => {
    const prev = items;
    setItems((cur) => cur.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)));
    try {
      await updateApplication(id, { status: nextStatus } as any);
    } catch {
      setItems(prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Candidatures"
        subtitle="Gérez les demandes de location"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <Filter size={18} className="text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'under_review', 'accepted', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  status === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'Tous' : s === 'pending' ? 'En attente' : s === 'under_review' ? 'En revue' : s === 'accepted' ? 'Acceptées' : 'Rejetées'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Liste</h3>
            <span className="text-sm text-gray-500">{filtered.length} candidature(s)</span>
          </div>

          <div className="divide-y divide-gray-100">
            {loading && (
              <div className="p-6 text-gray-500">Chargement...</div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="p-6 text-gray-500">Aucune candidature</div>
            )}

            {!loading && filtered.map((a) => {
              const tenantObj = typeof a.tenant === 'object' && a.tenant ? a.tenant : null;
              const tenantName = a.tenant_name || tenantObj?.name || `${tenantObj?.first_name || ''} ${tenantObj?.last_name || ''}`.trim() || 'Locataire';

              const propertyObj = typeof a.property === 'object' && a.property ? a.property : null;
              const propertyId = typeof a.property === 'number' ? a.property : propertyObj?.id;
              const propertyTitle = a.property_title || propertyObj?.title || (propertyId ? `Bien #${propertyId}` : 'Bien');
              return (
                <div key={a.id} className="p-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="text-blue-600" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{tenantName}</p>
                      <p className="text-sm text-gray-600 truncate">{propertyTitle}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Statut: <span className="font-medium">{String(a.status)}</span> • Dossier: <span className="font-medium">{String(a.dossier_status)}</span>
                      </p>
                      {a.message && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">Message: {a.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {a.conversation_id && (
                      <a
                        href={`/dashboard/messages?conversation=${a.conversation_id}`}
                        className="px-3 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-2"
                        title="Ouvrir le chat"
                      >
                        <MessageSquare size={16} />
                        Chat
                      </a>
                    )}

                    {a.status !== 'accepted' && (
                      <button
                        onClick={() => onAction(a.id, 'accepted')}
                        className="px-3 py-2 rounded-xl text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Accepter
                      </button>
                    )}
                    {a.status !== 'rejected' && (
                      <button
                        onClick={() => onAction(a.id, 'rejected')}
                        className="px-3 py-2 rounded-xl text-sm bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Rejeter
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
