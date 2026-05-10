// app/client/messages/components/ConversationList.tsx

'use client';

import { useConversations } from '../hooks/useConversations';
import { SearchBar } from './SearchBar';
import { formatDistanceToNow } from '@/lib/utils';
import { getDisplayName } from '@/lib/displayName';

interface ConversationListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const {
    conversations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    searchConversations,
  } = useConversations();

  if (loading && conversations.length === 0) {
    return (
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
        <SearchBar 
          onSearch={searchConversations} 
          placeholder="Rechercher un contact..."
        />
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucune conversation</p>
            <p className="text-sm mt-2">Commencez à discuter avec un propriétaire</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const otherUser = (conv as any).other_user ?? (conv as any).user ?? (conv as any).owner ?? null;
            const otherName = getDisplayName(otherUser) || 'Utilisateur';
            const otherInitial = otherName.charAt(0).toUpperCase();
            const isOnline = Boolean(otherUser && otherUser.is_online);
            return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${
                selectedId === conv.id ? 'bg-emerald-50/50 border-l-4 border-l-emerald-500' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                  {otherInitial}
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {otherName}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {conv.last_message?.created_at && formatDistanceToNow(new Date(conv.last_message.created_at))}
                  </span>
                </div>

                {conv.property && (
                  <p className="text-xs text-emerald-600 font-medium truncate">
                    {conv.property.title}
                  </p>
                )}

                {conv.last_message && (
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                    {conv.last_message.content}
                  </p>
                )}
              </div>

              {/* Badge non lus */}
              {conv.unread_count > 0 && (
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </button>
          )})
        )}
      </div>
    </div>
  );
}
