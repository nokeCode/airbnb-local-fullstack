// Service dédié aux messages d'une conversation.

import { API_BASE, getHeaders, handleResponse } from './http';
import { Message } from '@/types/chat';

// Récupère les messages paginés d'une conversation.
export async function getMessages(
  conversationId: number,
  page = 1,
  pageSize = 50
): Promise<{ messages: Message[]; has_more: boolean; next_page: number | null }> {
  const response = await fetch(
    `${API_BASE}/conversations/${conversationId}/messages/?page=${page}&page_size=${pageSize}`,
    { headers: getHeaders() }
  );
  return handleResponse(response);
}

// Envoie un message texte dans une conversation.
export async function sendMessage(
  conversationId: number,
  content: string
): Promise<Message> {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
}

// Marque les messages d'une conversation comme lus.
export async function markAsRead(
  conversationId: number
): Promise<{ marked_as_read: number }> {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/read/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
}
