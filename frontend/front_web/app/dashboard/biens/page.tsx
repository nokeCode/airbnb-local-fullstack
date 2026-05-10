'use client';

import { Header } from "@/components/dashboard/Header";
import {
  MapPin,
  Maximize,
  BedDouble,
  Euro,
  Users,
  Wrench,
  MoreHorizontal,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMyProperties } from '@/services/propertiesService';

type PropertyImage = { image?: string; url?: string; file?: string };

type Property = {
  id: number;
  title: string;
  address: string;
  price: string | number;
  status?: string;
  surface?: string | number;
  bedrooms?: number;
  images?: PropertyImage[];
};

export default function BiensPage() {
  const router = useRouter();
  const [vue, setVue] = useState<'grid' | 'liste'>('grid');
  const [filtreActif, setFiltreActif] = useState<'tous' | 'loué' | 'vacant' | 'travaux'>('tous');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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

  const toStatus = (s?: string) => (s || '').toLowerCase();
  const isAvailable = (s: string) => ['available', 'vacant', 'free', 'a louer', 'à louer'].some(v => s.includes(v));
  const isRented = (s: string) => ['occupied', 'rented', 'loué', 'loue'].some(v => s.includes(v));
  const isWork = (s: string) => ['work', 'travaux'].some(v => s.includes(v));

  const getStatutLabel = (s: string) => {
    if (isRented(s)) return 'Loué';
    if (isAvailable(s)) return 'À louer';
    if (isWork(s)) return 'En travaux';
    return '—';
  };

  const getStatutColor = (s: string) => {
    if (isRented(s)) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (isAvailable(s)) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (isWork(s)) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700';
  };

  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  const filtered = useMemo(() => {
    // Filtre local sur le statut.
    return properties.filter((p) => {
      const s = toStatus(p.status);
      if (filtreActif === 'loué') return isRented(s);
      if (filtreActif === 'vacant') return isAvailable(s);
      if (filtreActif === 'travaux') return isWork(s);
      return true;
    });
  }, [properties, filtreActif]);

  const counts = useMemo(() => {
    // Compteurs affichés dans les filtres.
    const all = properties.length;
    const rented = properties.filter(p => isRented(toStatus(p.status))).length;
    const vacant = properties.filter(p => isAvailable(toStatus(p.status))).length;
    const work = properties.filter(p => isWork(toStatus(p.status))).length;
    return { all, rented, vacant, work };
  }, [properties]);

  const getImage = (p: Property) => {
    // Choix d'une image fiable (API ou fallback local).
    const img = p.images && p.images.length > 0 ? (p.images[0].image || p.images[0].url || p.images[0].file) : null;
    return img || '/maison1.jpg';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Mes biens"
        subtitle="Gestion de votre patrimoine immobilier"
        actionLabel="Ajouter un bien"
        actionHref="/dashboard/biens/ajouter"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filtres et contrôles */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { label: 'Tous', count: counts.all, value: 'tous' },
              { label: 'Loués', count: counts.rented, value: 'loué' },
              { label: 'Vacants', count: counts.vacant, value: 'vacant' },
              { label: 'Travaux', count: counts.work, value: 'travaux' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltreActif(f.value as typeof filtreActif)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filtreActif === f.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Filter size={16} />
              Filtres avancés
            </button>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setVue('grid')}
                className={`p-2 rounded-lg transition-all ${vue === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setVue('liste')}
                className={`p-2 rounded-lg transition-all ${vue === 'liste' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Grille de biens */}
        <div className={vue === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {loading && (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))
          )}

          {!loading && filtered.map((bien) => {
            const status = toStatus(bien.status);
            const price = typeof bien.price === 'string' ? parseFloat(bien.price) : bien.price;
            return (
              <div
                key={bien.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/dashboard/biens/detail/${bien.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/dashboard/biens/detail/${bien.id}`);
                  }
                }}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group ${
                  vue === 'liste' ? 'flex' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${vue === 'liste' ? 'w-48 h-full' : 'h-48'}`}>
                  <img
                    src={getImage(bien)}
                    alt={bien.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border ${getStatutColor(status)}`}>
                    {getStatutLabel(status)}
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{bien.title}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreHorizontal size={18} className="text-gray-400" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin size={14} />
                    {bien.address}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <Maximize size={14} />
                      {bien.surface ? `${bien.surface}m²` : '—'}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <BedDouble size={14} />
                      {bien.bedrooms ? `${bien.bedrooms} p` : '—'}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <Euro size={14} />
                      {Number.isFinite(price) ? formatFCFA(price) : '—'}
                    </span>
                  </div>

                  {isRented(status) ? (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Locataire</p>
                            <p className="text-xs text-gray-500">Bail en cours</p>
                          </div>
                        </div>
                        <Link href={`/dashboard/biens/detail/${bien.id}`} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                          Voir fiche →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-gray-100 pt-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Publier annonce
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                      >
                        <Wrench size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
