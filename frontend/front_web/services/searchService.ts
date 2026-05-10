// Service dédié à la recherche (users, etc.).

import { API_BASE, getHeaders, handleResponse } from './http';
import { User } from '@/types/chat';

// Recherche d'utilisateurs avec un seuil minimal pour éviter le spam réseau.
export async function searchUsers(query: string): Promise<User[]> {
  if (query.length < 2) return [];
  const response = await fetch(`${API_BASE}/users/search/?q=${encodeURIComponent(query)}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<{ results: User[] }>(response);
  return data.results;
}
