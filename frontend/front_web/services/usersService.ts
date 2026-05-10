// Service dédié au compte utilisateur (profil connecté + onboarding + activation).

import { API_BASE, getHeaders, handleResponse } from './http';
import type { CurrentUser } from '@/types/user';

// Récupère l'utilisateur connecté (profil minimal + statut).
export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await fetch(`${API_BASE}/auth/me/`, { headers: getHeaders() });
  const raw = await handleResponse<any>(response);

  // Supporte plusieurs formats de réponse possibles.
  const profile = raw?.profile || raw?.person || raw?.user_profile || raw;
  const user = raw?.user || raw;

  return {
    id: user?.id ?? profile?.id,
    email: user?.email ?? profile?.email,
    role: profile?.role ?? user?.role,
    account_status: profile?.account_status ?? user?.account_status,
    onboarding_completed: profile?.onboarding_completed ?? user?.onboarding_completed,
    activation_requested: profile?.activation_requested ?? user?.activation_requested,
    name: profile?.name ?? profile?.nom ?? profile?.first_name + ' ' + profile?.last_name,
    phone: profile?.phone ?? profile?.telephone ?? profile?.phone_number,
    ...(user?.is_superuser !== undefined
      ? { is_superuser: user.is_superuser }
      : raw?.is_superuser !== undefined
        ? { is_superuser: raw.is_superuser }
        : {}),
  } as CurrentUser;
}

// Met à jour des champs simples sur l'utilisateur connecté.
export async function updateCurrentUser(
  payload: Partial<Pick<CurrentUser, 'role' | 'account_status' | 'onboarding_completed'>>
): Promise<CurrentUser> {
  const response = await fetch(`${API_BASE}/auth/me/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<CurrentUser>(response);
}

// Envoie une demande d'activation auprès de l'admin.
export async function requestActivation(plan?: string): Promise<{ requested: boolean }> {
  const response = await fetch(`${API_BASE}/auth/activation-requests/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(plan ? { plan } : {}),
  });
  return handleResponse<{ requested: boolean }>(response);
}

// Crée le profil utilisateur côté backend après l'onboarding.
export async function createProfile(payload: {
  role: 'owner' | 'tenant' | 'admin';
  onboarding_completed: boolean;
}): Promise<CurrentUser> {
  const response = await fetch(`${API_BASE}/auth/profile/create/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<CurrentUser>(response);
}
