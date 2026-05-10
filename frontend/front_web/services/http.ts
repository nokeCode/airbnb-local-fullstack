// Centralise la base URL et les helpers communs pour tous les appels API.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Récupère uniquement le header d'authentification (utile avec FormData).
export function getAuthHeader(): Record<string, string> {
  // Utilise le token d'accès si disponible (fallback sur token legacy).
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('access') || localStorage.getItem('token') || '')
    : '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Construit les headers JSON standard pour les requêtes API.
export function getHeaders(): HeadersInit {
  return {
    ...getAuthHeader(),
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
}

// Headers pour endpoints publics (sans Authorization), même si un token existe.
export function getPublicHeaders(): HeadersInit {
  return {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
}

// Construit une query string propre pour les filtres.
export function buildQuery(
  params?: Record<string, string | number | undefined | null>
): string {
  if (!params) return '';
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `?${query}` : '';
}

// Normalise le parsing des réponses et la gestion d'erreur.
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}
