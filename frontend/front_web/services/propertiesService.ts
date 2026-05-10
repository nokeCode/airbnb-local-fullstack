import type { PropertyFilters } from '@/app/types/Property';
import type { Property } from '@/app/types/Property';

// Service dédié aux biens immobiliers (properties).
import { API_BASE, buildQuery, getHeaders, getAuthHeader, getPublicHeaders, handleResponse } from './http';

// Récupère la liste des biens avec filtres optionnels.
export async function getProperties(
  params?: Record<string, string | number | undefined | null>
): Promise<Property[]> {
  const queryString = buildQuery(params);
  const url = `${API_BASE}/properties/${queryString}`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse<Property[]>(response);
}

// Récupère tous les biens disponibles (endpoint public).
export async function getAllProperties(): Promise<Property[]> {
  // Côté client (locataire), on veut voir tous les biens publiés.
  // On évite d'envoyer Authorization pour ne pas déclencher un filtrage backend "par utilisateur" par erreur.
  //
  // On supporte aussi les réponses paginées type DRF: { count, next, previous, results }.
  const pageSize = 100;
  const maxPages = 50;

  const fetchAllPages = async (headers: HeadersInit): Promise<Property[]> => {
    let nextUrl: string | null = `${API_BASE}/properties/${buildQuery({ page: 1, page_size: pageSize })}`;
    const all: Property[] = [];
    let pagesFetched = 0;

    while (nextUrl && pagesFetched < maxPages) {
      const response = await fetch(nextUrl, { headers, cache: 'no-store' });
      const data = await handleResponse<unknown>(response);

      if (Array.isArray(data)) {
        if (pagesFetched === 0) return data as Property[];
        all.push(...(data as Property[]));
        break;
      }

      if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.results)) {
          all.push(...(record.results as Property[]));
          nextUrl = typeof record.next === 'string' ? record.next : null;
          pagesFetched += 1;
          continue;
        }
      }

      return [];
    }

    return all;
  };

  const publicProperties = await fetchAllPages(getPublicHeaders());

  // Cas fréquent: quand l'utilisateur est connecté (token présent) et vient de créer un bien,
  // certains backends ne l'exposent pas encore via l'endpoint public.
  // On tente alors une récupération "auth" et on fusionne les résultats.
  try {
    const maybeToken = typeof window !== 'undefined'
      ? (localStorage.getItem('access') || localStorage.getItem('token'))
      : null;
    if (!maybeToken) return publicProperties;

    const authedProperties = await fetchAllPages(getHeaders());
    const merged = new Map<string, Property>();
    [...publicProperties, ...authedProperties].forEach((p) => {
      if (!p) return;
      const id = (p as any).id;
      if (id === undefined || id === null) return;
      merged.set(String(id), p);
    });
    return Array.from(merged.values());
  } catch {
    return publicProperties;
  }
}

// Récupère les biens de l'utilisateur connecté (propriétaire/agent).
export async function getMyProperties(
  params?: Record<string, string | number | undefined | null>
): Promise<Property[]> {
  const url = `${API_BASE}/properties/my-properties/${buildQuery(params)}`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse<Property[]>(response);
}

// Récupère les biens par type de contrat
export async function getPropertiesByType(
  contract_type: 'sale' | 'rent',
  filters?: Partial<PropertyFilters>
): Promise<Property[]> {
  return getProperties({ 
    contract_type, 
    ...filters 
  });
}

// Récupère les dépenses d'un bien précis.
export interface PropertyExpense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export async function getPropertyExpenses(propertyId: number): Promise<PropertyExpense[]> {
  const response = await fetch(`${API_BASE}/properties/${propertyId}/expenses/`, {
    headers: getHeaders(),
  });
  return handleResponse<PropertyExpense[]>(response);
}


// Récupère le détail d'un bien.
export async function getProperty(propertyId: number | string): Promise<Property> {
  const response = await fetch(`${API_BASE}/properties/${propertyId}/`, {
    headers: getHeaders(),
  });
  return handleResponse<Property>(response);
}

// Met à jour un bien (partiel). Utilise PATCH (DRF compatible).
export async function updateProperty(
  propertyId: number | string,
  payload: Partial<Property>
): Promise<Property> {
  const response = await fetch(`${API_BASE}/properties/${propertyId}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Property>(response);
}

// Crée un nouveau bien avec images.
export async function createProperty(payload: FormData): Promise<Property> {
  const response = await fetch(`${API_BASE}/properties/create/`, {
    method: 'POST',
    headers: {
      // Pas de Content-Type car FormData s'en charge automatiquement
      ...getHeaders(),
    },
    body: payload,
  });
  return handleResponse<Property>(response);
}

// Crée un nouveau bien (données JSON sans images).
export async function createPropertyJson(payload: {
  title: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  country?: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  contract_type: 'sale' | 'rent';
  status?: string;
  category_name?: string;
  equipment?: string[];
  latitude?: number;
  longitude?: number;
  monthly_rent?: number;
  monthly_charges?: number;
  available_date?: string;
  owner_name: string;
  owner_phone: string;
}): Promise<Property> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v.toString()));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  const response = await fetch(`${API_BASE}/properties/`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData,
  });
  return handleResponse<Property>(response);
}

// Ajoute des images à un bien existant.
export async function addPropertyImages(propertyId: number | string, images: FormData): Promise<any> {
  const response = await fetch(`${API_BASE}/properties/${propertyId}/images/`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: images,
  });
  return handleResponse<any>(response);
}
