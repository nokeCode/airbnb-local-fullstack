// lib/api.ts

import { Conversation, Message, User } from '@/types/chat';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function normalizeMessage(raw: any): Message {
  const id = Number(raw?.id ?? raw?.pk ?? 0);
  const senderId = Number(raw?.sender_id ?? raw?.sender?.id ?? raw?.sender?.pk ?? raw?.user_id ?? 0);
  const createdAt = raw?.created_at ?? raw?.createdAt ?? raw?.timestamp ?? raw?.sent_at ?? raw?.created ?? null;
  const readAt = raw?.read_at ?? raw?.readAt ?? null;
  const isRead = Boolean(raw?.is_read ?? raw?.isRead ?? raw?.read ?? (readAt != null));

  return {
    id: Number.isFinite(id) ? id : 0,
    content: String(raw?.content ?? raw?.message ?? raw?.text ?? ''),
    sender_id: Number.isFinite(senderId) ? senderId : 0,
    sender_name: String(raw?.sender_name ?? raw?.sender?.name ?? raw?.sender?.username ?? raw?.user?.name ?? ''),
    created_at: typeof createdAt === 'string' && createdAt ? createdAt : new Date().toISOString(),
    is_read: isRead,
    read_at: typeof readAt === 'string' ? readAt : null,
    attachment: raw?.attachment ?? null,
  };
}

// Helper pour les headers
function getHeaders(): HeadersInit {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('access') || localStorage.getItem('token'))
    : '';
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  };
}

// Gestion des erreurs
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let message = `HTTP ${response.status}`;

    try {
      if (contentType.includes('application/json')) {
        const json = await response.json();
        message = (json && (json.message || json.detail || json.error)) || message;
      } else {
        const text = await response.text();
        if (text && text.trim()) message = text.slice(0, 200);
      }
    } catch {
      // ignore parsing errors, keep default message
    }

    throw new Error(message);
  }
  return response.json();
}

export const api = {
  // ========== CONVERSATIONS ==========
  
  getConversations: async (): Promise<Conversation[]> => {
    const response = await fetch(`${API_BASE}/conversations/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<any>(response);
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.conversations) ? data.conversations : [];
  },

  getOwnerConversations: async (): Promise<Conversation[]> => {
    const response = await fetch(`${API_BASE}/owner/conversations/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<any>(response);
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.conversations) ? data.conversations : [];
  },

  getConversation: async (id: number): Promise<{ conversation: Conversation; messages: Message[] }> => {
    const response = await fetch(`${API_BASE}/conversations/${id}/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<any>(response);
    if (data && data.conversation) return data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return { conversation: data as Conversation, messages: Array.isArray((data as any).messages) ? (data as any).messages : [] };
    }
    return { conversation: data as Conversation, messages: [] };
  },

  createConversation: async (propertyId: number, initialMessage: string): Promise<{ id: number; created: boolean }> => {
    const response = await fetch(`${API_BASE}/conversations/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        property_id: propertyId,
        initial_message: initialMessage,
      }),
    });
    const data = await handleResponse<any>(response);
    const id = Number(data?.id ?? data?.conversation_id ?? data?.conversation?.id);
    if (!Number.isFinite(id)) {
      throw new Error('Réponse création conversation invalide');
    }
    const created = Boolean(data?.created ?? data?.is_created ?? true);
    return { id, created };
  },

  // ========== MESSAGES ==========
  
  getMessages: async (conversationId: number, page = 1, pageSize = 50): Promise<{
    messages: Message[];
    has_more: boolean;
    next_page: number | null;
    conversation?: Conversation;
  }> => {
    const response = await fetch(
      `${API_BASE}/conversations/${conversationId}/messages/?page=${page}&page_size=${pageSize}`,
      { headers: getHeaders() }
    );
    const data = await handleResponse<any>(response);

    const messagesRaw: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.messages)
        ? data.messages
        : Array.isArray(data?.results)
          ? data.results
          : [];

    const messages: Message[] = messagesRaw.map(normalizeMessage);

    const has_more = Boolean(
      data?.has_more ??
      data?.hasMore ??
      data?.next_page ??
      data?.next
    );

    const next_page: number | null = typeof data?.next_page === 'number' ? data.next_page : null;

    const conversation: Conversation | undefined =
      data?.conversation && typeof data.conversation === 'object' ? data.conversation : undefined;

    return { messages, has_more, next_page, conversation };
  },

  sendMessage: async (conversationId: number, content: string): Promise<Message> => {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    const data = await handleResponse<any>(response);
    return normalizeMessage(data);
  },

  markAsRead: async (conversationId: number): Promise<{ marked_as_read: number }> => {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/read/`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // ========== RECHERCHE ==========
  
  searchUsers: async (query: string): Promise<User[]> => {
    if (query.length < 2) return [];
    const response = await fetch(`${API_BASE}/users/search/?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<{ results: User[] }>(response);
    return data.results;
  },

  // ========== UPLOAD ==========
  
  uploadAttachment: async (file: File, conversationId: number): Promise<{ url: string; name: string; type: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', conversationId.toString());

    const response = await fetch(`${API_BASE}/uploads/`, {
      method: 'POST',
      headers: {
        'Authorization': getHeaders().Authorization, // Content-Type auto avec FormData
      },
      body: formData,
    });
    return handleResponse(response);
  },
};
