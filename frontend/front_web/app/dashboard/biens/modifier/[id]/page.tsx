// app/dashboard/biens/modifier/[id]/page.tsx
'use client';

import { Header } from "@/components/dashboard/Header";
import {
  ArrowLeft,
  MapPin,
  Maximize,
  BedDouble,
  Euro,
  Check,
  AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getProperty, updateProperty } from '@/services/propertiesService';
import type { Property as ApiProperty } from '@/app/types/Property';

type Bien = {
  id: number;
  titre: string;
  adresse: string;
  surface: number;
  pieces: number;
  loyer: number;
  statut: string;
  image: string;
  description?: string;
};

const mapApiPropertyToBien = (p: ApiProperty): Bien => {
  const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.image : null;
  return {
    id: p.id,
    titre: p.title,
    adresse: `${p.address || ''}${p.city ? `, ${p.city}` : ''}`.trim(),
    surface: Number(p.surface || 0),
    pieces: Number(p.bedrooms || 0),
    loyer: Number((p as any).monthly_rent ?? p.price ?? 0),
    statut: p.status || 'vacant',
    image: firstImage || '/maison1.jpg',
    description: p.description || '',
  };
};

export default function ModifierBienPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => ({
    titre: '',
    adresse: '',
    description: '',
    surface: '',
    pieces: '',
    loyer: '',
    statut: 'vacant',
  }));

  useEffect(() => {
    if (!id) return;

    let active = true;
    setLoading(true);
    setLoadError(null);
    getProperty(id)
      .then((p: ApiProperty) => {
        if (!active) return;
        const mapped = mapApiPropertyToBien(p);
        setBien(mapped);
        setFormData({
          titre: mapped.titre || '',
          adresse: mapped.adresse || '',
          description: mapped.description || '',
          surface: mapped.surface ? String(mapped.surface) : '',
          pieces: mapped.pieces ? String(mapped.pieces) : '',
          loyer: mapped.loyer ? String(mapped.loyer) : '',
          statut: mapped.statut || 'vacant',
        });
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
  }, [id]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bien non trouvÃ©</h1>
          <p className="text-gray-500 mb-4">Le bien que vous souhaitez modifier n'existe pas.</p>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const surface = formData.surface ? parseInt(formData.surface, 10) : undefined;
      const bedrooms = formData.pieces ? parseInt(formData.pieces, 10) : undefined;
      const price = formData.loyer ? parseInt(formData.loyer, 10) : undefined;

      const payload: any = {
        title: formData.titre,
        address: formData.adresse,
        description: formData.description,
        status: formData.statut,
      };
      if (Number.isFinite(surface)) payload.surface = surface;
      if (Number.isFinite(bedrooms)) payload.bedrooms = bedrooms;
      if (Number.isFinite(price)) {
        payload.price = price;
        payload.monthly_rent = price;
      }

      await updateProperty(bien.id, payload);
      router.push(`/dashboard/biens/detail/${bien.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Modifier un bien"
        subtitle="Mettez Ã  jour les informations du bien"
        showSearch={false}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
          <img
            src={bien.image}
            alt={bien.titre}
            className="w-24 h-24 rounded-xl object-cover"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Bien sÃ©lectionnÃ©</p>
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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du bien <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface (mÂ²)
              </label>
              <div className="relative">
                <Maximize size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PiÃ¨ces
              </label>
              <div className="relative">
                <BedDouble size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="pieces"
                  value={formData.pieces}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loyer mensuel (FCFA)
              </label>
              <div className="relative">
                <Euro size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="loyer"
                  value={formData.loyer}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="vacant">Vacant</option>
                <option value="available">Disponible</option>
                <option value="loue">Loué</option>
                <option value="travaux">En travaux</option>
                <option value="reserve">Réservé</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/dashboard/biens/detail/${bien.id}`}
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
            >
              <Check size={18} />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            Les modifications sont affichÃ©es en temps rÃ©el uniquement aprÃ¨s enregistrement.
          </p>
        </div>
      </div>
    </div>
  );
}
