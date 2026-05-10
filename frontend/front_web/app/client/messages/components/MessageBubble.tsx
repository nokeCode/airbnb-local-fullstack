'use client';

import { CheckCheck, Check } from 'lucide-react';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const isTemp = message.id <= 0;
  
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
          isMe
            ? 'bg-emerald-600 text-white'
            : 'bg-white border border-gray-300 text-gray-900'
        } ${isTemp ? 'opacity-70' : ''}`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        {/* Métadonnées */}
        <div className={`flex items-center gap-1 mt-2 text-xs ${isMe ? 'text-emerald-200' : 'text-gray-500'}`}>
          <span>
            {new Date(message.created_at).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          
          {isMe && (
            <>
              {message.is_read ? (
                <CheckCheck size={14} className="text-emerald-300" />
              ) : (
                <Check size={14} className="text-emerald-400/60" />
              )}
              {isTemp && <span className="text-gray-400">Envoi...</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
