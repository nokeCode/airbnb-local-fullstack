'use client';

import { MapPin, SlidersHorizontal } from 'lucide-react';
import { ClientFilters, defaultRentalFilters } from './filters';

type SearchHeaderProps = {
  filters: ClientFilters;
  onChange: (next: ClientFilters) => void;
};

export function SearchHeader({ filters, onChange }: SearchHeaderProps) {
  const safeFilters = {
    ...defaultRentalFilters,
    ...filters,
    types: filters.categoryTypes ?? [],
    availability: [],
    equipements: [],
  };
  const chips = [
    {
      id: 'price',
      label: 'Prix',
    value: `${safeFilters.price_min || 0}€ - ${safeFilters.price_max || 999999}€`,
      active: safeFilters.price_min !== defaultRentalFilters.price_min || safeFilters.price_max !== defaultRentalFilters.price_max,
      onRemove: () => onChange({ ...safeFilters, price_min: defaultRentalFilters.price_min, price_max: defaultRentalFilters.price_max } as ClientFilters)
    },
    {
      id: 'type',
      label: 'Type',
      value: safeFilters.types.length ? safeFilters.types.map(t => t.toUpperCase()).join(', ') : 'Tous',
      active: safeFilters.types.length > 0,
      onRemove: () => onChange({ ...safeFilters, types: [] })
    },
    {
      id: 'surface',
      label: 'Surface',
      value: `${safeFilters.surface_min || 0}m² - ${safeFilters.surface_max || 999}m²`,
      active: safeFilters.surface_min !== defaultRentalFilters.surface_min || safeFilters.surface_max !== defaultRentalFilters.surface_max,
      onRemove: () => onChange({ ...safeFilters, surface_min: defaultRentalFilters.surface_min, surface_max: defaultRentalFilters.surface_max } as ClientFilters)
    },
    {
      id: 'availability',
      label: 'Disponibilité',
      value: safeFilters.availability.includes('immediate') ? 'Immédiate' : 'Flexible',
      active: safeFilters.availability.length > 0,
      onRemove: () => onChange({ ...safeFilters, availability: [] })
    },
    {
      id: 'meuble',
      label: 'Meublé',
      value: 'Oui',
      active: safeFilters.equipements.includes('meuble'),
      onRemove: () => onChange({ ...safeFilters, equipements: safeFilters.equipements.filter(e => e !== 'meuble') })
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-3xl relative">
          <div className="relative flex items-center">
            <MapPin className="absolute left-4 text-gray-400" size={20} />
            <input
              type="text"
              value={safeFilters.searchQuery}
              onChange={(e) => onChange({ ...safeFilters, searchQuery: e.target.value })}
              placeholder="Où cherchez-vous ? Ex: 'Studio Paris 11e avec balcon, max 900€'"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium">
          <SlidersHorizontal size={18} />
          <span className="hidden md:inline">Filtres</span>
        </button>

        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-900">Liste</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Carte</button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
        {chips.map((filter) => (
          <button
            key={filter.id}
            onClick={filter.active ? filter.onRemove : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter.active
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}: {filter.value}
            {filter.active && <span className="text-emerald-600">×</span>}
          </button>
        ))}
        <button
        onClick={() => onChange({ ...defaultRentalFilters, searchQuery: safeFilters.searchQuery } as ClientFilters)}

          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
        >
          Réinitialiser
        </button>
      </div>
    </header>
  );
}
