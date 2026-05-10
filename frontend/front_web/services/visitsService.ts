import { API_BASE, getHeaders, handleResponse } from './http';
import type { Visit } from '@/types/location';

export async function createVisit(payload: { property_id: number; tenant_id: number; scheduled_date: string }): Promise<Visit> {
  const response = await fetch(`${API_BASE}/visits/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Visit>(response);
}

export async function updateVisit(id: number, payload: Partial<Visit>): Promise<Visit> {
  const response = await fetch(`${API_BASE}/visits/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Visit>(response);
}

export async function completeVisit(id: number): Promise<Visit> {
  const response = await fetch(`${API_BASE}/visits/${id}/complete/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse<Visit>(response);
}

