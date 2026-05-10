// app/client/messages/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { api } from '@/lib/api';
import { getCurrentUserIdFromToken } from '@/lib/auth';
import { getCurrentUser } from '@/services/usersService';

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState(0);
  const handledPropertyRef = useRef(false);

  // Recuperer l'ID depuis l'URL si present (pour lien direct)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const uid = getCurrentUserIdFromToken();
    if (typeof uid === 'number') setCurrentUserId(uid);
    getCurrentUser()
      .then((u) => {
        const id = Number((u as any)?.id);
        if (Number.isFinite(id)) setCurrentUserId(id);
      })
      .catch(() => {
        // ignore: token decode fallback already applied
      });

    const params = new URLSearchParams(window.location.search);
    const convId = params.get('conversation');
    const propertyId = params.get('property');

    if (convId) {
      const id = Number(convId);
      if (Number.isFinite(id)) setSelectedConversationId(id);
      return;
    }

    if (propertyId && !handledPropertyRef.current) {
      handledPropertyRef.current = true;
      api
        .createConversation(Number(propertyId), 'Bonjour, je suis interesse par ce bien.')
        .then((res) => {
          setSelectedConversationId(res.id);
          const next = new URLSearchParams(window.location.search);
          next.set('conversation', String(res.id));
          next.delete('property');
          const suffix = next.toString();
          window.history.replaceState(null, '', `/client/messages${suffix ? `?${suffix}` : ''}`);
        })
        .catch((err) => {
          console.error('Erreur creation conversation:', err);
        });
    }
  }, []);

  const handleSelectConversation = (id: number) => {
    const nextId = Number(id);
    if (!Number.isFinite(nextId)) return;
    setSelectedConversationId(nextId);
    if (typeof window === 'undefined') return;
    const next = new URLSearchParams(window.location.search);
    next.set('conversation', String(nextId));
    next.delete('property');
    const suffix = next.toString();
    window.history.replaceState(null, '', `/client/messages${suffix ? `?${suffix}` : ''}`);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-white">
      <ConversationList
        selectedId={selectedConversationId}
        onSelect={handleSelectConversation}
      />
      
      <ChatWindow
        conversationId={selectedConversationId}
        currentUserId={currentUserId}
      />
    </div>
  );
}
