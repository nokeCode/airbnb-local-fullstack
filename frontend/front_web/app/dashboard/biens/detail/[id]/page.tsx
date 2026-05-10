'use client';

import { Header } from "@/components/dashboard/Header";
import { 
  MapPin, 
  Maximize, 
  BedDouble, 
  Euro, 
  Users, 
  Wrench,
  ArrowLeft,
  Edit3,
  Trash2,
  MoreVertical,
  Calendar,
  FileText,
  TrendingUp,
  Home,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  LocateFixed,
  Route
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getProperty } from '@/services/propertiesService';
import type { Property as ApiProperty } from '@/app/types/Property';

// Import dynamique de Leaflet (côté client uniquement)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const useMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMap),
  { ssr: false }
);

// Types
interface Bien {
  id: number;
  titre: string;
  adresse: string;
  type: string;
  surface: number;
  pieces: number;
  loyer: number;
  valeur: number;
  statut: string;
  locataire: string | null;
  debutBail: string | null;
  finBail: string | null;
  image: string;
  description?: string;
  etage?: number;
  totalEtages?: number;
  anneeConstruction?: number;
  charges?: number;
  lat?: number;
  lng?: number;
}

const mapApiPropertyToBien = (p: ApiProperty): Bien => {
  const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.image : null;
  return {
    id: p.id,
    titre: p.title,
    adresse: `${p.address || ''}${p.city ? `, ${p.city}` : ''}`.trim(),
    type: p.category_name || 'Bien',
    surface: Number(p.surface || 0),
    pieces: Number(p.bedrooms || 0),
    loyer: Number((p as any).monthly_rent ?? p.price ?? 0),
    valeur: Number(p.price ?? 0),
    statut: p.status || '',
    locataire: null,
    debutBail: null,
    finBail: null,
    image: firstImage || '/maison1.jpg',
    description: p.description || '',
    charges: Number((p as any).monthly_charges ?? 0) || undefined,
    lat: Number(p.latitude || 0) || undefined,
    lng: Number(p.longitude || 0) || undefined,
  };
};

const statuts = [
  { value: 'loué', label: 'Loué', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  { value: 'vacant', label: 'À louer', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  { value: 'travaux', label: 'En travaux', color: 'bg-red-100 text-red-700 border-red-200', icon: Wrench },
] as const;

// Composant pour la carte et l'itinéraire
function PropertyMap({ 
  propertyLat, 
  propertyLng, 
  propertyAddress 
}: { 
  propertyLat: number; 
  propertyLng: number; 
  propertyAddress: string;
}) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  // Charger Leaflet dynamiquement
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Géocodage inverse pour obtenir l'adresse formatée
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        const houseNumber = address.house_number || '';
        const road = address.road || address.pedestrian || address.street || address.highway || '';
        const city = address.city || address.town || address.village || 
                    address.municipality || address.county || address.state || '';
        const postalCode = address.postcode || '';
        
        return {
          adresse: `${houseNumber} ${road}`.trim() || data.display_name.split(',')[0],
          ville: city,
          codePostal: postalCode,
          pays: address.country || '',
          displayName: data.display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur géocodage:', error);
      return null;
    }
  };

  // Calculer l'itinéraire via OSRM
  const calculateRoute = useCallback(async (from: [number, number], to: [number, number]) => {
    setIsLoadingRoute(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const routeData = data.routes[0];
        const coordinates = routeData.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
        setRoute(coordinates);
        setDistance((routeData.distance / 1000).toFixed(1) + ' km');
        setDuration(Math.round(routeData.duration / 60) + ' min');
      }
    } catch (error) {
      console.error('Erreur calcul itinéraire:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  }, []);

  // Obtenir la position actuelle
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          calculateRoute(location, [propertyLat, propertyLng]);
          
          // Centrer la carte sur la route
          if (map && L) {
            const bounds = L.latLngBounds([location, [propertyLat, propertyLng]]);
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          alert('Impossible d\'obtenir votre position. Vérifiez les permissions de géolocalisation.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  // Icône personnalisée pour le bien
  const getPropertyIcon = () => {
    if (!L) return null;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #059669; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
             </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  };

  // Icône pour la position utilisateur
  const getUserIcon = () => {
    if (!L) return null;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #3B82F6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3" fill="white"></circle>
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  if (!L) return <div className="h-full bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[propertyLat, propertyLng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marqueur du bien */}
        <Marker 
          position={[propertyLat, propertyLng]} 
          icon={getPropertyIcon()}
        >
          <Popup>
            <div className="text-sm font-medium">{propertyAddress}</div>
          </Popup>
        </Marker>

        {/* Marqueur de l'utilisateur */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={getUserIcon()}
          >
            <Popup>
              <div className="text-sm font-medium">Votre position</div>
            </Popup>
          </Marker>
        )}

        {/* Ligne de l'itinéraire */}
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#3B82F6" 
            weight={4} 
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      {/* Bouton d'itinéraire */}
      <button
        onClick={getCurrentLocation}
        disabled={isLoadingRoute}
        className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
      >
        <Navigation size={16} className={isLoadingRoute ? 'animate-spin' : ''} />
        {isLoadingRoute ? 'Calcul...' : 'Itinéraire depuis ma position'}
      </button>

      {/* Informations de route */}
      {(distance || duration) && (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Route size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{distance}</p>
              <p className="text-xs text-gray-500">{duration} de trajet</p>
            </div>
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <span className="text-gray-600">Bien immobilier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">Votre position</span>
        </div>
        {route.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-500 border-t-2 border-dashed" />
            <span className="text-gray-600">Itinéraire</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BienDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = params.id as string | undefined;
    if (!id) return;

    let active = true;
    setLoading(true);
    setLoadError(null);
    getProperty(id)
      .then((p) => {
        if (!active) return;
        setBien(mapApiPropertyToBien(p));
      })
      .catch((e) => {
        if (!active) return;
        setBien(null);
        setLoadError(e instanceof Error ? e.message : 'Erreur lors du chargement du bien');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mounted, params.id]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#F8F9FA]" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du bien...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Impossible de charger le bien</h1>
          <p className="text-gray-500 mb-4">{loadError}</p>
          <Link
            href="/dashboard/biens"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux biens
          </Link>
        </div>
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
            href="/dashboard/biens" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux biens
          </Link>
        </div>
      </div>
    );
  }

  const getStatutColor = (statut: string) => {
    const s = (statut || '').toLowerCase();
    const isRented = ['occupied', 'rented', 'loué', 'loue'].some((v) => s.includes(v));
    const isAvailable = ['available', 'vacant', 'free', 'à louer', 'a louer', 'dispo', 'libre'].some((v) => s.includes(v));
    const isWork = ['work', 'travaux'].some((v) => s.includes(v));
    if (isRented) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (isAvailable) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (isWork) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatutLabel = (statut: string) => {
    const s = (statut || '').toLowerCase();
    const isRented = ['occupied', 'rented', 'loué', 'loue'].some((v) => s.includes(v));
    const isAvailable = ['available', 'vacant', 'free', 'à louer', 'a louer', 'dispo', 'libre'].some((v) => s.includes(v));
    const isWork = ['work', 'travaux'].some((v) => s.includes(v));
    if (isRented) return 'Loué';
    if (isAvailable) return 'À louer';
    if (isWork) return 'En travaux';
    return statut || '—';
  };

  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  const handleDelete = () => {
    console.log('Suppression du bien:', bien.id);
    setShowDeleteModal(false);
    router.push('/dashboard/biens');
  };

  const handleStatusChange = (newStatus: typeof bien.statut) => {
    console.log('Changement de statut:', bien.id, '->', newStatus);
    setShowStatusModal(false);
  };

  const currentStatut = statuts.find(s => s.value === bien.statut);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header personnalisé avec actions */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/biens"
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{bien.titre}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} />
                  {bien.adresse}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Bouton Changement de statut */}
              <button
                onClick={() => setShowStatusModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${getStatutColor(bien.statut)}`}
              >
                {currentStatut && <currentStatut.icon size={16} />}
                {getStatutLabel(bien.statut)}
              </button>

              {/* Menu d'actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/biens/modifier/${bien.id}`}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <Edit3 size={16} />
                  Modifier
                </Link>
                
                <Link 
                  href={`/dashboard/biens/supprimer/${bien.id}`}
                  
                  className="p-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Supprimer le bien"
                >
                  <Trash2 size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Section principale: Image + Carte côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Image du bien */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[500px]">
            <div className="relative h-full">
              <img
                src={bien.image}
                alt={bien.titre}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold border ${getStatutColor(bien.statut)}`}>
                {getStatutLabel(bien.statut)}
              </div>
              
              {/* Miniatures en overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/80 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                    <img
                      src={bien.image}
                      alt={`Vue ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-16 h-16 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium flex-shrink-0 cursor-pointer hover:bg-black/60 transition-colors">
                  +23
                </div>
              </div>
            </div>
          </div>

          {/* Carte de localisation */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[500px]">
            {bien.lat && bien.lng ? (
              <PropertyMap 
                propertyLat={bien.lat} 
                propertyLng={bien.lng}
                propertyAddress={bien.adresse}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Coordonnées non disponibles</p>
                  <button className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    Ajouter la localisation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description et détails */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {bien.description || `Beau ${bien.type.toLowerCase()} situé dans un quartier recherché. 
                Proche des commodités et des transports en commun. Idéal pour investissement locatif 
                ou résidence principale.`}
              </p>

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
                  <p className="text-lg font-bold text-gray-900">{bien.pieces}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Home size={16} />
                    <span className="text-xs font-medium">Étage</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{bien.etage || 1}/{bien.totalEtages || 1}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar size={16} />
                    <span className="text-xs font-medium">Année</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{bien.anneeConstruction || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Documents et historique */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                {['Bail actuel', 'Quittances', 'Assurance', 'DPE'].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <FileText size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc}</p>
                        <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                      Télécharger
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Résumé financier */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé financier</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Valeur du bien</span>
                  <span className="text-lg font-bold text-gray-900">{formatFCFA(bien.valeur)}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Loyer mensuel</span>
                  <span className="text-lg font-bold text-emerald-600">{formatFCFA(bien.loyer)}</span>
                </div>

                {bien.charges && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Charges mensuelles</span>
                    <span className="font-medium text-gray-900">{formatFCFA(bien.charges)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Rendement brut</span>
                  <span className="font-bold text-emerald-600">
                    {((bien.loyer * 12) / bien.valeur * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Informations locataire */}
            {bien.locataire ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Locataire actuel</h2>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Actif
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{bien.locataire}</p>
                    <p className="text-sm text-gray-500">Depuis le {bien.debutBail}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Début du bail</span>
                    <span className="font-medium">{bien.debutBail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Fin du bail</span>
                    <span className="font-medium text-amber-600">{bien.finBail}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Voir la fiche locataire
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Bien vacant</h3>
                  <p className="text-sm text-gray-500 mb-4">Aucun locataire actuellement</p>
                  <button className="w-full py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Publier une annonce
                  </button>
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <FileText size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Générer un bail</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <TrendingUp size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Voir les statistiques</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <Wrench size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Signaler des travaux</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{bien.titre}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal changement de statut */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Modifier le statut</h3>
            <div className="space-y-2 mb-6">
              {statuts.map((statut) => (
                <button
                  key={statut.value}
                  onClick={() => handleStatusChange(statut.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    bien.statut === statut.value 
                      ? 'border-gray-900 bg-gray-50' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <statut.icon size={20} className={statut.color.split(' ')[1]} />
                  <span className="font-medium text-gray-900">{statut.label}</span>
                  {bien.statut === statut.value && (
                    <CheckCircle2 size={18} className="ml-auto text-gray-900" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
