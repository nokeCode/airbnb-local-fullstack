'use client';

import { Heart, MapPin, Maximize, BedDouble, Bath, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isFavorite as readIsFavorite, toggleFavorite } from '@/lib/favorites';

import type { DisplayProperty } from '@/app/types/Property';

interface PropertyCardProps {
  property: DisplayProperty & {
    charges?: number;
    available?: string;
    distance?: string;
    rating?: number;
    reviews?: number;
    tags?: string[];
    isNew?: boolean;
    isFavorite?: boolean;
    type?: 'sale' | 'location';
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);
  const router = useRouter();

  const formatFCFA = (value: number) => `${Math.round(value).toLocaleString('fr-FR')} FCFA`;

  useEffect(() => {
    setIsFavorite(readIsFavorite(property.id));
  }, [property.id]);

  const handleRent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const token =
      typeof window !== 'undefined'
        ? (localStorage.getItem('access') || localStorage.getItem('token'))
        : null;
    if (!token) {
      router.push(`/login?next=/client&property=${property.id}`);
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPropertyId', String(property.id));
    }
    router.push(`/client?property=${property.id}`);
  };

  const handleDiscuss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const token =
      typeof window !== 'undefined'
        ? (localStorage.getItem('access') || localStorage.getItem('token'))
        : null;
    if (!token) {
      router.push(`/login?next=/client/messages&property=${property.id}`);
      return;
    }
    router.push(`/client/messages?property=${property.id}`);
  };

  return (
    <Link
      href={`/bien/${property.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer block"
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isNew && (
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
              Nouveau
            </span>
          )}
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-full">
            {property.type}
          </span>
        </div>

        {/* Favoris */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const next = toggleFavorite(property.id);
            setIsFavorite(next.isFavorite);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <Heart 
            size={18} 
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
          />
        </button>

        {/* Distance */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
          <MapPin size={12} />
          {property.distance}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-gray-900">{property.rating}</span>
          <span className="text-sm text-gray-500">({property.reviews} avis)</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {property.title}
        </h3>
        
        {/* Address */}
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <MapPin size={14} />
          <span className="truncate">{property.address}</span>
        </p>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
            <Maximize size={12} />
            {property.surface}m²
          </span>
  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
    <BedDouble size={12} />
    {property.bedrooms || 0} ch.
  </span>
          {property.bathrooms && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
              <Bath size={12} />
              {property.bathrooms} sdb
            </span>
          )}
        </div>

        {/* Tags */}
  <div className="flex flex-wrap gap-1 mb-4">
    {(property.equipements ?? []).map((equip, idx) => (
      <span key={idx} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
        {equip}
      </span>
    ))}
  </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
  <p className="text-2xl font-bold text-gray-900">
    {formatFCFA(property.price)}
    {property.contract_type === 'rent' && <span className="text-sm font-normal text-gray-500">/mois</span>}
  </p>
            {property.charges && (
              <p className="text-xs text-gray-500">+ {formatFCFA(property.charges)} charges</p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className="text-xs text-gray-500 mb-1">Disponible</p>
            <p className="text-sm font-semibold text-emerald-600">{property.available}</p>
            <button
              onClick={handleDiscuss}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Discuter
            </button>
            <button
              onClick={handleRent}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Louer
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
