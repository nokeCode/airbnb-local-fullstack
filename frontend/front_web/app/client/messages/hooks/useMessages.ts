// app/client/messages/hooks/useMessages.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Message, Conversation } from '@/types/chat';

interface UseMessagesReturn {
  messages: Message[];
  conversation: Conversation | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  sendMessage: (content: string, tempId: string) => Promise<void>;
  addIncomingMessage: (message: Message) => void;
  markAsRead: () => Promise<void>;
}

export function useMessages(conversationId: number | null, currentUserId = 0): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const sortMessages = useCallback((list: Message[]) => {
    return [...(Array.isArray(list) ? list : [])].sort((a, b) => {
      const at = new Date(a.created_at).getTime();
      const bt = new Date(b.created_at).getTime();
      if (at !== bt) return at - bt;
      return (a.id || 0) - (b.id || 0);
    });
  }, []);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    try {
      const data = await api.getConversation(conversationId);
      setConversation(data.conversation);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('Conversation introuvable, fallback liste:', message);
      try {
        const list = await api.getConversations();
        const found = list.find((c) => c.id === conversationId) || null;
        if (found) setConversation(found);
      } catch (e) {
        console.error('Erreur fallback conversations:', e);
      }
    }
  }, [conversationId]);

  const fetchMessages = useCallback(async (pageNum = 1, append = false) => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const data = await api.getMessages(conversationId, pageNum);

      if (data?.conversation) {
        setConversation(data.conversation);
      }
      
      const nextMessages = Array.isArray(data?.messages) ? data.messages : [];
      if (append) {
        setMessages(prev => sortMessages([...(Array.isArray(prev) ? prev : []), ...nextMessages]));
      } else {
        setMessages(sortMessages(nextMessages));
      }
      setHasMore(data.has_more);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    try {
      await api.markAsRead(conversationId);
      // Mettre à jour localement
      setMessages(prev =>
        (Array.isArray(prev) ? prev : []).map(msg => ({ ...msg, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error('Erreur mark as read:', err);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setConversation(null);
      setPage(1);
      setHasMore(false);
      setLoading(false);
      setError(null);
      return;
    }

    fetchConversation();
    fetchMessages(1, false);
    markAsRead();
  }, [conversationId, fetchConversation, fetchMessages, markAsRead]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchMessages(page + 1, true);
  }, [hasMore, loading, page, fetchMessages]);

  const sendMessage = useCallback(async (content: string, tempId: string) => {
    if (!conversationId) return;

    // Optimistic update
    const optimisticMessage: Message = {
      id: 0, // Temporaire
      content,
      sender_id: currentUserId,
      sender_name: 'Vous',
      created_at: new Date().toISOString(),
      is_read: true,
      read_at: null,
    };
    
    setMessages(prev => sortMessages([...(Array.isArray(prev) ? prev : []), optimisticMessage]));

    try {
      const sent = await api.sendMessage(conversationId, content);
      
      // Remplacer le message temporaire par le vrai
      setMessages(prev =>
        sortMessages((Array.isArray(prev) ? prev : []).map(msg => (msg.id === 0 ? sent : msg)))
      );
    } catch (err) {
      // Rollback en cas d'erreur
      setMessages(prev => (Array.isArray(prev) ? prev : []).filter(msg => msg.id !== 0));
      throw err;
    }
  }, [conversationId, currentUserId]);

  const addIncomingMessage = useCallback((message: Message) => {
    if (!message || typeof message.id !== 'number') return;
    if (message.id === 0) return;

    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (safePrev.some((m) => m.id === message.id)) return safePrev;
      return sortMessages([...safePrev, message]);
    });
  }, []);

  const markAsRead_UNUSED = useCallback(async () => {
    if (!conversationId) return;
    try {
      await api.markAsRead(conversationId);
      // Mettre à jour localement
      setMessages(prev => 
        (Array.isArray(prev) ? prev : []).map(msg => ({ ...msg, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error('Erreur mark as read:', err);
    }
  }, [conversationId]);

  return {
    messages,
    conversation,
    loading,
    error,
    hasMore,
    loadMore,
    sendMessage,
    addIncomingMessage,
    markAsRead,
  };
}
