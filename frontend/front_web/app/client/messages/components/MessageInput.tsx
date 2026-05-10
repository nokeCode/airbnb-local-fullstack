// app/client/messages/components/MessageInput.tsx

'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string, tempId: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
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
      setIsAttaching(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-t border-gray-200">
      {/* Boutons pièces jointes */}
      <div className="flex items-center gap-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <button
          onClick={() => setIsAttaching(!isAttaching)}
          className={`p-2 rounded-lg transition-colors ${
            isAttaching ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Joindre un fichier"
        >
          <Paperclip size={20} />
        </button>

        {isAttaching && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 w-full text-left"
            >
              <ImageIcon size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700">Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 w-full text-left"
            >
              <Paperclip size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700">Document</span>
            </button>
          </div>
        )}
      </div>

      {/* Input texte */}
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Écrivez votre message..."
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />

      {/* Aperçu fichier joint */}
      {attachment && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
          <span className="text-sm text-emerald-700 truncate max-w-[150px]">
            {attachment.name}
          </span>
          <button
            onClick={() => setAttachment(null)}
            className="text-emerald-600 hover:text-emerald-800"
            title="Retirer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Bouton envoyer */}
      <button
        onClick={handleSend}
        disabled={disabled || (!content.trim() && !attachment)}
        className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
