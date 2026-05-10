// Service dédié aux actions admin (ex: demandes d'activation).

import { API_BASE, getHeaders, handleResponse } from './http';
import type { ActivationRequest } from '@/types/user';
import type { Notification } from '@/types/notification';

// Tableau de bord admin (agrégats).
export type AdminDashboardData = {
  stats: Array<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    color: 'indigo' | 'emerald' | 'amber' | 'purple' | 'blue' | 'red';
    detail?: string;
  }>;
  revenue: Array<{ mois: string; revenus: number; objectif: number }>;
  user_distribution: Array<{ name: string; value: number; color: string }>;
  subscriptions: Array<{ mois: string; gratuit: number; basic: number; popular: number; premium: number }>;
  alerts: Array<{ id: string | number; type: string; title: string; message: string; time: string }>;
  activity: Array<{ id: string | number; action: string; details: string; time: string; type?: string }>;
};

// Liste des demandes d'activation en attente.
export async function getActivationRequests(): Promise<ActivationRequest[]> {
  const response = await fetch(`${API_BASE}/auth/admin/activation-requests/`, {
    headers: getHeaders(),
  });
  return handleResponse<ActivationRequest[]>(response);
}

// Valide une demande d'activation.
export async function approveActivationRequest(requestId: string): Promise<{ approved: boolean }> {
  const response = await fetch(`${API_BASE}/auth/admin/activation-requests/${requestId}/approve/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse<{ approved: boolean }>(response);
}

// Rejette une demande d'activation (optionnel).
export async function rejectActivationRequest(requestId: string): Promise<{ rejected: boolean }> {
  const response = await fetch(`${API_BASE}/auth/admin/activation-requests/${requestId}/reject/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse<{ rejected: boolean }>(response);
}

// Récupère les notifications admin.
export async function getAdminNotifications(): Promise<Notification[]> {
  const response = await fetch(`${API_BASE}/auth/admin/notifications/`, {
    headers: getHeaders(),
  });
  return handleResponse<Notification[]>(response);
}

// Marque une notification comme lue.
export async function markAdminNotificationRead(id: string): Promise<{ read: boolean }> {
  const response = await fetch(`${API_BASE}/auth/admin/notifications/${id}/read/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse<{ read: boolean }>(response);
}

// Marque toutes les notifications comme lues.
export async function markAllAdminNotificationsRead(): Promise<{ read_all: boolean }> {
  const response = await fetch(`${API_BASE}/auth/admin/notifications/read-all/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse<{ read_all: boolean }>(response);
}

// Supprime une notification.
export async function deleteAdminNotification(id: string): Promise<{ deleted: boolean }> {
  const response = await fetch(`${API_BASE}/auth/admin/notifications/${id}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<{ deleted: boolean }>(response);
}

// Liste des utilisateurs (admin).
export async function getAdminUsers(params?: {
  search?: string;
  role?: string;
  account_status?: string;
  page?: number;
  page_size?: number;
}): Promise<{ results: any[]; count: number }> {
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const response = await fetch(`${API_BASE}/auth/admin/users/${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) {
    return { results: data, count: data.length };
  }
  return {
    results: Array.isArray(data.results) ? data.results : [],
    count: typeof data.count === 'number' ? data.count : 0,
  };
}

// Dashboard admin (agrégats).
export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const response = await fetch(`${API_BASE}/auth/admin/dashboard/`, {
    headers: getHeaders(),
  });
  return handleResponse<AdminDashboardData>(response);
}

// Transactions admin.
export async function getAdminTransactions(params?: {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<{ results: any[]; count: number }> {
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const response = await fetch(`${API_BASE}/auth/admin/transactions/${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) {
    return { results: data, count: data.length };
  }
  return { results: Array.isArray(data.results) ? data.results : [], count: data.count || 0 };
}

// Biens admin.
export async function getAdminProperties(params?: {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<{ results: any[]; count: number }> {
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const response = await fetch(`${API_BASE}/auth/admin/properties/${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) {
    return { results: data, count: data.length };
  }
  return { results: Array.isArray(data.results) ? data.results : [], count: data.count || 0 };
}

// Maintenance admin.
export async function getAdminMaintenance(params?: {
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<{ results: any[]; count: number }> {
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const response = await fetch(`${API_BASE}/auth/admin/maintenance/${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) {
    return { results: data, count: data.length };
  }
  return { results: Array.isArray(data.results) ? data.results : [], count: data.count || 0 };
}

// Abonnements admin.
export async function getAdminSubscriptions(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/auth/admin/subscriptions/`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<any>(response);
  return Array.isArray(data) ? data : data.results || [];
}

// Rapports admin.
export async function getAdminReports(): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/reports/`, {
    headers: getHeaders(),
  });
  return handleResponse<any>(response);
}

// Logs admin.
export async function getAdminLogs(params?: {
  level?: string;
  page?: number;
  page_size?: number;
}): Promise<{ results: any[]; count: number }> {
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const response = await fetch(`${API_BASE}/auth/admin/logs/${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) {
    return { results: data, count: data.length };
  }
  return { results: Array.isArray(data.results) ? data.results : [], count: data.count || 0 };
}

// Création d'un utilisateur par l'admin.
export async function createAdminUser(payload: {
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'owner' | 'tenant';
  account_status?: 'active' | 'pending' | 'blocked';
  password?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/users/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(response);
}

// Récupère un utilisateur par ID.
export async function getAdminUser(userId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/users/${userId}/`, {
    headers: getHeaders(),
  });
  return handleResponse<any>(response);
}

// Met à jour un utilisateur.
export async function updateAdminUser(userId: string, payload: any): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(response);
}

// Supprime un utilisateur.
export async function deleteAdminUser(userId: string): Promise<{ deleted: boolean }> {
  const response = await fetch(`${API_BASE}/auth/admin/users/${userId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<{ deleted: boolean }>(response);
}

// Change le statut d'un utilisateur.
export async function toggleAdminUserStatus(userId: string, newStatus: 'active' | 'blocked' | 'pending'): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ account_status: newStatus }),
  });
  return handleResponse<any>(response);
}

// Action de groupe pour les utilisateurs (activer/bloquer/supprimer).
export async function bulkAdminUserAction(userIds: string[], action: 'activate' | 'suspend' | 'delete'): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/users/bulk-action/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_ids: userIds, action }),
  });
  return handleResponse<any>(response);
}

// Envoyer un email à des utilisateurs.
export async function sendEmailToUsers(userIds: string[], subject: string, message: string): Promise<any> {
  const response = await fetch(`${API_BASE}/auth/admin/users/send-email/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_ids: userIds, subject, message }),
  });
  return handleResponse<any>(response);
}
