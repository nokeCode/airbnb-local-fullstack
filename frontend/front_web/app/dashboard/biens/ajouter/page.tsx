// app/dashboard/biens/ajouter/page.tsx
'use client';

import { Header } from "@/components/dashboard/Header";
import {
  Building2,
  MapPin,
  Euro,
  Image as ImageIcon,
  BedDouble,
  Bath,
  Car,
  Wifi,
  Tv,
  Flame,
  Snowflake,
  Waves,
  Shield,
  Plus,
  Trash2,
  ChevronDown,
  Check,
  X,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createPropertyJson, addPropertyImages } from '@/services/propertiesService';
import { getCurrentUser } from '@/services/usersService';
import type { CurrentUser } from '@/types/user';

// Import dynamique pour éviter l'erreur "window is not defined" côté SSR.
const AddressAutocompleteOSM = dynamic(
  () => import('@/components/dashboard/AddressAutocompleteOSM'),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 w-full rounded-xl border-2 border-gray-200 bg-gray-100 animate-pulse" />
    ),
  }
);

const categories = [
  { id: 'appartement', label: 'Appartement', icon: Building2 },
  { id: 'maison', label: 'Maison', icon: Building2 },
  { id: 'bureau', label: 'Bureau', icon: Building2 },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'local_commercial', label: 'Local commercial', icon: Building2 },
  { id: 'terrain', label: 'Terrain', icon: MapPin },
  { id: 'autre', label: 'Autre', icon: Building2 },
];

const typesAppartement = [
  'Studio',
  'Chambre salon',
  '2 pièces',
  '3 pièces',
  '4 pièces',
  '5 pièces et plus',
  'Duplex',
  'Triplex',
  'Penthouse',
  'Loft',
  'Autre'
];

const equipementsList = [
  { id: 'wifi', label: 'Wi-Fi / Internet', icon: Wifi },
  { id: 'tv', label: 'Télévision', icon: Tv },
  { id: 'climatisation', label: 'Climatisation', icon: Snowflake },
  { id: 'chauffage', label: 'Chauffage central', icon: Flame },
  { id: 'eau_chaude', label: 'Eau chaude', icon: Waves },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'securite', label: 'Système de sécurité', icon: Shield },
  { id: 'meuble', label: 'Meublé', icon: BedDouble },
  { id: 'cuisine', label: 'Cuisine équipée', icon: Building2 },
  { id: 'balcon', label: 'Balcon / Terrasse', icon: Building2 },
  { id: 'ascenseur', label: 'Ascenseur', icon: Building2 },
  { id: 'gardien', label: 'Gardien / Concierge', icon: Shield },
];

const statuts = [
  { id: 'vacant', label: 'Vacant', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'loue', label: 'Loué', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'travaux', label: 'En travaux', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'reserve', label: 'Réservé', color: 'bg-violet-100 text-violet-700 border-violet-200' },
];

export default function AjouterBienPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    typeAppartement: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France',
    description: '',
    surface: '',
    nombreChambres: '',
    nombreSallesDeBain: '',
    loyerHC: '',
    charges: '',
    statut: 'vacant',
    dateDisponibilite: '',
    equipements: [] as string[],
    latitude: 0,
    longitude: 0,
  });

  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showEquipements, setShowEquipements] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États pour gestion des soumissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEquipement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.includes(id)
        ? prev.equipements.filter(e => e !== id)
        : [...prev.equipements, id]
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Validation des données obligatoires
      if (!formData.titre.trim()) {
        throw new Error('Le titre du bien est obligatoire');
      }
      if (!formData.categorie) {
        throw new Error('La catégorie est obligatoire');
      }
      if (!formData.adresse.trim()) {
        throw new Error('L\'adresse est obligatoire');
      }
      if (!formData.ville.trim()) {
        throw new Error('La ville est obligatoire');
      }
      if (!formData.surface) {
        throw new Error('La surface est obligatoire');
      }
      if (!formData.loyerHC) {
        throw new Error('Le loyer mensuel est obligatoire');
      }

      // Préparer les données pour l'API
      const propertyPayload = {
        title: formData.titre,
        description: formData.description || '',
        address: formData.adresse,
        city: formData.ville,
        postal_code: formData.codePostal.trim() || undefined,
        country: formData.pays,
        price: parseInt(formData.loyerHC),
        surface: parseInt(formData.surface),
        bedrooms: parseInt(formData.nombreChambres) || 0,
        bathrooms: parseInt(formData.nombreSallesDeBain) || 0,
        contract_type: 'rent' as const, // Type de contrat (rent par défaut)
        status: formData.statut,
        category_name: formData.categorie,
        equipment: formData.equipements,
        latitude: formData.latitude ? parseFloat(formData.latitude.toFixed(6)) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude.toFixed(6)) : undefined,
        monthly_rent: parseInt(formData.loyerHC),
        monthly_charges: formData.charges ? parseInt(formData.charges) : undefined,
        available_date: formData.dateDisponibilite || undefined,
        owner_name: currentUser?.name || '',
        owner_phone: currentUser?.phone || '',
      };

      // Créer le bien
      const createdProperty = await createPropertyJson(propertyPayload);

      // Ajouter les images si présentes
      if (photos.length > 0) {
        const formDataImages = new FormData();
        photos.forEach((photo) => {
          formDataImages.append('images', photo.file);
        });
        await addPropertyImages(createdProperty.id, formDataImages);
      }

      setSuccessMessage('Bien créé avec succès! Redirection en cours...');
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        router.push('/dashboard/biens');
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du bien';
      setErrorMessage(errorMsg);
      console.error('Erreur création bien:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header
        title="Ajouter un bien"
        subtitle="Créez une nouvelle fiche immobilière"
        showSearch={false}
      />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Étape {currentStep} sur {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complété</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {['Informations générales', 'Localisation', 'Détails & Photos', 'Tarification'].map((step, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx + 1)}
                className={`text-xs font-medium transition-colors ${currentStep === idx + 1 ? 'text-emerald-600' :
                  currentStep > idx + 1 ? 'text-gray-900' : 'text-gray-400'
                  }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Étape 1: Informations générales */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Building2 className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Informations générales</h2>
                  <p className="text-sm text-gray-500">Définissez le type et le nom de votre bien</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du bien <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    placeholder="Ex: Résidence du Parc - Appartement 12"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, categorie: cat.id }))}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.categorie === cat.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                      >
                        <cat.icon size={24} />
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.categorie === 'appartement' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'appartement
                    </label>
                    <select
                      name="typeAppartement"
                      value={formData.typeAppartement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="">Sélectionnez un type</option>
                      {typesAppartement.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Décrivez votre bien, ses atouts, sa situation..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  />
                </div>


              </div>
            </div>
          )}

          {/* Étape 2: Localisation */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Localisation</h2>
                  <p className="text-sm text-gray-500">Où se situe votre bien ?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Autocomplétion d'adresse avec carte */}
                <div className="md:col-span-2">
                  <AddressAutocompleteOSM
                    defaultAddress={formData.adresse}
                    onAddressSelect={(address) => {
                      setFormData(prev => ({
                        ...prev,
                        adresse: address.adresse,
                        ville: address.ville,
                        codePostal: address.codePostal,
                        pays: address.pays,
                        // Vous pouvez aussi stocker lat/lng si besoin dans votre state
                        latitude: address.lat,
                        longitude: address.lng,
                      }));

                      // Envoi au backend
                      console.log('Coordonnées exactes:', {
                        lat: address.lat,
                        lng: address.lng,
                        address: address.adresse
                      });
                    }}
                  />
                </div>

                {/* Ville - Auto-rempli mais modifiable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    placeholder="Paris, Lyon, Marseille..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Code postal - Auto-rempli mais modifiable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="codePostal"
                    value={formData.codePostal}
                    onChange={handleInputChange}
                    placeholder="75001"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Pays */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <select
                    name="pays"
                    value={formData.pays}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Canada">Canada</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Détails et Photos */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <ImageIcon className="text-violet-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Détails & Photos</h2>
                  <p className="text-sm text-gray-500">Caractéristiques et visuels du bien</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="surface"
                    value={formData.surface}
                    onChange={handleInputChange}
                    placeholder="65"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chambres
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        nombreChambres: Math.max(0, parseInt(prev.nombreChambres || '0') - 1).toString()
                      }))}
                      className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="nombreChambres"
                      value={formData.nombreChambres}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        nombreChambres: (parseInt(prev.nombreChambres || '0') + 1).toString()
                      }))}
                      className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salles de bain
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        nombreSallesDeBain: Math.max(0, parseInt(prev.nombreSallesDeBain || '0') - 1).toString()
                      }))}
                      className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="nombreSallesDeBain"
                      value={formData.nombreSallesDeBain}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        nombreSallesDeBain: (parseInt(prev.nombreSallesDeBain || '0') + 1).toString()
                      }))}
                      className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Équipements */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Équipements
                </label>
                <button
                  type="button"
                  onClick={() => setShowEquipements(!showEquipements)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className={formData.equipements.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.equipements.length > 0
                      ? `${formData.equipements.length} équipement(s) sélectionné(s)`
                      : 'Sélectionnez les équipements'}
                  </span>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ${showEquipements ? 'rotate-180' : ''}`} />
                </button>

                {showEquipements && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {equipementsList.map((eq) => {
                      const isSelected = formData.equipements.includes(eq.id);
                      return (
                        <button
                          key={eq.id}
                          type="button"
                          onClick={() => toggleEquipement(eq.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                        >
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-200' : 'bg-gray-100'}`}>
                            <eq.icon size={16} />
                          </div>
                          <span className="text-xs font-medium">{eq.label}</span>
                          {isSelected && <Check size={14} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upload Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photos du bien <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img
                        src={photo.preview}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2 transition-all"
                  >
                    <Plus size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Ajouter</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Formats acceptés: JPG, PNG, WebP. Taille max: 10MB par photo</p>
              </div>
            </div>
          )}

          {/* Étape 4: Tarification et Statut */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Euro className="text-amber-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tarification & Disponibilité</h2>
                  <p className="text-sm text-gray-500">Définissez les montants et le statut</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loyer mensuel hors charges (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Euro size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="loyerHC"
                      value={formData.loyerHC}
                      onChange={handleInputChange}
                      placeholder="850"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charges mensuelles (FCFA)
                  </label>
                  <div className="relative">
                    <Euro size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="charges"
                      value={formData.charges}
                      onChange={handleInputChange}
                      placeholder="120"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Statut du bien <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statuts.map((statut) => (
                      <button
                        key={statut.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, statut: statut.id }))}
                        className={`p-4 rounded-xl border-2 transition-all ${formData.statut === statut.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statut.color}`}>
                          {statut.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de disponibilité
                  </label>
                  <input
                    type="date"
                    name="dateDisponibilite"
                    value={formData.dateDisponibilite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loyer HC:</span>
                    <span className="font-medium">{formData.loyerHC ? `${formData.loyerHC} FCFA` : '-'}/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charges:</span>
                    <span className="font-medium">{formData.charges ? `${formData.charges} FCFA` : '-'}/mois</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-medium">Total:</span>
                    <span className="font-bold text-emerald-600">
                      {formData.loyerHC && formData.charges
                        ? `${parseInt(formData.loyerHC) + parseInt(formData.charges)} FCFA`
                        : '-'
                      }/mois
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || isSubmitting}
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Créer le bien
                  </>
                )}
              </button>
            )}
          </div>

          {/* Messages d'erreur */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900">Erreur</h4>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Messages de succès */}
          {successMessage && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <Check size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-emerald-900">Succès</h4>
                <p className="text-sm text-emerald-700 mt-1">{successMessage}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
