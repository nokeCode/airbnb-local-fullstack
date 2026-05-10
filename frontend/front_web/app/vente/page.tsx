'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import { PropertyCard } from '@/components/client/PropertyCard';
import { FilterPanel } from '@/components/client/FilterPanel';
import { SearchHeader } from '@/components/client/SearchHeader';
import { ClientFilters, defaultSaleFilters } from '@/components/client/filters';
import { getPropertiesByType } from '@/services/propertiesService';
import type { Property, DisplayProperty } from '@/app/types/Property';
import { MapPin, Home, Euro, Maximize } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = '/maison1.jpg';

function mapPropertyToDisplay(prop: Property): DisplayProperty {
  const firstImage = prop.images[0]?.image || DEFAULT_FALLBACK_IMAGE;
  
  return {
    id: prop.id,
    title: prop.title,
    address: `${prop.address}, ${prop.city}`,
    city: prop.city,
    price: prop.price,
    image: firstImage,
    surface: prop.surface,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    type: prop.category_name,
    equipements: prop.equipements.slice(0, 4),
    ownerName: prop.owner.name,
    ownerAvatar: prop.owner.avatar || undefined,
    contract_type: prop.contract_type,
    status: prop.status,
  };
}


export default function VentePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFilters>(defaultSaleFilters);
  const [displayProperties, setDisplayProperties] = useState<DisplayProperty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiFilters = mapToApiFilters(filters);
      const data = await getPropertiesByType('sale', apiFilters);
      const mapped = data.map(mapPropertyToDisplay);
      setDisplayProperties(mapped);
    } catch (err) {
      console.error('Erreur fetch properties:', err);
      setError('Erreur lors du chargement des propriétés. Vérifiez votre connexion.');
      setDisplayProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Plus de client-side filtering - server fait le job
  const filteredProperties = displayProperties;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/bg_landscape.png')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Propriétés à Vendre</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Découvrez notre sélection de biens immobiliers à vendre. 
            Des appartements aux villas, trouvez votre futur chez-vous.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400">{displayProperties.length}</div>
              <div className="text-sm text-gray-300">Biens disponibles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400">250+</div>
              <div className="text-sm text-gray-300">Ventes réalisées</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400">98%</div>
              <div className="text-sm text-gray-300">Clients satisfaits</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400">15j</div>
              <div className="text-sm text-gray-300">Délai moyen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchHeader filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultSaleFilters)}
            />
          </aside>

          {/* Properties Grid */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {loading ? 'Chargement...' : `${filteredProperties.length} résultat(s)`}
              </h2>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Surface croissante</option>
                <option>Nouveautés</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} type="sale" />
                ))}
              </div>
            )}

            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun bien trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous souhaitez vendre votre bien ?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Confiez-nous votre propriété et bénéficiez de notre expertise pour une vente rapide au meilleur prix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Estimer mon bien
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
