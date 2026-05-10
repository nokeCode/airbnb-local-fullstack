'use client';

export interface ClientFilters {
  searchQuery?: string;
  priceMin: number;
  price_max: number;  // snake_case for SearchHeader
  price_min: number;
  surfaceMin: number;
  surface_max: number;
  surface_min: number;
  types: string[];
  categoryTypes?: string[];  // for SearchHeader
  equipements: string[];
  availability: string[];
  locations: string[];
}

export const defaultClientFilters: ClientFilters = {
  searchQuery: '',
  priceMin: 0,
  price_max: 0,
  price_min: 0,
  surfaceMin: 0,
  surface_max: 0,
  surface_min: 0,
  types: [],
  categoryTypes: [],
  equipements: [],
  availability: [],
  locations: [],
};

// Main export expected by page.tsx and SearchHeader
export const defaultRentalFilters: ClientFilters = defaultClientFilters;
export const defaultSaleFilters = defaultRentalFilters;


