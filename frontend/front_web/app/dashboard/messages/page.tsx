'use client';

import { useEffect, useState } from 'react';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { getCurrentUserIdFromToken } from '@/lib/auth';
import { getCurrentUser } from '@/services/usersService';

export default function OwnerMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState(0);

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
    if (convId) {
      const id = Number(convId);
      if (Number.isFinite(id)) setSelectedConversationId(id);
    }
  }, []);

  const handleSelectConversation = (id: number) => {
    const nextId = Number(id);
    if (!Number.isFinite(nextId)) return;
    setSelectedConversationId(nextId);
    if (typeof window === 'undefined') return;
    const next = new URLSearchParams(window.location.search);
    next.set('conversation', String(nextId));
    const suffix = next.toString();
    window.history.replaceState(null, '', `/dashboard/messages${suffix ? `?${suffix}` : ''}`);
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
