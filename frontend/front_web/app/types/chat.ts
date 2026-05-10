// types/chat.ts

export interface User {
  id: number;
  name: string;
  avatar: string | null;
  is_online: boolean;
  last_seen: string | null;
  phone?: string;
}

export interface PropertyPreview {
  id: number;
  title: string;
  price: number;
  address: string;
  image: string | null;
}

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  created_at: string;              // ISO 8601
  is_read: boolean;
  read_at: string | null;
  attachment?: {
    url: string;
    name: string;
    type: string;
  } | null;
}

export interface Conversation {
  id: number;
  type?: string;
  other_user: User;
  property: PropertyPreview | null;
  last_message: {
    content: string;
    created_at: string;
    is_read: boolean;
    sender_id: number;
  } | null;
  unread_count: number;
  updated_at: string;
}

export interface WebSocketMessage {
  type: 'new_message' | 'read_receipt' | 'presence' | 'error';
  // ... champs selon type
}
