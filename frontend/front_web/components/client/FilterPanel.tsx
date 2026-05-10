'use client';

import type { ChangeEvent } from 'react';
import { Euro, Maximize, BedDouble, PawPrint, Car, Wifi } from 'lucide-react';
import { ClientFilters } from './filters';

type FilterPanelProps = {
  filters: ClientFilters;
  onChange: (next: ClientFilters) => void;
  onReset: () => void;
};

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const safeFilters = {
    ...filters,
    types: filters.types ?? [],
    equipements: filters.equipements ?? [],
    availability: filters.availability ?? [],
    locations: filters.locations ?? [],
  };
  const types = [
    { id: 'studio', label: 'Studio' },
    { id: 't1', label: 'T1' },
    { id: 't2', label: 'T2' },
    { id: 't3', label: 'T3+' },
    { id: 'maison', label: 'Maison' },
    { id: 'loft', label: 'Loft' },
  ];

  const equipements = [
    { id: 'meuble', label: 'Meublé', icon: BedDouble },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'animaux', label: 'Animaux OK', icon: PawPrint },
    { id: 'internet', label: 'Internet', icon: Wifi },
  ];

  const handlePriceMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...filters, priceMin: value });
  };

  const handlePriceMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...filters, priceMax: value });
  };

  const handleSurfaceMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...filters, surfaceMin: value });
  };

  const handleSurfaceMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...filters, surfaceMax: value });
  };

  const toggleType = (id: string) => {
    const next = safeFilters.types.includes(id)
      ? safeFilters.types.filter(t => t !== id)
      : [...safeFilters.types, id];
    onChange({ ...safeFilters, types: next });
  };

  const toggleEquipement = (id: string) => {
    const next = safeFilters.equipements.includes(id)
      ? safeFilters.equipements.filter(e => e !== id)
      : [...safeFilters.equipements, id];
    onChange({ ...safeFilters, equipements: next });
  };

  const toggleAvailability = (id: string) => {
    const next = safeFilters.availability.includes(id)
      ? safeFilters.availability.filter(a => a !== id)
      : [...safeFilters.availability, id];
    onChange({ ...safeFilters, availability: next });
  };

  const toggleLocation = (label: string) => {
    const next = safeFilters.locations.includes(label)
      ? safeFilters.locations.filter(l => l !== label)
      : [...safeFilters.locations, label];
    onChange({ ...safeFilters, locations: next });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-140px)] overflow-y-auto sticky top-[140px]">
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Filtrer par</h3>
          <button
            onClick={onReset}
            className="text-sm text-gray-500 hover:text-emerald-600"
          >
            Réinitialiser
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Type de bien</p>
          <div className="flex gap-2 mb-4">
            <button className="flex-1 py-2 px-3 bg-gray-900 text-white text-sm font-medium rounded-xl">Location</button>
            <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200">Achat</button>
          </div>
          <div className="space-y-2">
            {types.map((type) => (
              <label
                key={type.id}
                onClick={() => toggleType(type.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  safeFilters.types.includes(type.id)
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300 group-hover:border-emerald-400'
                }`}>
                  {safeFilters.types.includes(type.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm ${safeFilters.types.includes(type.id) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                >
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Budget mensuel</p>
            <span className="text-sm font-bold text-emerald-600">
              {safeFilters.priceMin}€ - {safeFilters.priceMax}€
            </span>
          </div>
          <div className="flex items-end gap-1 h-16 mb-4 px-2">
            {[40, 65, 80, 95, 100, 85, 70, 60, 75, 90, 85, 60, 45, 30, 25, 35, 50, 65, 55, 40].map((height, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t transition-all ${
                  idx >= 4 && idx <= 14 ? 'bg-emerald-400' : 'bg-gray-200'
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={safeFilters.priceMin}
                onChange={handlePriceMinChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex-1 relative">
              <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={safeFilters.priceMax}
                onChange={handlePriceMaxChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Surface</p>
            <span className="text-sm font-bold text-emerald-600">
              {safeFilters.surfaceMin}m² - {safeFilters.surfaceMax}m²
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Maximize size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={safeFilters.surfaceMin}
                onChange={handleSurfaceMinChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex-1 relative">
              <Maximize size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={safeFilters.surfaceMax}
                onChange={handleSurfaceMaxChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['9m²', '20m²', '30m²', '50m²', '80m²+'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  const value = parseInt(size, 10);
                  if (Number.isNaN(value)) {
                    onChange({ ...safeFilters, surfaceMax: 80 });
                    return;
                  }
                  onChange({ ...safeFilters, surfaceMin: value });
                }}
                className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Disponibilité</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleAvailability('immediate')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl border ${
                safeFilters.availability.includes('immediate')
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Immédiate
            </button>
            <button
              type="button"
              onClick={() => toggleAvailability('1month')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl border ${
                safeFilters.availability.includes('1month')
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Dans 1 mois
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Équipements</p>
          <div className="grid grid-cols-2 gap-2">
            {equipements.map((eq) => (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggleEquipement(eq.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                  safeFilters.equipements.includes(eq.id)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <eq.icon size={16} />
                <span className="text-xs font-medium">{eq.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Localisation</p>
          <div className="space-y-2">
            {['Paris intra-muros', 'Petite Couronne', 'Grande Couronne'].map((loc) => (
              <label key={loc} className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => toggleLocation(loc)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    safeFilters.locations.includes(loc)
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  {safeFilters.locations.includes(loc) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-gray-600">{loc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



