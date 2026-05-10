// app/owner/messages/components/PropertyContext.tsx
// Affiche le contexte du bien concerné par la conversation

'use client';

import { Building2, MapPin, Euro, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PropertyContextProps {
  property: {
    id: number;
    title: string;
    address: string;
    price: number;
    image: string;
    status: 'available' | 'rented' | 'pending';
    visits_count: number;
    applications_count: number;
  };
}

export function PropertyContext({ property }: PropertyContextProps) {
  const statusConfig = {
    available: { label: 'Disponible', color: 'bg-emerald-100 text-emerald-800' },
    rented: { label: 'Loué', color: 'bg-gray-100 text-gray-800' },
    pending: { label: 'En cours', color: 'bg-amber-100 text-amber-800' },
  };

  const status = statusConfig[property.status];

  return (
    <div className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-4">
        {/* Miniature */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
            <span className="text-xs text-gray-500">
              {property.applications_count} candidatures
            </span>
          </div>
          
          <h4 className="font-bold text-gray-900 truncate">{property.title}</h4>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {property.address}
            </span>
            <span className="flex items-center gap-1 font-medium text-gray-900">
              <Euro size={14} />
              {property.price}€/mois
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="text-right mr-4">
            <p className="text-xs text-gray-500">Visites prévues</p>
            <p className="font-bold text-blue-600">{property.visits_count}</p>
          </div>
          
          <Link
            href={`/dashboard/biens/${biens.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={16} />
            Voir le bien
          </Link>
        </div>
      </div>
    </div>
  );
}