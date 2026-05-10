// app/owner/messages/hooks/useWebSocket.ts
// COPIE EXACTE de app/client/messages/hooks/useWebSocket.ts

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { getChatSocket } from '@/lib/websocket';
import { WebSocketPayload, Message } from '@/types/chat';

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (conversationId: number, content: string, tempId: string) => void;
  updateTypingStatus: (conversationId: number, isTyping: boolean) => void;
}

export function useWebSocket(
  handlers: {
    onNewMessage?: (message: Message, conversationId: number) => void;
    onReadReceipt?: (conversationId: number, userId: number) => void;
    onPresenceChange?: (userId: number, status: string) => void;
  } = {}
): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<ReturnType<typeof getChatSocket> | null>(null);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const token = localStorage.getItem('access') || localStorage.getItem('token');
    if (!token) return;

    const socket = getChatSocket(token);
    socketRef.current = socket;

    socket.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    socket.onMessage((data: WebSocketPayload) => {
      switch (data.type) {
        case 'new_message':
          if (data.message) {
            handlersRef.current.onNewMessage?.(data.message, data.conversation_id!);
          }
          break;
        case 'read_receipt':
          if (data.conversation_id && data.user_id) {
            handlersRef.current.onReadReceipt?.(data.conversation_id, data.user_id);
          }
          break;
        case 'presence':
          if (data.user_id && data.status) {
            handlersRef.current.onPresenceChange?.(data.user_id, data.status);
          }
          break;
        case 'error':
          console.error('[WebSocket] Erreur serveur:', data.error);
          break;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((conversationId: number, content: string, tempId: string) => {
    const socket = socketRef.current;
    if (!socket) return;

    const success = socket.send({
      type: 'message',
      conversation_id: conversationId,
      content,
      temp_id: tempId,
    });

    if (!success) {
      console.warn('Envoi via HTTP fallback...');
    }
  }, []);

  const updateTypingStatus = useCallback((conversationId: number, isTyping: boolean) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.send({
      type: 'typing',
      conversation_id: conversationId,
      is_typing: isTyping,
    });
  }, []);

  return {
    isConnected,
    sendMessage,
    updateTypingStatus,
  };
}
