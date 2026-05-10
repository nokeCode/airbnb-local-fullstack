'use client';

import { useState } from 'react';

interface QuickRepliesProps {
  onSelect: (text: string) => void;
  context: 'application' | 'visit' | 'maintenance' | 'general';
}

const repliesByContext = {
  application: [
    "Bonjour, merci pour votre intérêt. Votre dossier est en cours d'étude.",
    "Votre dossier est complet. Souhaitez-vous visiter ce week-end ?",
    "Pourriez-vous m'envoyer votre dernière fiche de paie ?",
    "Le bien est malheureusement déjà loué. Je vous tiens informé des prochains.",
  ],
  visit: [
    "La visite est confirmée pour samedi à 14h. Voici l'adresse exacte...",
    "Pouvez-vous me confirmer votre présence pour la visite de demain ?",
    "Je suis disponible mardi ou jeudi après-midi, cela vous convient ?",
    "Voici le code d'accès immeuble et mes coordonnées.",
  ],
  maintenance: [
    "J'envoie un technicien dans les 24h. Merci pour votre patience.",
    "Pouvez-vous me décrire précisément le problème ?",
    "C'est noté, je prends en charge la réparation.",
    "Le plombier passe demain matin entre 9h et 12h.",
  ],
  general: [
    "Merci pour votre message, je vous réponds rapidement.",
    "Pouvez-vous me donner plus de détails ?",
    "C'est noté, je reviens vers vous.",
    "Avez-vous d'autres questions ?",
  ],
};

export function QuickReplies({ onSelect, context }: QuickRepliesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const replies = repliesByContext[context] || repliesByContext.general;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
      >
        ⚡ Réponses rapides
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 py-2">
            Réponses suggérées
          </p>
          <div className="space-y-1">
            {replies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(reply);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors line-clamp-2"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}