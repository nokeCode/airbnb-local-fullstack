'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { MapPin, Users, Wifi, Coffee, Car, Wind } from 'lucide-react';

interface Room {
  id: string;
  title: string;
  pricePerNight: number;
  pricePerMonth: number;
  location: string;
  surface: number;
  maxGuests: number;
  image: string;
  amenities: string[];
  rating: number;
  reviews: number;
  type: 'hotel' | 'coliving' | 'residence' | 'bnb';
}

export default function ChambresPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'hotel' | 'coliving' | 'residence'>('all');

  useEffect(() => {
    const mockRooms: Room[] = [
      {
        id: '1',
        title: 'Chambre deluxe vue mer',
        pricePerNight: 120,
        pricePerMonth: 2800,
        location: 'Nice, Côte d\'Azur',
        surface: 25,
        maxGuests: 2,
        image: '/chambre1.avif',
        amenities: ['wifi', 'parking', 'ac', 'breakfast'],
        rating: 4.8,
        reviews: 124,
        type: 'hotel',
      },
      {
        id: '2',
        title: 'Coliving moderne centre-ville',
        pricePerNight: 45,
        pricePerMonth: 950,
        location: 'Paris 11ème, Île-de-France',
        surface: 18,
        maxGuests: 1,
        image: '/chambre2.avif',
        amenities: ['wifi', 'kitchen', 'laundry', 'gym'],
        rating: 4.6,
        reviews: 89,
        type: 'coliving',
      },
      {
        id: '3',
        title: 'Résidence étudiante premium',
        pricePerNight: 35,
        pricePerMonth: 750,
        location: 'Lyon 7ème, Rhône',
        surface: 20,
        maxGuests: 1,
        image: '/chambre3.webp',
        amenities: ['wifi', 'kitchen', 'study_room', 'security'],
        rating: 4.5,
        reviews: 203,
        type: 'residence',
      },
      {
        id: '4',
        title: 'Suite parentale luxueuse',
        pricePerNight: 180,
        pricePerMonth: 3500,
        location: 'Bordeaux, Gironde',
        surface: 35,
        maxGuests: 2,
        image: '/salon.png',
        amenities: ['wifi', 'parking', 'ac', 'minibar', 'balcony'],
        rating: 4.9,
        reviews: 67,
        type: 'hotel',
      },
      {
        id: '5',
        title: 'Chambre cosy en colocation',
        pricePerNight: 40,
        pricePerMonth: 850,
        location: 'Marseille, Bouches-du-Rhône',
        surface: 15,
        maxGuests: 1,
        image: '/room_tour.png',
        amenities: ['wifi', 'kitchen', 'terrace'],
        rating: 4.4,
        reviews: 45,
        type: 'coliving',
      },
      {
        id: '6',
        title: 'Studio-chambre meublé',
        pricePerNight: 55,
        pricePerMonth: 1100,
        location: 'Nantes, Loire-Atlantique',
        surface: 22,
        maxGuests: 2,
        image: '/roomtour.jpg',
        amenities: ['wifi', 'kitchen', 'parking'],
        rating: 4.7,
        reviews: 156,
        type: 'residence',
      },
    ];
    
    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRooms = activeTab === 'all' 
    ? rooms 
    : rooms.filter(room => room.type === activeTab);

  const getAmenityIcon = (amenity: string) => {
    switch(amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'ac': return <Wind className="w-4 h-4" />;
      case 'breakfast': return <Coffee className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-900 to-pink-800 text-white py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/hero-house.jpg')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chambres & Hébergements</h1>
          <p className="text-xl text-rose-100 max-w-2xl">
            Des solutions d'hébergement flexibles pour tous vos besoins : 
            courte durée, coliving, résidences étudiantes et hôtels.
          </p>
          
          {/* Quick Search */}
          <div className="mt-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Où allez-vous ?"
                    className="bg-transparent border-none outline-none text-white placeholder-rose-200 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dates</label>
                <input 
                  type="text" 
                  placeholder="Arrivée - Départ"
                  className="w-full bg-white/20 rounded-lg px-3 py-2 text-white placeholder-rose-200 border-none outline-none"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-white text-rose-600 py-2 rounded-lg font-semibold hover:bg-rose-50 transition">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'all', label: 'Tous', count: rooms.length },
              { id: 'hotel', label: 'Hôtels', count: rooms.filter(r => r.type === 'hotel').length },
              { id: 'coliving', label: 'Coliving', count: rooms.filter(r => r.type === 'coliving').length },
              { id: 'residence', label: 'Résidences', count: rooms.filter(r => r.type === 'residence').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  activeTab === tab.id 
                    ? 'border-rose-500 text-rose-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'all' ? 'Toutes les chambres' : `Chambres ${activeTab}`}
          </h2>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
            <option>Mieux notés</option>
            <option>Plus proches</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold text-sm">{room.rating}</span>
                    <span className="text-gray-500 text-xs">({room.reviews})</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      room.type === 'hotel' ? 'bg-blue-100 text-blue-800' :
                      room.type === 'coliving' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {room.type === 'hotel' ? 'Hôtel' : room.type === 'coliving' ? 'Coliving' : 'Résidence'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{room.title}</h3>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {room.location}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{room.maxGuests} pers.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{room.surface} m²</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex gap-2 mb-4">
                    {room.amenities.slice(0, 4).map(amenity => (
                      <div key={amenity} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                        {getAmenityIcon(amenity)}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-rose-600">{room.pricePerNight}€</span>
                        <span className="text-gray-500 text-sm">/nuit</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ou {room.pricePerMonth}€/mois
                      </div>
                    </div>
                    <button className="bg-rose-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-700 transition">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Banner */}
      <section className="bg-rose-50 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir nos hébergements ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des solutions flexibles adaptées à tous les besoins, du court séjour au long terme.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Wifi, title: 'WiFi haut débit', desc: 'Connexion fibre dans tous nos hébergements' },
              { icon: Users, title: 'Communauté', desc: 'Rencontrez d\'autres résidents' },
              { icon: Coffee, title: 'Services inclus', desc: 'Ménage, linge, petit-déjeuner selon offres' },
              { icon: Car, title: 'Parking disponible', desc: 'Places de parking sur demande' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
