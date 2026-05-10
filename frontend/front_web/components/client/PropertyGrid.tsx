'use client';

const normalize = (str: any): string => {
  if (typeof str !== 'string') return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

import { PropertyCard } from './PropertyCard';
import { Sparkles, X, Send } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientFilters } from './filters';
import { getAllProperties } from '@/services/propertiesService';
import { API_BASE } from '@/services/http';

type PropertyGridProps = {
  filters: ClientFilters;
};

const initialMessages = [
  {
    type: 'ai',
    content: 'Bonjour ! Je suis votre assistant immobilier IA. Je peux vous aider à trouver le bien idéal. Que recherchez-vous ?',
  },
];

export function PropertyGrid({ filters }: PropertyGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedParam = searchParams.get('property');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('selectedPropertyId') : null;
    setSelectedPropertyId(selectedParam || saved);
  }, [selectedParam]);

  useEffect(() => {
    let mounted = true;
    if (process.env.NODE_ENV !== 'production') {
      console.log('PropertyGrid API_BASE:', API_BASE);
    }
    getAllProperties()
      .then((data) => {
        if (!mounted) return;
        console.log('Properties API response:', data, 'count:', Array.isArray(data) ? data.length : 'n/a');
        setProperties(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error('Error fetching properties:', error.message);
        setProperties([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, { type: 'user', content: inputMessage }]);

    setTimeout(() => {
      const responses = [
        "J'ai trouvé 3 biens qui correspondent à vos critères ! Voulez-vous que je vous montre ceux avec balcon ?",
        "D'après votre budget, je vous recommande de regarder dans le 11e ou le 20e arrondissement. Souhaitez-vous affiner la recherche ?",
        "Ce quartier est très demandé. Je peux vous créer une alerte pour être notifié dès qu'un nouveau bien sort ?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'ai', content: randomResponse }]);
    }, 1000);

    setInputMessage('');
  };



  const typeToId = (value: string) => {
    const v = normalize(value);
    if (v.includes('studio')) return 'studio';
    if (v.includes('t1')) return 't1';
    if (v.includes('t2')) return 't2';
    if (v.includes('t3')) return 't3';
    if (v.includes('maison')) return 'maison';
    if (v.includes('loft')) return 'loft';
    return value;
  };

  const matchesEquipements = (tags: string[]) => {
    if (filters.equipements.length === 0) return true;
    const tagText = normalize(tags.join(' '));
    return filters.equipements.every((eq) => {
      if (eq === 'meuble') return tagText.includes('meubl');
      if (eq === 'parking') return tagText.includes('parking');
      if (eq === 'animaux') return tagText.includes('animaux');
      if (eq === 'internet') return tagText.includes('internet');
      return true;
    });
  };

  const matchesAvailability = (available: string) => {
    if (filters.availability.length === 0) return true;
    const value = normalize(available);
    return filters.availability.some((a) => {
      if (a === 'immediate') return value.includes('imm');
      if (a === '1month') return value.includes('1er') || value.includes('mois');
      return false;
    });
  };

  const matchesLocation = (address: string) => {
    if (filters.locations.length === 0) return true;
    const value = normalize(address);
    return filters.locations.some((loc) => {
      if (loc === 'Paris intra-muros') return value.includes('paris');
      if (loc === 'Petite Couronne') return value.includes('couronne');
      if (loc === 'Grande Couronne') return value.includes('couronne');
      return false;
    });
  };

  const mapProperty = (raw: any) => {
    const images = Array.isArray(raw?.images) ? raw.images : [];
    const firstImage = raw?.image || raw?.thumbnail || raw?.main_image || images[0]?.image || images[0]?.url || images[0]?.file;
    const equipements = Array.isArray(raw?.equipements)
      ? raw.equipements
      : Array.isArray(raw?.equipments)
        ? raw.equipments
        : Array.isArray(raw?.equipment)
          ? raw.equipment
          : [];
    const categoryValue =
      raw?.category_data?.name ?? raw?.category_name ?? raw?.category?.name ?? raw?.type ?? null;
    const categoryName = typeof categoryValue === 'string' && categoryValue.trim() ? categoryValue : 'appartement';
    const statusRaw = normalize(String(raw?.status ?? ''));
    const isAvailable =
      statusRaw.includes('avail') || statusRaw.includes('vac') || statusRaw.includes('dispo') || statusRaw.includes('libre');
    return {
      id: raw?.id ?? raw?.property_id ?? raw?.propertyId ?? raw?.pk ?? raw?.uuid,
      title: raw?.title || raw?.name || 'Bien',
      address: `${raw?.address || ''}, ${raw?.city || ''}`.trim(),
      city: raw?.city || '',
      price: Number(raw?.price ?? raw?.rent ?? raw?.monthly_rent ?? 0),
      image: firstImage || '/maison1.jpg',
      surface: Number(raw?.surface ?? raw?.area ?? 0),
      bedrooms: raw?.bedrooms ?? raw?.rooms ?? 0,
      bathrooms: raw?.bathrooms ?? 0,
      type: categoryName,
      equipements,
      ownerName: raw?.owner?.name || '',
      ownerAvatar: raw?.owner?.avatar || null,
      contract_type: raw?.contract_type || 'rent',
      status: raw?.status || 'vacant',
      favorite: false,
      // Additional fields for PropertyCard
      charges: raw?.monthly_charges !== undefined && raw?.monthly_charges !== null ? Number(raw.monthly_charges) : undefined,
      isAvailable,
      available: isAvailable ? 'Disponible' : 'Occupé',
      distance: '',
      rating: 4.5, // Default rating
      reviews: 12, // Default reviews
      tags: equipements,
      isNew: raw?.created_at ? new Date(raw.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false,
      description: raw?.description || '',
    };
  };

  const mappedProperties = useMemo(() => properties.map(mapProperty), [properties]);

  const selectedProperty = selectedPropertyId
    ? mappedProperties.find(p => String(p.id) === String(selectedPropertyId))
    : null;

  const clearSelection = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedPropertyId');
    }
    router.push('/client');
  };

  const filtered = mappedProperties.filter((property) => {
    const search = normalize(filters.searchQuery || '');
    const searchOk = !search
      || normalize(property.title).includes(search)
      || normalize(property.address).includes(search)
      || normalize(property.tags.join(' ')).includes(search);
    const priceOk = property.price >= filters.priceMin && property.price <= (filters.price_max || 999999);
    const surfaceOk = property.surface >= filters.surfaceMin && property.surface <= (filters.surface_max || 999);
    const typeId = typeToId(property.type);
    const typeOk = filters.types.length === 0 || filters.types.includes(typeId);
    const equipOk = matchesEquipements(property.tags);
    const availOk = matchesAvailability(property.available);
    const locationOk = matchesLocation(property.address);
    return searchOk && priceOk && surfaceOk && typeOk && equipOk && availOk && locationOk;
  });

  const visibleProperties = useMemo(() => {
    if (!selectedProperty) return filtered;
    const selectedId = String(selectedProperty.id);
    const rest = filtered.filter((p) => String(p.id) !== selectedId);
    return [selectedProperty, ...rest];
  }, [filtered, selectedProperty]);

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Chargement des biens...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Sparkles size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Aucun bien trouvé</h3>
          <p className="text-gray-500 max-w-md">
            Aucun bien n'a été trouvé. Les biens publiés par les propriétaires apparaîtront ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        {selectedProperty && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-sm">
            Bien s?lectionn?
            <button
              onClick={clearSelection}
              className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Voir tous les biens
            </button>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {visibleProperties.length} bien{visibleProperties.length > 1 ? 's' : ''}
          </h1>
          <p className="text-gray-500">Dans votre zone de recherche • Mise à jour il y a 5 min</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Trier par :</span>
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
            <option>Pertinence</option>
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
            <option>Surface</option>
            <option>Date de disponibilité</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
        {visibleProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {!showAI && (
        <button
          onClick={() => setShowAI(true)}
          className="fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105 z-50"
        >
          <div className="relative">
            <Sparkles size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Assistant IA</p>
            <p className="text-xs text-indigo-200">Besoin d'aide ?</p>
          </div>
        </button>
      )}

      {showAI && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col max-h-[500px]">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <p className="font-bold text-white">Assistant Immo IA</p>
                <p className="text-xs text-indigo-200">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setShowAI(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.type === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {['?? Avec balcon', '?? < 800€', '?? Métro proche'].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 text-xs rounded-full whitespace-nowrap transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Décrivez votre recherche..."
                className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

