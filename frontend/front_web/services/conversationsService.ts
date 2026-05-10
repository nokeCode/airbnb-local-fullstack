// Service dédié aux conversations (liste et détail).

import { API_BASE, getHeaders, handleResponse } from './http';
import { Conversation, Message } from '@/types/chat';

// Récupère la liste des conversations de l'utilisateur connecté.
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE}/conversations/`, { headers: getHeaders() });
  const data = await handleResponse<{ conversations: Conversation[] }>(response);
  return data.conversations;
}

// Récupère une conversation et ses messages associés.
export async function getConversation(
  id: number
): Promise<{ conversation: Conversation; messages: Message[] }> {
  const response = await fetch(`${API_BASE}/conversations/${id}/`, { headers: getHeaders() });
  return handleResponse(response);
}

// Crée une conversation à partir d'un bien et d'un premier message.
export async function createConversation(
  propertyId: number,
  initialMessage: string
): Promise<{ id: number; created: boolean }> {
  const response = await fetch(`${API_BASE}/conversations/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      property_id: propertyId,
      initial_message: initialMessage,
    }),
  });
  return handleResponse(response);
}
