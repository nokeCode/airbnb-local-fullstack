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
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  statut: 'loué' | 'vacant' | 'travaux';
  locataire: string | null;
  debutBail: string | null;
  finBail: string | null;
  image: string;
  description?: string;
  etage?: number;
  totalEtages?: number;
  anneeConstruction?: number;
  charges?: number;
}

// Données mockées (à remplacer par un appel API)
const getBienById = (id: string): Bien | undefined => {
  const biens: Bien[] = [
    {
      id: 1,
      titre: 'Résidence du Parc - Apt 12',
      adresse: '15 Avenue des Champs-Élysées, Paris 8e',
      type: 'Appartement',
      surface: 65,
      pieces: 3,
      loyer: 850,
      valeur: 450000,
      statut: 'loué',
      locataire: 'Marie Martin',
      debutBail: '01/03/2022',
      finBail: '28/02/2025',
      image: '/maison4.jpg',
      description: 'Magnifique appartement lumineux avec vue sur le parc, entièrement rénové en 2023.',
      etage: 4,
      totalEtages: 7,
      anneeConstruction: 2015,
      charges: 150
    },
  ];
  return biens.find(b => b.id === parseInt(id));
};

const statuts = [
  { value: 'loué', label: 'Loué', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  { value: 'vacant', label: 'À louer', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  { value: 'travaux', label: 'En travaux', color: 'bg-red-100 text-red-700 border-red-200', icon: Wrench },
] as const;

export default function BienDetailPage() {
  const params = useParams();
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const bien = getBienById(params.id as string);

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
    switch(statut) {
      case 'loué': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'vacant': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'travaux': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch(statut) {
      case 'loué': return 'Loué';
      case 'vacant': return 'À louer';
      case 'travaux': return 'En travaux';
      default: return statut;
    }
  };

  const handleStatusChange = (newStatus: typeof bien.statut) => {
    // Logique de changement de statut ici
    console.log('Changement de statut:', bien.id, '->', newStatus);
    setShowStatusModal(false);
  };

  const currentStatut = statuts.find(s => s.value === bien.statut);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header personnalisé avec actions */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image principale */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="relative h-96">
                <img
                  src={bien.image}
                  alt={bien.titre}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold border ${getStatutColor(bien.statut)}`}>
                  {getStatutLabel(bien.statut)}
                </div>
              </div>
              
              {/* Miniatures (simulation) */}
              <div className="p-4 flex gap-3 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 flex-shrink-0 hover:border-gray-900 cursor-pointer transition-colors">
                    <img
                      src={bien.image}
                      alt={`Vue ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium flex-shrink-0 cursor-pointer hover:bg-gray-200 transition-colors">
                  +23
                </div>
              </div>
            </div>

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

            {/* Localisation (simulation carte) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Localisation</h2>
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="relative text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">{bien.adresse}</p>
                  <button className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    Voir sur la carte →
                  </button>
                </div>
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
                  <span className="text-lg font-bold text-gray-900">{bien.valeur.toLocaleString()} €</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Loyer mensuel</span>
                  <span className="text-lg font-bold text-emerald-600">{bien.loyer} €</span>
                </div>

                {bien.charges && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Charges mensuelles</span>
                    <span className="font-medium text-gray-900">{bien.charges} €</span>
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




