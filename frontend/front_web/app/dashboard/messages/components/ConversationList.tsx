'use client';

import { useOwnerConversations } from '../hooks/useOwnerConversations';
import { Search, Filter, Star, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { getDisplayName } from '@/lib/displayName';

interface ConversationListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { conversations, loading, filter, setFilter } = useOwnerConversations();
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'Tous', count: 24 },
    { id: 'unread', label: 'Non lus', count: 8 },
    { id: 'applications', label: 'Candidatures', count: 12 },
    { id: 'maintenance', label: 'Maintenance', count: 3 },
  ];

  if (loading && conversations.length === 0) {
    return (
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          {conversations.reduce((acc, c) => acc + c.unread_count, 0) > 0 && (
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un locataire..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucune conversation</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const otherUser =
              (conv as any).other_user ?? (conv as any).user ?? (conv as any).tenant ?? (conv as any).client ?? null;
            const otherName = getDisplayName(otherUser) || 'Utilisateur';
            const otherInitial = otherName.charAt(0).toUpperCase();

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${
                  selectedId === conv.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                {/* Avatar avec indicateur statut */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {otherInitial}
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{otherName}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(conv.last_message?.created_at || '').toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                {/* Type de conversation */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conv.type === 'application' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : conv.type === 'maintenance'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {conv.type === 'application' ? 'Candidature' : conv.type === 'maintenance' ? 'Maintenance' : 'Général'}
                  </span>
                  {conv.property && (
                    <span className="text-xs text-gray-500 truncate">
                      {conv.property.title}
                    </span>
                  )}
                </div>

                <p className={`text-sm line-clamp-1 ${
                  conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                }`}>
                  {conv.last_message?.content}
                </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
