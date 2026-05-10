'use client';

import { useMessages } from '../hooks/useMessages';
import { useWebSocket } from '../hooks/useWebSocket';
import { TenantInfo } from './TenantInfo';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { QuickReplies } from './QuickReplies';
import { EmptyState } from './EmptyState';
import { Phone, Video, MoreVertical, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getDisplayName } from '@/lib/displayName';
import { useEffect, useRef } from 'react';

interface ChatWindowProps {
  conversationId: number | null;
  currentUserId: number;
}

export function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    conversation,
    loading,
    error,
    hasMore,
    loadMore,
    sendMessage,
    addIncomingMessage,
    markAsRead,
  } = useMessages(conversationId, currentUserId);

  useWebSocket({
    onNewMessage: (message, convId) => {
      if (convId === conversationId) {
        addIncomingMessage(message);
      }
    },
    onReadReceipt: (convId, userId) => {
      if (convId === conversationId) {
        markAsRead();
      }
    },
    onPresenceChange: (userId, status) => {
      console.log(`Locataire ${userId} est ${status}`);
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationId, messages.length]);

  if (!conversationId) {
    return <EmptyState />;
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!conversation && messages.length === 0) {
    return <EmptyState />;
  }

  const tenant = conversation
    ? ((conversation as any).other_user ?? (conversation as any).tenant ?? (conversation as any).user)
    : null;
  const property = conversation ? ((conversation as any).property ?? null) : null;
  const tenantName = getDisplayName(tenant) || 'Conversation';
  const tenantInitial = tenantName.charAt(0).toUpperCase();
  const tenantId = tenant && typeof tenant.id === 'number' ? tenant.id : null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Info locataire */}
      {tenant && property && (
        <TenantInfo 
          tenant={{
            ...tenant,
            rating: 4.5,
            dossierStatus: 'complete',
            income: 3200,
            guarantor: true,
            visitDate: '2024-03-25',
            applicationDate: '2024-03-20',
            phone: '+33612345678',
            email: 'jean.dupont@email.com',
          }}
          property={property}
        />
      )}

      {/* Header conversation */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {tenantInitial}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{tenantName}</h3>
            <p className="text-xs text-gray-500">
              {property?.title ?? 'Conversation'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
            <CheckCircle size={16} />
            Accepter candidature
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
            <XCircle size={16} />
            Refuser
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {hasMore && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Charger plus de messages...
            </button>
          </div>
        )}

        {/* Date separator */}
        <div className="flex items-center justify-center py-4">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Aujourd'hui
          </span>
        </div>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={
              message.id === 0
                ? true
                : tenantId
                  ? message.sender_id !== tenantId
                  : message.sender_id === currentUserId
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* Input zone */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <QuickReplies 
            onSelect={(text) => sendMessage(text, `temp_${Date.now()}`)}
            context="application"
          />
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition-colors">
            <Calendar size={16} />
            Proposer visite
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition-colors">
            <FileText size={16} />
            Demander doc
          </button>
        </div>
        
        <MessageInput 
          onSend={sendMessage}
          disabled={!conversationId}
          placeholder="Répondre au locataire..."
        />
      </div>
    </div>
  );
}
