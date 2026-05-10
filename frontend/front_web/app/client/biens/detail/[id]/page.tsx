// app/client/biens/detail/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProperty } from '@/services/propertiesService';
import { MapPin, Maximize, BedDouble, Euro, Calendar, Star, ArrowLeft, MessageCircle } from 'lucide-react';

export default function ClientBienDetailPage() {
  const params = useParams();
  const [rawBien, setRawBien] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const id = params?.id ? Number(params.id) : null;
    if (!id) {
      setLoading(false);
      return;
    }
    getProperty(id)
      .then((data) => {
        if (!mounted) return;
        setRawBien(data || null);
      })
      .catch(() => {
        if (!mounted) return;
        setRawBien(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [params?.id]);

  const mapProperty = (raw: any) => {
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
      distance: raw?.distance || '',
      rating: raw?.rating ?? 0,
      reviews: raw?.reviews ?? 0,
      description: raw?.description || '',
    };
  };

  const bien = rawBien ? mapProperty(rawBien) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bien non trouvé</h1>
          <p className="text-gray-500 mb-4">Le bien que vous recherchez n'existe pas.</p>
          <Link
            href="/client"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux biens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/client" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{bien.title}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} />
                {bien.address}
              </p>
            </div>
          </div>

          <Link
            href={`/client/messages?property=${bien.id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle size={16} />
            Discuter avec le propriétaire
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-96">
              <img
                src={bien.image}
                alt={bien.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-gray-800 text-xs font-bold">
                {bien.type}
              </div>
            </div>
            <div className="p-4 flex gap-3 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 flex-shrink-0">
                  <img
                    src={bien.image}
                    alt={`Vue ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-900">{bien.rating}</span>
              <span className="text-sm text-gray-500">({bien.reviews} avis)</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {bien.description || 'Bien confortable, proche des commodités et des transports.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-md font-bold text-gray-900 mb-4">Caractéristiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Maximize size={16} />
                  <span className="text-xs font-medium">Surface</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{bien.surface} m²</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <BedDouble size={16} />
                  <span className="text-xs font-medium">Pièces</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{bien.rooms}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-xs font-medium">Disponibilité</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{bien.available}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin size={16} />
                  <span className="text-xs font-medium">Distance</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{bien.distance}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Localisation</h2>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
              <div className="relative text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">{bien.address}</p>
                <button className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700">
                  Voir sur la carte →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Prix</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Loyer</span>
                <span className="text-lg font-bold text-gray-900">{bien.price} €</span>
              </div>
              {bien.charges && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Charges</span>
                  <span className="font-medium text-gray-900">{bien.charges} €</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-emerald-600">{bien.price + (bien.charges || 0)} €</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {bien.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Link
            href={`/client/messages?property=${bien.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle size={16} />
            Discuter avec le propriétaire
          </Link>
        </div>
      </div>
    </div>
  );
}
