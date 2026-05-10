// app/owner/messages/components/EmptyState.tsx
// VERSION SPÉCIFIQUE PROPRIÉTAIRE

'use client';

import { MessageSquare, Users, Building2 } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={48} className="text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Gérez vos conversations
        </h3>
        
        <p className="text-gray-500 mb-6">
          Sélectionnez une conversation pour répondre aux candidats, gérer les demandes de visite ou suivre les problèmes de maintenance.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="text-emerald-600" size={20} />
            </div>
            <p className="text-sm font-medium text-gray-900">12 candidatures</p>
            <p className="text-xs text-gray-500">en attente</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Building2 className="text-amber-600" size={20} />
            </div>
            <p className="text-sm font-medium text-gray-900">3 demandes</p>
            <p className="text-xs text-gray-500">de visite ce jour</p>
          </div>
        </div>

        <Link
          href="/dashboard/biens"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Building2 size={20} />
          Voir mes biens
        </Link>
      </div>
    </div>
  );
}