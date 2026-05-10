import { API_BASE, buildQuery, getHeaders, handleResponse } from './http';
import type { Application } from '@/types/location';

export async function getApplications(params?: Record<string, string | number | undefined | null>): Promise<Application[]> {
  const response = await fetch(`${API_BASE}/applications/${buildQuery(params)}`, { headers: getHeaders() });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) return data as Application[];
  return Array.isArray(data?.results) ? (data.results as Application[]) : Array.isArray(data?.applications) ? (data.applications as Application[]) : [];
}

export async function getApplication(id: number): Promise<Application> {
  const response = await fetch(`${API_BASE}/applications/${id}/`, { headers: getHeaders() });
  return handleResponse<Application>(response);
}

export async function createApplication(payload: { property_id: number; message?: string }): Promise<Application> {
  const response = await fetch(`${API_BASE}/applications/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Application>(response);
}

export async function updateApplication(id: number, payload: Partial<Application>): Promise<Application> {
  const response = await fetch(`${API_BASE}/applications/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Application>(response);
}

export async function cancelApplication(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/applications/${id}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  await handleResponse<any>(response);
}

