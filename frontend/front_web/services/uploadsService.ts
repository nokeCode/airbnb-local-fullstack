// Service dédié aux uploads de fichiers.

import { API_BASE, getAuthHeader, handleResponse } from './http';

// Envoie un fichier en pièce jointe avec FormData.
export async function uploadAttachment(
  file: File,
  conversationId: number
): Promise<{ url: string; name: string; type: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('conversation_id', conversationId.toString());

  const response = await fetch(`${API_BASE}/uploads/`, {
    method: 'POST',
    // Content-Type est géré automatiquement par le navigateur pour FormData.
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
  return handleResponse(response);
}
