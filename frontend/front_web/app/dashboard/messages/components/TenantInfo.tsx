'use client';

import { User, FileText, CheckCircle, AlertCircle, Star, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

interface TenantInfoProps {
  tenant: {
    id: number;
    name: string;
    avatar: string | null;
    rating: number;
    dossierStatus: 'complete' | 'incomplete' | 'pending';
    income: number;
    garantor: boolean;
    visitDate: string | null;
    applicationDate: string;
    phone: string;
    email: string;
  };
  property: {
    id: number;
    title: string;
    address: string;
    rent: number;
  };
}

export function TenantInfo({ tenant, property }: TenantInfoProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Ligne principale */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {tenant.name.charAt(0)}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{tenant.name}</h3>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                <Star size={10} className="fill-amber-800" />
                {tenant.rating}/5
              </div>
            </div>
            <p className="text-sm text-gray-500">Intéressé par : {property.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge dossier */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            tenant.dossierStatus === 'complete' 
              ? 'bg-emerald-100 text-emerald-800' 
              : tenant.dossierStatus === 'pending'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {tenant.dossierStatus === 'complete' && <CheckCircle size={12} />}
            {tenant.dossierStatus === 'incomplete' && <AlertCircle size={12} />}
            Dossier {tenant.dossierStatus === 'complete' ? 'complet' : tenant.dossierStatus === 'pending' ? 'en cours' : 'incomplet'}
          </div>

          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? 'Moins' : 'Voir le profil'}
          </button>
        </div>
      </div>

      {/* Détails expansés */}
      {expanded && (
        <div className="px-6 pb-4 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Revenus mensuels</p>
              <p className="font-bold text-gray-900">{tenant.income.toLocaleString()}€</p>
              <p className="text-xs text-emerald-600">{(tenant.income / property.rent).toFixed(1)}x le loyer</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Garant</p>
              <p className={`font-bold ${tenant.garantor ? 'text-emerald-600' : 'text-gray-900'}`}>
                {tenant.garantor ? '✓ Présent' : 'Non renseigné'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Candidature</p>
              <p className="font-bold text-gray-900">
                {new Date(tenant.applicationDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              <Phone size={16} />
              Appeler
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              <Mail size={16} />
              Email
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors ml-auto">
              <FileText size={16} />
              Voir le dossier complet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}