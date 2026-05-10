'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Conversation } from '@/types/chat';

export function useOwnerConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'applications' | 'maintenance'>('all');

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Endpoint spécifique propriétaire
      const data = await api.getOwnerConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const filteredConversations = conversations.filter(conv => {
    switch (filter) {
      case 'unread':
        return conv.unread_count > 0;
      case 'applications':
        return conv.type === 'application';
      case 'maintenance':
        return conv.type === 'maintenance';
      default:
        return true;
    }
  });

  const refresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    loading,
    error,
    filter,
    setFilter,
    refresh,
  };
}