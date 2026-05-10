// app/client/messages/hooks/useConversations.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Conversation } from '@/types/chat';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getConversations();
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
    
    // Polling toutes les 30s si pas de WebSocket
    const interval = setInterval(() => {
      fetchConversations();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchConversations]);

  const refresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  const searchConversations = useCallback(async (query: string) => {
    if (query.length < 2) return;
    try {
      const results = await api.searchUsers(query);
      // Filtrer les conversations existantes ou proposer nouvelle conversation
      return results;
    } catch (err) {
      console.error('Erreur recherche:', err);
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    searchConversations,
  };
}
