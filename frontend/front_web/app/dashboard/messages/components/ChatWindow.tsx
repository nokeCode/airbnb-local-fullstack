'use client';

import { useMessages } from '../hooks/useMessages';
import { useWebSocket } from '../hooks/useWebSocket';
import { TenantInfo } from './TenantInfo';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { QuickReplies } from './QuickReplies';
import { EmptyState } from './EmptyState';
import { MoreVertical, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getDisplayName } from '@/lib/displayName';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getApplications, updateApplication } from '@/services/applicationsService';
import type { Application } from '@/types/location';

interface ChatWindowProps {
  conversationId: number | null;
  currentUserId: number;
}

export function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationActionLoading, setApplicationActionLoading] = useState<null | 'accepted' | 'rejected'>(null);

  const {
    messages,
    conversation,
    loading,
    error,
    hasMore,
    loadMore,
    sendMessage,
    addIncomingMessage,
    markAsRead,
    markSentAsRead,
  } = useMessages(conversationId, currentUserId);

  useWebSocket({
    onNewMessage: (message, convId) => {
      if (convId === conversationId) {
        addIncomingMessage(message);
      }
    },
    onReadReceipt: (convId, userId) => {
      if (convId === conversationId) {
        markSentAsRead();
      }
    },
    onPresenceChange: (userId, status) => {
      console.log(`Locataire ${userId} est ${status}`);
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationId, messages.length]);

  const tenant = conversation
    ? ((conversation as any).other_user ?? (conversation as any).tenant ?? (conversation as any).user)
    : null;
  const property = conversation ? ((conversation as any).property ?? null) : null;
  const tenantName = getDisplayName(tenant) || 'Conversation';
  const tenantInitial = tenantName.charAt(0).toUpperCase();
  const tenantId = tenant && typeof tenant.id === 'number' ? tenant.id : null;

  useEffect(() => {
    let mounted = true;

    async function fetchApplication() {
      if (!conversationId) {
        if (!mounted) return;
        setApplication(null);
        setApplicationLoading(false);
        setApplicationError(null);
        return;
      }

      try {
        setApplicationLoading(true);
        setApplicationError(null);

        // NB: certains backends ne supportent pas les query params `conversation_id`,
        // donc on récupère la liste et on filtre côté front.
        const all = await getApplications({ scope: 'owner' });

        const byConversation = Array.isArray(all)
          ? all.find((a) => Number((a as any).conversation_id) === conversationId) ?? null
          : null;
        if (mounted && byConversation) {
          setApplication(byConversation);
          return;
        }

        // Fallback: tenter avec propriété + locataire si dispo (naming backend variable).
        const propertyId = typeof property?.id === 'number' ? property.id : null;
        if (propertyId && tenantId) {
          const byPair = Array.isArray(all)
            ? all.find((a) => {
                const p = (a as any).property;
                const t = (a as any).tenant;
                const pid = typeof p === 'number' ? p : Number(p?.id);
                const tid = typeof t === 'number' ? t : Number(t?.id);
                return pid === propertyId && tid === tenantId;
              }) ?? null
            : null;
          if (mounted && byPair) {
            setApplication(byPair);
            return;
          }
        }

        if (mounted) setApplication(null);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : String(e);
        setApplication(null);
        setApplicationError(msg || 'Erreur lors du chargement de la candidature');
      } finally {
        if (mounted) setApplicationLoading(false);
      }
    }

    fetchApplication();
    return () => {
      mounted = false;
    };
  }, [conversationId, property?.id, tenantId]);

  const canAccept = useMemo(() => {
    if (!application) return false;
    if (applicationActionLoading) return false;
    if (applicationLoading) return false;
    return application.status !== 'accepted';
  }, [application, applicationActionLoading, applicationLoading]);

  const canReject = useMemo(() => {
    if (!application) return false;
    if (applicationActionLoading) return false;
    if (applicationLoading) return false;
    return application.status !== 'rejected';
  }, [application, applicationActionLoading, applicationLoading]);

  const onApplicationAction = async (nextStatus: 'accepted' | 'rejected') => {
    if (!application) return;
    const prev = application;
    setApplicationActionLoading(nextStatus);
    setApplication({ ...application, status: nextStatus });
    setApplicationError(null);
    try {
      const updated = await updateApplication(application.id, { status: nextStatus } as any);
      setApplication(updated ?? { ...application, status: nextStatus });
      // Pour éviter que le message "candidature non trouvée" persiste.
      setApplicationError(null);
    } catch (e) {
      setApplication(prev);
      const msg = e instanceof Error ? e.message : String(e);
      setApplicationError(msg || 'Action impossible');
    } finally {
      setApplicationActionLoading(null);
    }
  };

  if (!conversationId) {
    return <EmptyState />;
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!conversation && messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Info locataire */}
      {tenant && property && (
        <TenantInfo 
          tenant={{
            ...tenant,
            rating: 4.5,
            dossierStatus: 'complete',
            income: 3200,
            guarantor: true,
            visitDate: '2024-03-25',
            applicationDate: '2024-03-20',
            phone: '+33612345678',
            email: 'jean.dupont@email.com',
          }}
          property={property}
        />
      )}

      {/* Header conversation */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {tenantInitial}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{tenantName}</h3>
            <p className="text-xs text-gray-500">
              {property?.title ?? 'Conversation'}
            </p>
            {applicationLoading && (
              <p className="text-[11px] text-gray-400">Chargement candidature...</p>
            )}
            {!applicationLoading && application && (
              <p className="text-[11px] text-gray-500">Candidature: <span className="font-medium">{String(application.status)}</span></p>
            )}
            {!applicationLoading && applicationError && (
              <p className="text-[11px] text-red-500">{applicationError}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onApplicationAction('accepted')}
            disabled={!canAccept}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              canAccept ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-200 text-white cursor-not-allowed'
            }`}
            title={!application ? 'Aucune candidature liée à cette conversation' : undefined}
          >
            <CheckCircle size={16} />
            {applicationActionLoading === 'accepted' ? 'Acceptation...' : 'Accepter candidature'}
          </button>
          <button
            onClick={() => onApplicationAction('rejected')}
            disabled={!canReject}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              canReject ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-red-100 text-red-300 cursor-not-allowed'
            }`}
            title={!application ? 'Aucune candidature liée à cette conversation' : undefined}
          >
            <XCircle size={16} />
            {applicationActionLoading === 'rejected' ? 'Refus...' : 'Refuser'}
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {hasMore && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Charger plus de messages...
            </button>
          </div>
        )}

        {/* Date separator */}
        <div className="flex items-center justify-center py-4">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Aujourd'hui
          </span>
        </div>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={
              message.id === 0
                ? true
                : tenantId
                  ? message.sender_id !== tenantId
                  : message.sender_id === currentUserId
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* Input zone */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <QuickReplies 
            onSelect={(text) => sendMessage(text, `temp_${Date.now()}`)}
            context="application"
          />
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition-colors">
            <Calendar size={16} />
            Proposer visite
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition-colors">
            <FileText size={16} />
            Demander doc
          </button>
        </div>
        
        <MessageInput 
          onSend={sendMessage}
          disabled={!conversationId}
          placeholder="Répondre au locataire..."
        />
      </div>
    </div>
  );
}
