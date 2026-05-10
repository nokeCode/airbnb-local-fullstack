// app/dashboard/biens/supprimer/[id]/page.tsx
'use client';

import { Header } from "@/components/dashboard/Header";
import {
  ArrowLeft,
  Trash2,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface Bien {
  id: number;
  titre: string;
  adresse: string;
  type: string;
  surface: number;
  pieces: number;
  loyer: number;
  valeur: number;
  statut: 'louÃ©' | 'vacant' | 'travaux';
  locataire: string | null;
  debutBail: string | null;
  finBail: string | null;
  image: string;
}

const getBienById = (id: string): Bien | undefined => {
  const biens: Bien[] = [
    {
      id: 1,
      titre: 'RÃ©sidence du Parc - Apt 12',
      adresse: '15 Avenue des Champs-Ã‰lysÃ©es, Paris 8e',
      type: 'Appartement',
      surface: 65,
      pieces: 3,
      loyer: 850,
      valeur: 450000,
      statut: 'louÃ©',
      locataire: 'Marie Martin',
      debutBail: '01/03/2022',
      finBail: '28/02/2025',
      image: '/maison4.jpg'
    },
    {
      id: 2,
      titre: 'Villa Bellevue',
      adresse: '42 Rue de la Paix, Nice',
      type: 'Maison',
      surface: 120,
      pieces: 5,
      loyer: 1200,
      valeur: 680000,
      statut: 'louÃ©',
      locataire: 'Pierre Bernard',
      debutBail: '15/06/2023',
      finBail: '14/06/2026',
      image: '/maison5.jpg'
    },
  ];
  return biens.find(b => b.id === parseInt(id));
};

export default function SupprimerBienPage() {
  const params = useParams();
  const router = useRouter();
  const bien = getBienById(params.id as string);

  if (!bien) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bien non trouvÃ©</h1>
          <p className="text-gray-500 mb-4">Le bien que vous souhaitez supprimer n'existe pas.</p>
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

  const handleDelete = () => {
    console.log('Suppression du bien:', bien.id);
    router.push('/dashboard/biens');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Supprimer un bien"
        subtitle="Confirmez la suppression dÃ©finitive"
        showSearch={false}
      />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
          <img
            src={bien.image}
            alt={bien.titre}
            className="w-24 h-24 rounded-xl object-cover"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Bien Ã  supprimer</p>
            <h2 className="text-lg font-bold text-gray-900">{bien.titre}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              {bien.adresse}
            </p>
          </div>
          <Link
            href={`/dashboard/biens/detail/${bien.id}`}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Voir la fiche
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-700 mb-1">Suppression dÃ©finitive</h3>
              <p className="text-sm text-red-600">
                Cette action est irrÃ©versible. Toutes les informations liÃ©es Ã  ce bien seront supprimÃ©es.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-md font-bold text-gray-900 mb-4">Confirmation</h3>
          <p className="text-sm text-gray-600 mb-6">
            Voulez-vous vraiment supprimer <strong>{bien.titre}</strong> ?
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/biens/detail/${bien.id}`}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Supprimer dÃ©finitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
