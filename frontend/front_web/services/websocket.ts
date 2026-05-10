// lib/websocket.ts

import { WebSocketPayload } from '@/types/chat';

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000
  private messageHandlers: ((data: WebSocketPayload) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []

  constructor(private url: string, private token: string) {}

  connect(): void {
    try {
    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      console.log('[WebSocket] Connecté');
      this.reconnectAttempts = 0;
      this.notifyConnection(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketPayload = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error('[WebSocket] Erreur parsing message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('[WebSocket] Déconnecté');
      this.notifyConnection(false);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('[WebSocket] Erreur:', error);
    };

  } catch (error) {
    console.error('[WebSocket] Erreur connexion:', error);
  }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`[WebSocket] Tentative reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private notifyConnection(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  send(data: unknown): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    console.warn('[WebSocket] Non connecté, message non envoyé');
    return false;
  }

  onMessage(handler: (data: WebSocketPayload) => void)): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onConnectionChange(handler: (connected: boolean) => void)): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  disconnect(): void {
    this.ws?.close();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN ?? false;
  }
}

// Singleton pour l'app
let chatSocket: ChatWebSocket | null = null;

export function getChatSocket(token: string): ChatWebSocket {
  if (!chatSocket) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/chat';
    chatSocket = new ChatWebSocket(wsUrl, token);
  chatSocket.connect();
  }
  return chatSocket;
}

export function disconnectChatSocket(): void {
  chatSocket?.disconnect();
  chatSocket = null;
}