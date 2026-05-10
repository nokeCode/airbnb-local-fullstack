import { API_BASE, buildQuery, getHeaders, handleResponse } from './http';
import type { Contract, CreateContractPayload, CreatePaymentPayload, ContractsDashboard } from '@/app/types/contract';

// Récupère la liste des contrats avec filtres optionnels.
export async function getContracts(
  params?: Record<string, string | number | undefined | null>
): Promise<unknown[]> {
  const url = `${API_BASE}/contracts/${buildQuery(params)}`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse(response);
}

// Récupère les stats globales côté dashboard (admin).
export async function getContractsDashboard(): Promise<unknown> {
  const response = await fetch(`${API_BASE}/contracts/dashboard/`, { headers: getHeaders() });
  return handleResponse(response);
}

// Récupère les paiements d'un contrat.
export async function getContractPayments(contractId: number): Promise<unknown[]> {
  const response = await fetch(`${API_BASE}/contracts/${contractId}/payments/`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

// Récupère les détails d'un contrat spécifique.
export async function getContractDetail(contractId: number): Promise<Contract> {
  const response = await fetch(`${API_BASE}/contracts/${contractId}/`, {
    headers: getHeaders(),
  });
  return (handleResponse(response) as unknown) as Contract;
}

// Crée un nouveau contrat.
export async function createContract(payload: CreateContractPayload): Promise<Contract> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_BASE}/contracts/`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'multipart/form-data' }), // Let browser set boundary
    body: formData,
  });
  return handleResponse<Contract>(response);
}

// Termine/résilie un contrat.
export async function terminateContract(contractId: number): Promise<Contract> {
  const response = await fetch(`${API_BASE}/contracts/${contractId}/terminate/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse<Contract>(response);
}

// Crée un nouveau paiement pour un contrat.
export async function createPayment(contractId: number, payload: CreatePaymentPayload): Promise<unknown> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_BASE}/contracts/${contractId}/payments/`, {
    method: 'POST',
    body: formData, // No Content-Type for FormData
  });
  return handleResponse(response);
}
