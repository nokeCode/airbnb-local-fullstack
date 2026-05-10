// app/owner/messages/components/MessageInput.tsx
// COPIE avec placeholder personnalisable

'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string, tempId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  onSend, 
  disabled,
  placeholder = "Écrivez votre message..." 
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!content.trim() && !attachment) return;
    
    const tempId = `temp_${Date.now()}`;
    onSend(content, tempId);
    setContent('');
    setAttachment(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Joindre un fichier"
      >
        <Paperclip size={20} />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />

      {attachment && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700 truncate max-w-[150px]">
            {attachment.name}
          </span>
          <button
            onClick={() => setAttachment(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={disabled || (!content.trim() && !attachment)}
        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send size={18} />
      </button>
    </div>
  );
}