import { API_BASE, buildQuery, getHeaders, handleResponse } from './http';
import type { Lease } from '@/types/location';

export async function getLeases(params?: Record<string, string | number | undefined | null>): Promise<Lease[]> {
  const response = await fetch(`${API_BASE}/leases/${buildQuery(params)}`, { headers: getHeaders() });
  const data = await handleResponse<any>(response);
  if (Array.isArray(data)) return data as Lease[];
  return Array.isArray(data?.results) ? (data.results as Lease[]) : Array.isArray(data?.leases) ? (data.leases as Lease[]) : [];
}

export async function getLease(id: number): Promise<Lease> {
  const response = await fetch(`${API_BASE}/leases/${id}/`, { headers: getHeaders() });
  return handleResponse<Lease>(response);
}

export async function createLease(payload: { application_id: number }): Promise<Lease> {
  const response = await fetch(`${API_BASE}/leases/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Lease>(response);
}

export async function updateLease(id: number, payload: Partial<Lease>): Promise<Lease> {
  const response = await fetch(`${API_BASE}/leases/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Lease>(response);
}

export async function signLease(id: number, payload?: Record<string, unknown>): Promise<Lease> {
  const response = await fetch(`${API_BASE}/leases/${id}/sign/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload ?? {}),
  });
  return handleResponse<Lease>(response);
}

