'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, MessageSquare } from 'lucide-react';
import { getApplications } from '@/services/applicationsService';
import type { Application } from '@/types/location';

export default function ClientCandidaturesPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'all' | 'pending' | 'under_review' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getApplications({ scope: 'tenant' })
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

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Mes candidatures</h1>
          <p className="text-sm text-gray-500 mt-1">Suivez l’avancement de vos demandes</p>
          <div className="flex gap-2 mt-4 flex-wrap">
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
          {loading && <div className="p-6 text-gray-500">Chargement...</div>}
          {!loading && filtered.length === 0 && <div className="p-6 text-gray-500">Aucune candidature</div>}

          {!loading && filtered.map((a) => {
            const ownerObj = typeof a.owner === 'object' && a.owner ? a.owner : null;
            const ownerName = ownerObj?.name || `${ownerObj?.first_name || ''} ${ownerObj?.last_name || ''}`.trim() || 'Propriétaire';

            const propertyObj = typeof a.property === 'object' && a.property ? a.property : null;
            const propertyId = typeof a.property === 'number' ? a.property : propertyObj?.id;
            const propertyTitle = a.property_title || propertyObj?.title || (propertyId ? `Bien #${propertyId}` : 'Bien');
            return (
              <div key={a.id} className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="text-emerald-600" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{propertyTitle}</p>
                    <p className="text-sm text-gray-600 truncate">Propriétaire: {ownerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Statut: <span className="font-medium">{String(a.status)}</span> • Dossier: <span className="font-medium">{String(a.dossier_status)}</span>
                    </p>
                    {a.message && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">Message: {a.message}</p>
                    )}
                    {a.rejection_reason && (
                      <p className="text-xs text-red-600 mt-1 truncate">Motif: {a.rejection_reason}</p>
                    )}
                  </div>
                </div>

                {a.conversation_id && (
                  <a
                    href={`/client/messages?conversation=${a.conversation_id}`}
                    className="px-3 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-2 flex-shrink-0"
                  >
                    <MessageSquare size={16} />
                    Message
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
