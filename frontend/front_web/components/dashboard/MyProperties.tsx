'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, MapPin, Maximize2, BedDouble, Bath, MoreHorizontal, Plus } from 'lucide-react';
import { getMyProperties } from '@/services/propertiesService';

type PropertyImage = { image?: string; url?: string; file?: string };

type Property = {
  id: number;
  title: string;
  address: string;
  price: string | number;
  contract_type?: string;
  status?: string;
  surface?: string | number;
  bedrooms?: number;
  bathrooms?: number;
  category_name?: string;
  images?: PropertyImage[];
};

export function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'rented' | 'available' | 'work'>('all');

  useEffect(() => {
    // Chargement des biens du propriétaire connecté.
    let mounted = true;
    getMyProperties()
      .then((data) => {
        if (mounted) setProperties(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setProperties([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toStatus = (status?: string) => (status || '').toLowerCase();
  const isAvailable = (s: string) => ['available', 'vacant', 'free', 'a louer', 'à louer'].some(v => s.includes(v));
  const isRented = (s: string) => ['occupied', 'rented', 'loué', 'loue'].some(v => s.includes(v));
  const isWork = (s: string) => ['work', 'travaux'].some(v => s.includes(v));

  const counts = useMemo(() => {
    const all = properties.length;
    const rented = properties.filter(p => isRented(toStatus(p.status))).length;
    const available = properties.filter(p => isAvailable(toStatus(p.status))).length;
    const work = properties.filter(p => isWork(toStatus(p.status))).length;
    return { all, rented, available, work };
  }, [properties]);

  const filtered = useMemo(() => {
    // Filtre local sur le statut pour l'affichage.
    if (activeFilter === 'rented') return properties.filter(p => isRented(toStatus(p.status)));
    if (activeFilter === 'available') return properties.filter(p => isAvailable(toStatus(p.status)));
    if (activeFilter === 'work') return properties.filter(p => isWork(toStatus(p.status)));
    return properties;
  }, [properties, activeFilter]);

  const getImage = (p: Property) => {
    // Choix d'une image fiable (API ou fallback local).
    const img = p.images && p.images.length > 0 ? (p.images[0].image || p.images[0].url || p.images[0].file) : null;
    return img || '/maison1.jpg';
  };

  const getStatusLabel = (s: string) => {
    if (isRented(s)) return 'Loué';
    if (isAvailable(s)) return 'À louer';
    if (isWork(s)) return 'Travaux';
    return s || '—';
  };

  const getStatusColor = (s: string) => {
    if (isRented(s)) return 'bg-emerald-500';
    if (isAvailable(s)) return 'bg-amber-500';
    if (isWork(s)) return 'bg-red-500';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Mes biens</h3>
          <p className="text-sm text-gray-500">Gérez vos propriétés et locataires</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="text-gray-400" size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Tous', count: counts.all },
          { id: 'rented', label: 'Loués', count: counts.rented },
          { id: 'available', label: 'Vacants', count: counts.available },
          { id: 'work', label: 'En travaux', count: counts.work },
        ].map((filtre) => (
          <button
            key={filtre.id}
            onClick={() => setActiveFilter(filtre.id as typeof activeFilter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filtre.id
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filtre.label} ({filtre.count})
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Chargement des biens...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-sm text-gray-500">Aucun bien trouvé.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((bien) => {
          const status = toStatus(bien.status);
          const price = typeof bien.price === 'string' ? parseFloat(bien.price) : bien.price;
          const priceText = Number.isFinite(price) ? `${Math.round(price).toLocaleString('fr-FR')} FCFA${bien.contract_type === 'rent' ? '/mois' : ''}` : '—';

          return (
            <div key={bien.id} className="group cursor-pointer border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImage(bien)}
                  alt={bien.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 ${getStatusColor(status)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                  {getStatusLabel(status)}
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 line-clamp-1">{bien.title}</h4>
                  <span className="font-bold text-emerald-600 text-sm">{priceText}</span>
                </div>

                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="truncate">{bien.address}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Maximize2 size={14} />
                    {bien.surface ? `${bien.surface} m²` : '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble size={14} />
                    {bien.bedrooms ? `${bien.bedrooms} ch.` : '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={14} />
                    {bien.category_name || '—'}
                  </span>
                </div>

                {!isAvailable(status) ? (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 text-xs font-bold">L</span>
                    </div>
                    <span className="text-sm text-gray-600">Locataire: <span className="font-medium text-gray-900">—</span></span>
                  </div>
                ) : (
                  <button className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Publier une annonce
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
