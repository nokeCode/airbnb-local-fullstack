// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper pour les headers
function getHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
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
    const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // ========== CONVERSATIONS ==========
  
  getConversations: async (): Promise<Conversation[]> => {
    const response = await fetch(`${API_BASE}/conversations/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<{ conversations: Conversation[] }>(response);
    return data.conversations;
  },

  getConversation: async (id: number): Promise<{ conversation: Conversation; messages: Message[] }> => {
    const response = await fetch(`${API_BASE}/conversations/${id}/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
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
    return handleResponse(response);
  },

  // ========== MESSAGES ==========
  
  getMessages: async (conversationId: number, page = 1, pageSize = 50): Promise<{
    messages: Message[];
    has_more: boolean;
    next_page: number | null;
  }> => {
    const response = await fetch(
      `${API_BASE}/conversations/${conversationId}/messages/?page=${page}&page_size=${pageSize}`,
      { headers: getHeaders() }
    );
    return handleResponse(response);
  },

  sendMessage: async (conversationId: number, content: string): Promise<Message> => {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
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