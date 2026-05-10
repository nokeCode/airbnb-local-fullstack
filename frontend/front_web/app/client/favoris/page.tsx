'use client';

import { Heart, Trash2, Bell, MapPin, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFavoriteEntries, removeFavorite } from '@/lib/favorites';
import { getProperty } from '@/services/propertiesService';

export default function FavorisPage() {
  const [entries, setEntries] = useState(getFavoriteEntries());
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEntries(getFavoriteEntries());
  }, []);

  useEffect(() => {
    let mounted = true;

    const mapProperty = (raw: any, addedAt: string) => {
      const images = Array.isArray(raw?.images) ? raw.images : [];
      const firstImage = raw?.image || raw?.thumbnail || raw?.main_image || images[0]?.image || images[0]?.url || images[0]?.file;
      return {
        id: raw?.id,
        title: raw?.title || raw?.name || 'Bien',
        address: raw?.address || raw?.location || raw?.city || '',
        price: Number(raw?.price ?? raw?.rent ?? raw?.monthly_rent ?? 0),
        charges: raw?.charges ?? raw?.service_charges ?? undefined,
        image: firstImage || '/maison1.jpg',
        surface: Number(raw?.surface ?? raw?.area ?? 0),
        rooms: Number(raw?.rooms ?? raw?.bedrooms ?? 0),
        type: raw?.type || raw?.category || 'appartement',
        available: raw?.availability || raw?.available || raw?.status || 'Disponible',
        addedAt,
      };
    };

    if (!entries.length) {
      setFavorites([]);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    Promise.all(
      entries.map((entry) =>
        getProperty(entry.id)
          .then((raw) => (raw ? mapProperty(raw, entry.addedAt) : null))
          .catch(() => null)
      )
    )
      .then((list) => {
        if (!mounted) return;
        setFavorites(list.filter(Boolean) as any[]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [entries]);

  const handleRemove = (id: number) => {
    const next = removeFavorite(id);
    setEntries(next);
  };

  const formatAddedAt = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes favoris</h1>
          <p className="text-gray-500">{favorites.length} biens sauvegardes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            <Bell size={18} />
            <span>Creer une alerte</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6">
        {loading && favorites.length === 0 && (
          <div className="text-center text-gray-500">Chargement...</div>
        )}
        {favorites.map((property: any) => (
          <div key={property.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-6">
              {/* Image */}
              <div className="w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
                      {property.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={16} />
                      {property.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(property.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="font-medium">{property.surface}m2</span>
                  <span>•</span>
                  <span>{property.rooms} piece{property.rooms > 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Dispo {String(property.available).toLowerCase()}
                  </span>
                  <span>•</span>
                  <span>Ajoute {formatAddedAt(property.addedAt)}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{property.price}€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={`/client/messages?property=${property.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <MessageSquare size={18} />
                      Contacter
                    </a>
                    <a
                      href={`/client/biens/detail/${property.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      <ExternalLink size={18} />
                      Voir le bien
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && favorites.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun favori</h3>
          <p className="text-gray-500">Commencez a sauvegarder des biens pour les retrouver ici</p>
        </div>
      )}
    </div>
  );
}
