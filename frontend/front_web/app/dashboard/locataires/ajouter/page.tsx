// app/dashboard/locataires/ajouter/page.tsx
'use client';

import { Header } from "@/components/dashboard/Header";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  FileText, 
  Upload, 
  UserCheck,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Plus
} from 'lucide-react';
import { useState, useRef } from 'react';

const civilites = [
  { id: 'mr', label: 'M.', value: 'Monsieur' },
  { id: 'mme', label: 'Mme', value: 'Madame' },
  { id: 'mlle', label: 'Mlle', value: 'Mademoiselle' },
];

const typesPiece = [
  { id: 'cni', label: 'Carte Nationale d\'Identité' },
  { id: 'passeport', label: 'Passeport' },
  { id: 'titre_sejour', label: 'Titre de séjour' },
  { id: 'permis', label: 'Permis de conduire' },
];

const situationsPro = [
  { id: 'salarie', label: 'Salarié(e)' },
  { id: 'independant', label: 'Indépendant(e)' },
  { id: 'retraite', label: 'Retraité(e)' },
  { id: 'etudiant', label: 'Étudiant(e)' },
  { id: 'sans_emploi', label: 'Sans emploi' },
  { id: 'autre', label: 'Autre' },
];

export default function AjouterLocatairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Identité
    civilite: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: 'Française',
    
    // Étape 2: Contact
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    
    // Étape 3: Professionnel
    situationProfessionnelle: '',
    profession: '',
    employeur: '',
    revenusMensuels: '',
    dateEmbauche: '',
    
    // Étape 4: Documents & Garant
    typePiece: '',
    numeroPiece: '',
    pieceFile: null as File | null,
    
    // Garant
    garant: {
      actif: false,
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      adresse: '',
      revenus: '',
      typePiece: '',
      numeroPiece: '',
    },
    
    // Notes
    notes: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pieceInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('garant.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        garant: { ...prev.garant, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePieceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, pieceFile: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Locataire créé:', formData);
    // Redirection vers la liste des locataires ou le profil créé
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header 
        title="Nouveau locataire" 
        subtitle="Créez un dossier locataire complet"
        showSearch={false}
      />
      
      <div className="p-6 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Étape {currentStep} sur {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {['Identité', 'Contact', 'Situation pro', 'Documents'].map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-2 ${
                  currentStep === idx + 1 ? 'text-emerald-600' : 
                  currentStep > idx + 1 ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === idx + 1 ? 'bg-emerald-100 text-emerald-700' : 
                  currentStep > idx + 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > idx + 1 ? <Check size={14} /> : idx + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Étape 1: Identité */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Identité</h2>
                  <p className="text-sm text-gray-500">Informations personnelles du locataire</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo de profil */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Photo</label>
                  <div className="relative w-32 h-32 mx-auto">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-2xl border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  {/* Civilité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Civilité <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      {civilites.map((civ) => (
                        <button
                          key={civ.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, civilite: civ.id }))}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                            formData.civilite === civ.id
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {civ.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="DUPONT"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Jean"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
                  <input
                    type="text"
                    name="lieuNaissance"
                    value={formData.lieuNaissance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                  <input
                    type="text"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Contact */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Coordonnées</h2>
                  <p className="text-sm text-gray-500">Comment contacter le locataire</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2 text-gray-400"/>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="jean.dupont@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2 text-gray-400"/>
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="06 12 34 56 78"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-gray-400"/>
                    Adresse actuelle
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                      <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="25 Rue de la Paix"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                        <input
                          type="text"
                          name="codePostal"
                          value={formData.codePostal}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="75002"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                        <input
                          type="text"
                          name="ville"
                          value={formData.ville}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="Paris"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Situation professionnelle */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Situation professionnelle</h2>
                  <p className="text-sm text-gray-500">Informations sur l'activité et les revenus</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Situation professionnelle <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {situationsPro.map((sit) => (
                      <button
                        key={sit.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, situationProfessionnelle: sit.id }))}
                        className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                          formData.situationProfessionnelle === sit.id
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {sit.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.situationProfessionnelle === 'salarie' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profession <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Ingénieur, Comptable..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employeur</label>
                      <input
                        type="text"
                        name="employeur"
                        value={formData.employeur}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Nom de l'entreprise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
                      <input
                        type="date"
                        name="dateEmbauche"
                        value={formData.dateEmbauche}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Revenus mensuels nets (€) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="revenusMensuels"
                        value={formData.revenusMensuels}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="2500"
                      />
                    </div>
                  </div>
                )}

                {/* Ratio loyer/revenus indicator */}
                {formData.revenusMensuels && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={18} className="text-emerald-600" />
                      <span className="font-medium text-emerald-900">Capacité financière</span>
                    </div>
                    <p className="text-sm text-emerald-700">
                      Revenus déclarés: <strong>{parseInt(formData.revenusMensuels).toLocaleString()}€/mois</strong>
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Le loyer ne devrait pas dépasser 33% des revenus soit ~{Math.round(parseInt(formData.revenusMensuels) * 0.33).toLocaleString()}€
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Étape 4: Documents & Garant */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Documents & Garant</h2>
                  <p className="text-sm text-gray-500">Pièces justificatives et caution</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Pièce d'identité */}
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-gray-400"/>
                    Pièce d'identité
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type de pièce <span className="text-red-500">*</span></label>
                      <select
                        name="typePiece"
                        value={formData.typePiece}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        {typesPiece.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="numeroPiece"
                        value={formData.numeroPiece}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="1234567890123"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scan de la pièce</label>
                    <input
                      type="file"
                      ref={pieceInputRef}
                      onChange={handlePieceUpload}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => pieceInputRef.current?.click()}
                      className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition-colors ${
                        formData.pieceFile 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-300 hover:border-emerald-500 text-gray-500'
                      }`}
                    >
                      <Upload size={24} />
                      <span className="text-sm font-medium">
                        {formData.pieceFile ? formData.pieceFile.name : 'Cliquez pour télécharger la pièce'}
                      </span>
                      <span className="text-xs text-gray-400">PDF, JPG, PNG (max 10MB)</span>
                    </button>
                  </div>
                </div>

                {/* Garant */}
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <UserCheck size={18} className="text-gray-400"/>
                      Garant / Caution
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.garant.actif}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          garant: { ...prev.garant, actif: e.target.checked }
                        }))}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Ajouter un garant</span>
                    </label>
                  </div>

                  {formData.garant.actif && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="garant.nom"
                          value={formData.garant.nom}
                          onChange={handleInputChange}
                          placeholder="Nom du garant"
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          name="garant.prenom"
                          value={formData.garant.prenom}
                          onChange={handleInputChange}
                          placeholder="Prénom"
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="tel"
                          name="garant.telephone"
                          value={formData.garant.telephone}
                          onChange={handleInputChange}
                          placeholder="Téléphone"
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <input
                          type="email"
                          name="garant.email"
                          value={formData.garant.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                      <input
                        type="text"
                        name="garant.adresse"
                        value={formData.garant.adresse}
                        onChange={handleInputChange}
                        placeholder="Adresse complète"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <input
                        type="number"
                        name="garant.revenus"
                        value={formData.garant.revenus}
                        onChange={handleInputChange}
                        placeholder="Revenus mensuels du garant (€)"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes internes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                    placeholder="Informations complémentaires..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
              Précédent
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Suivant
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                <Check size={18} />
                Créer le locataire
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}