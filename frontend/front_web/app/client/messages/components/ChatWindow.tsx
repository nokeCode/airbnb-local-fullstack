'use client';

import { Phone, Video, MoreVertical, Info } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useWebSocket } from '../hooks/useWebSocket';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
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
    markSentAsRead,
  } = useMessages(conversationId, currentUserId);

  // WebSocket pour temps réel
  useWebSocket({
    onNewMessage: (message, convId) => {
      // Le hook useMessages gère déjà la mise à jour
      if (convId === conversationId) addIncomingMessage(message);
    },
    onReadReceipt: (convId, userId) => {
      if (convId === conversationId) {
        markSentAsRead();
      }
    },
    onPresenceChange: (userId, status) => {
      console.log(`Utilisateur ${userId} est ${status}`);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!conversation && messages.length === 0) {
    return <EmptyState />;
  }

  const otherUser = conversation
    ? ((conversation as any).other_user ?? (conversation as any).user ?? (conversation as any).owner)
    : null;
  const otherName = getDisplayName(otherUser) || 'Conversation';
  const otherUserId = otherUser && typeof otherUser.id === 'number' ? otherUser.id : null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            {otherName.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900">{otherName}</h3>
            {conversation?.property && (
              <p className="text-xs text-gray-500">{conversation.property.title}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Appeler"
          >
            <Phone size={20} />
          </button>
          
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Visio"
          >
            <Video size={20} />
          </button>
          
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Plus d'options"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {hasMore && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Charger plus de messages...
            </button>
          </div>
        )}
        
        
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={
              message.id === 0
                ? true
                : otherUserId
                  ? message.sender_id !== otherUserId
                  : message.sender_id === currentUserId
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <MessageInput 
          onSend={sendMessage}
          disabled={!conversationId}
        />
      </div>
    </div>
  );
}
