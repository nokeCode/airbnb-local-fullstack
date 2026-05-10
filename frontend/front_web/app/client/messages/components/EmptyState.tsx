// app/client/messages/components/EmptyState.tsx

'use client';

import { MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={48} className="text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Sélectionnez une conversation
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-md">
          Choisissez un contact dans la liste ou parcourez nos annonces pour trouver un propriétaire.
        </p>

        <Link
          href="/client/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <Search size={20} />
          Rechercher un bien
        </Link>
      </div>
    </div>
  );
}