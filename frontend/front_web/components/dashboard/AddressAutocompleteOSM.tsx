'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Loader2, Navigation, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icône personnalisée pour le marqueur déplaçable
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Icône pour la position actuelle
const currentLocationIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    lat: number;
    lng: number;
  }) => void;
  defaultAddress?: string;
  defaultPosition?: { lat: number; lng: number };
}

// Composant pour centrer la carte sur la position
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
}

// Composant pour gérer le clic sur la carte et le déplacement du marqueur
function LocationMarker({ 
  position, 
  onPositionChange 
}: { 
  position: [number, number] | null; 
  onPositionChange: (pos: [number, number], address: any) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      onPositionChange(newPos, null);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={icon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          onPositionChange([newPos.lat, newPos.lng], null);
        },
      }}
    />
  );
}

export default function AddressAutocompleteOSM({ 
  onAddressSelect, 
  defaultAddress = '',
  defaultPosition 
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultAddress);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(
    defaultPosition ? [defaultPosition.lat, defaultPosition.lng] : null
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Géocodage inverse (coordonnées → adresse)
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
        const adresse = `${houseNumber} ${road}`.trim() || data.display_name.split(',')[0];
        
        const city = address.city || address.town || address.village || 
                    address.municipality || address.county || address.state || '';
        const postalCode = address.postcode || '';
        const country = address.country || '';

        setQuery(data.display_name);
        
        const addressData = {
          adresse,
          ville: city,
          codePostal: postalCode,
          pays: country,
          lat,
          lng,
        };

        setSelectedAddress(addressData);
        onAddressSelect(addressData);
      }
    } catch (error) {
      console.error('Erreur de géocodage inverse:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  const fetchSuggestions = async (input: string) => {
    setLoading(true);
    try {
      // Recherche mondiale sans restriction de pays pour inclure l'Afrique
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&addressdetails=1&accept-language=fr`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (place: any) => {
    const address = place.address;
    
    const houseNumber = address.house_number || '';
    const road = address.road || address.pedestrian || address.street || address.highway || '';
    const adresse = `${houseNumber} ${road}`.trim() || place.display_name.split(',')[0];
    
    const city = address.city || address.town || address.village || 
                address.municipality || address.county || address.state || '';
    const postalCode = address.postcode || '';
    const country = address.country || '';

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    setQuery(place.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedLocation([lat, lon]);

    const addressData = {
      adresse,
      ville: city,
      codePostal: postalCode,
      pays: country,
      lat,
      lng: lon,
    };

    setSelectedAddress(addressData);
    onAddressSelect(addressData);
  };

  // Gestion du déplacement du marqueur ou du clic sur la carte
  const handlePositionChange = useCallback((newPos: [number, number], address: any) => {
    setSelectedLocation(newPos);
    
    if (address) {
      // Si une adresse est fournie (sélection depuis la liste)
      setSelectedAddress(address);
      onAddressSelect(address);
    } else {
      // Si juste une position (clic sur carte ou drag), faire un géocodage inverse
      reverseGeocode(newPos[0], newPos[1]);
    }
  }, [onAddressSelect]);

  // Géolocalisation de l'utilisateur
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation([latitude, longitude]);
        reverseGeocode(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        alert("Impossible d'obtenir votre position");
        setIsLocating(false);
      }
    );
  };

  const clearAddress = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedLocation(null);
    setSelectedAddress(null);
    onAddressSelect({
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      lat: 0,
      lng: 0,
    });
  };

  return (
    <div className="space-y-4">
      {/* Champ d'adresse avec autocomplétion */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse complète <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 3 && setShowSuggestions(true)}
            placeholder="Ex: Rue des Palmiers, Lomé, Togo..."
            className="w-full pl-10 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleGeolocation}
              disabled={isLocating}
              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Utiliser ma position actuelle"
            >
              <Navigation size={16} className={isLocating ? 'animate-spin' : ''} />
            </button>
            {query && (
              <button
                type="button"
                onClick={clearAddress}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Liste des suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors flex items-start gap-3"
              >
                <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.display_name.split(',').slice(1, 3).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {suggestion.type === 'house' ? '🏠 Adresse' : 
                     suggestion.type === 'city' ? '🏙️ Ville' : 
                     suggestion.type === 'administrative' ? '📍 Région' : '📍 Lieu'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2">
            <Loader2 size={18} className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Instructions pour la carte */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <Crosshair size={16} className="text-blue-500" />
        <span>
          {selectedLocation 
            ? "🖱️ Déplacez le marqueur rouge pour affiner la position exacte, ou cliquez ailleurs sur la carte"
            : "🔍 Recherchez une adresse ou cliquez sur la carte pour positionner le bien"}
        </span>
      </div>

      {/* Carte OpenStreetMap interactive */}
      <div className="relative h-80 w-full rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 z-0">
        <MapContainer
          center={selectedLocation || [6.1319, 1.2228]} // Lomé, Togo par défaut si rien n'est sélectionné
          zoom={selectedLocation ? 16 : 6}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {selectedLocation && <ChangeView center={selectedLocation} />}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={selectedLocation} 
            onPositionChange={handlePositionChange}
          />
        </MapContainer>

        {/* Overlay quand aucune position n'est sélectionnée */}
        {!selectedLocation && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 pointer-events-none">
            <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center pointer-events-auto">
              <MapPin size={32} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-medium text-gray-700">Cliquez sur la carte</p>
              <p className="text-xs text-gray-500">ou recherchez une adresse</p>
            </div>
          </div>
        )}
      </div>

      {/* Affichage des coordonnées sélectionnées */}
      {selectedLocation && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div>
            <label className="block text-xs font-medium text-emerald-700 mb-1">Latitude</label>
            <input 
              type="text" 
              value={selectedLocation[0].toFixed(6)} 
              readOnly 
              className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-mono text-emerald-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-emerald-700 mb-1">Longitude</label>
            <input 
              type="text" 
              value={selectedLocation[1].toFixed(6)} 
              readOnly 
              className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-mono text-emerald-900"
            />
          </div>
        </div>
      )}

      {/* Info OpenStreetMap */}
      <p className="text-xs text-gray-400 text-center">
        © OpenStreetMap contributors • Données mondiales gratuites
      </p>
    </div>
  );
}