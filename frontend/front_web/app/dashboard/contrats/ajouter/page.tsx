// app/dashboard/contrats/ajouter/page.tsx
'use client';

import { Header } from "@/components/dashboard/Header";
import { 
  FileText, 
  User, 
  Home, 
  Calendar, 
  Euro, 
  Shield, 
  Upload, 
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  FileSignature,
  Printer,
  Eye,
  X,
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Données mockées - à remplacer par des appels API
const locatairesDisponibles = [
  { id: 1, nom: 'Marie Martin', email: 'marie.martin@email.com', telephone: '06 12 34 56 78' },
  { id: 2, nom: 'Pierre Bernard', email: 'pierre.bernard@email.com', telephone: '06 23 45 67 89' },
  { id: 3, nom: 'Sophie Petit', email: 'sophie.petit@email.com', telephone: '06 34 56 78 90' },
  { id: 4, nom: 'Lucas Moreau', email: 'lucas.moreau@email.com', telephone: '06 45 67 89 01' },
];

const biensDisponibles = [
  { id: 1, titre: 'Résidence du Parc - Apt 12', adresse: '15 Avenue des Champs-Élysées, Paris 8e', loyer: 850, charges: 120 },
  { id: 2, titre: 'Villa Bellevue', adresse: '42 Rue de la Paix, Nice', loyer: 1200, charges: 200 },
  { id: 3, titre: 'Studio Centre-ville', adresse: '8 Rue du Commerce, Lyon 2e', loyer: 450, charges: 50 },
  { id: 4, titre: 'Appartement Lyon Part-Dieu', adresse: '25 Rue de la République, Lyon 3e', loyer: 750, charges: 100 },
];

const typesBail = [
  { id: 'meuble', label: 'Bail meublé', dureeMin: 1, description: 'Durée min. 1 an (9 mois pour étudiants)' },
  { id: 'vide', label: 'Bail vide (résidence principale)', dureeMin: 3, description: 'Durée min. 3 ans' },
  { id: 'commercial', label: 'Bail commercial', dureeMin: 9, description: 'Durée min. 9 ans' },
  { id: 'saisonnier', label: 'Location saisonnière', dureeMin: 0, description: 'Max 90 jours consécutifs' },
  { id: 'etudiant', label: 'Bail étudiant', dureeMin: 1, description: 'Durée min. 1 an, renouvelable' },
];

const periodicites = [
  { id: 'mensuel', label: 'Mensuelle' },
  { id: 'trimestriel', label: 'Trimestrielle' },
  { id: 'annuel', label: 'Annuelle' },
];

export default function AjouterBailPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    // Étape 1: Parties
    locataireId: '',
    locataire: null as typeof locatairesDisponibles[0] | null,
    bienId: '',
    bien: null as typeof biensDisponibles[0] | null,
    
    // Étape 2: Conditions
    typeBail: 'meuble',
    dateEntree: '',
    duree: '1',
    dateSortie: '',
    depotGarantie: '',
    loyerHC: '',
    charges: '',
    periodicite: 'mensuel',
    jourPaiement: '5',
    modePaiement: 'virement',
    
    // Étape 3: Options
    revisionAnnuelle: true,
    tauxRevision: 'IRL',
    chargesRecuperables: true,
    travaux: '',
    etatLieux: 'numérique',
    assurance: true,
    
    // Documents
    documents: [] as File[],
    notes: '',
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Calcul automatique date de sortie
  useEffect(() => {
    if (formData.dateEntree && formData.duree) {
      const date = new Date(formData.dateEntree);
      date.setFullYear(date.getFullYear() + parseInt(formData.duree));
      setFormData(prev => ({ ...prev, dateSortie: date.toISOString().split('T')[0] }));
    }
  }, [formData.dateEntree, formData.duree]);

  // Mise à jour automatique loyer/charges quand bien sélectionné
  useEffect(() => {
    if (formData.bien) {
      setFormData(prev => ({
        ...prev,
        loyerHC: formData.bien!.loyer.toString(),
        charges: formData.bien!.charges.toString(),
        depotGarantie: (formData.bien!.loyer * 2).toString(),
      }));
    }
  }, [formData.bien]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const selectLocataire = (locataire: typeof locatairesDisponibles[0]) => {
    setFormData(prev => ({ ...prev, locataireId: locataire.id.toString(), locataire }));
  };

  const selectBien = (bien: typeof biensDisponibles[0]) => {
    setFormData(prev => ({ ...prev, bienId: bien.id.toString(), bien }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bail créé:', formData);
  };

  const totalLoyer = parseInt(formData.loyerHC || '0') + parseInt(formData.charges || '0');

  // Helper pour rendre le récapitulatif
  const renderRecapContent = () => {
    const items = [];
    
    if (formData.locataire) {
      items.push(
        <div key="locataire" className="pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase mb-1">Locataire</p>
          <p className="font-medium text-gray-900">{formData.locataire.nom}</p>
          <p className="text-gray-600">{formData.locataire.email}</p>
        </div>
      );
    }
    
    if (formData.bien) {
      items.push(
        <div key="bien" className="pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase mb-1">Bien</p>
          <p className="font-medium text-gray-900">{formData.bien.titre}</p>
          <p className="text-gray-600 text-xs">{formData.bien.adresse}</p>
        </div>
      );
    }

    if (formData.typeBail) {
      items.push(
        <div key="type" className="pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase mb-1">Type de bail</p>
          <p className="font-medium text-gray-900">
            {typesBail.find(t => t.id === formData.typeBail)?.label}
          </p>
        </div>
      );
    }

    if (formData.loyerHC || formData.charges) {
      items.push(
        <div key="montants">
          <p className="text-xs text-gray-500 uppercase mb-1">Montants</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Loyer HC:</span>
              <span className="font-medium">{formData.loyerHC}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Charges:</span>
              <span className="font-medium">{formData.charges}€</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-medium text-gray-900">Total:</span>
              <span className="font-bold text-emerald-600">{totalLoyer}€</span>
            </div>
          </div>
        </div>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header 
        title="Nouveau contrat de bail" 
        subtitle="Créez un bail numérique sécurisé"
        showSearch={false}
      />
      
      <div className="p-6 max-w-6xl mx-auto">
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
            {['Parties', 'Conditions financières', 'Options & Génération'].map((step, idx) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Étape 1: Parties */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                      <User size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Les parties</h2>
                      <p className="text-sm text-gray-500">Sélectionnez le locataire et le bien concernés</p>
                    </div>
                  </div>

                  {/* Sélection Locataire */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Locataire <span className="text-red-500">*</span>
                    </label>
                    {formData.locataire ? (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                            {formData.locataire.nom.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{formData.locataire.nom}</p>
                            <p className="text-sm text-gray-600">{formData.locataire.email}</p>
                            <p className="text-xs text-gray-500">{formData.locataire.telephone}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, locataireId: '', locataire: null }))}
                          className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-700"
                        >
                          Modifier
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {locatairesDisponibles.map(loc => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => selectLocataire(loc)}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left flex items-center gap-3"
                          >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                              {loc.nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{loc.nom}</p>
                              <p className="text-xs text-gray-500">{loc.email}</p>
                            </div>
                          </button>
                        ))}
                        <button
                          type="button"
                          className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center text-gray-500"
                        >
                          + Ajouter un nouveau locataire
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sélection Bien */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Bien immobilier <span className="text-red-500">*</span>
                    </label>
                    {formData.bien ? (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Home size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{formData.bien.titre}</p>
                            <p className="text-sm text-gray-600">{formData.bien.adresse}</p>
                            <p className="text-xs text-emerald-600 font-medium">{formData.bien.loyer}€/mois CC</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, bienId: '', bien: null }))}
                          className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-700"
                        >
                          Modifier
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {biensDisponibles.map(bien => (
                          <button
                            key={bien.id}
                            type="button"
                            onClick={() => selectBien(bien)}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900">{bien.titre}</p>
                              <span className="text-sm font-bold text-emerald-600">{bien.loyer}€</span>
                            </div>
                            <p className="text-xs text-gray-500">{bien.adresse}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 2: Conditions */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Conditions du bail</h2>
                      <p className="text-sm text-gray-500">Définissez les termes financiers et la durée</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Type de bail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Type de bail <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {typesBail.map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, typeBail: type.id }))}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData.typeBail === type.id
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-medium ${formData.typeBail === type.id ? 'text-emerald-900' : 'text-gray-900'}`}>
                                {type.label}
                              </span>
                              {formData.typeBail === type.id && <Check size={18} className="text-emerald-600" />}
                            </div>
                            <p className="text-xs text-gray-500">{type.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date d&apos;entrée <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          name="dateEntree"
                          value={formData.dateEntree}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Durée (années)</label>
                        <select
                          name="duree"
                          value={formData.duree}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          <option value="1">1 an</option>
                          <option value="3">3 ans</option>
                          <option value="6">6 ans</option>
                          <option value="9">9 ans</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de sortie prévue</label>
                      <input
                        type="date"
                        value={formData.dateSortie}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600"
                      />
                    </div>

                    {/* Finances */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <Euro size={18} className="text-gray-400"/>
                        Conditions financières
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Loyer HC (€) <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            name="loyerHC"
                            value={formData.loyerHC}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Charges (€)</label>
                          <input
                            type="number"
                            name="charges"
                            value={formData.charges}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dépôt de garantie (€)</label>
                          <input
                            type="number"
                            name="depotGarantie"
                            value={formData.depotGarantie}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Généralement 2 mois de loyer HC</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Périodicité</label>
                          <select
                            name="periodicite"
                            value={formData.periodicite}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            {periodicites.map(p => (
                              <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Loyer total (charges comprises):</span>
                          <span className="text-2xl font-bold text-emerald-600">{totalLoyer}€/mois</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jour de paiement</label>
                        <select
                          name="jourPaiement"
                          value={formData.jourPaiement}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          {Array.from({length: 31}, (_, i) => i + 1).map(jour => (
                            <option key={jour} value={jour}>Le {jour} du mois</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                        <select
                          name="modePaiement"
                          value={formData.modePaiement}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          <option value="virement">Virement bancaire</option>
                          <option value="prelevement">Prélèvement automatique</option>
                          <option value="cheque">Chèque</option>
                          <option value="especes">Espèces</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 3: Options et Génération */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white">
                      <FileSignature size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Finalisation</h2>
                      <p className="text-sm text-gray-500">Options du contrat et génération</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Révision annuelle du loyer</p>
                          <p className="text-xs text-gray-500">Indexation sur l&apos;IRL (Indice de Référence des Loyers)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="revisionAnnuelle"
                            checked={formData.revisionAnnuelle}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&apos;&apos;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Charges récupérables</p>
                          <p className="text-xs text-gray-500">Provisions sur charges avec régularisation annuelle</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="chargesRecuperables"
                            checked={formData.chargesRecuperables}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&apos;&apos;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Assurance habitation obligatoire</p>
                          <p className="text-xs text-gray-500">Le locataire doit souscrire une assurance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="assurance"
                            checked={formData.assurance}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&apos;&apos;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Travaux */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Travaux effectués avant location</label>
                      <textarea
                        name="travaux"
                        value={formData.travaux}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                        placeholder="Décrivez les éventuels travaux réalisés avant la mise en location..."
                      />
                    </div>

                    {/* Documents */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Documents joints</label>
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer">
                        <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Glissez des fichiers ou cliquez pour parcourir</p>
                        <p className="text-xs text-gray-400 mt-1">Pièces d&apos;identité, justificatifs de revenus, etc.</p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes internes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                        placeholder="Commentaires privés..."
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={18} />
                        Prévisualiser
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Printer size={18} />
                        Imprimer
                      </button>
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
                    disabled={currentStep === 1 && (!formData.locataire || !formData.bien)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200"
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
                    Générer le bail
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Récapitulatif latéral */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Récap */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600"/>
                  Récapitulatif
                </h3>
                
                <div className="space-y-4 text-sm">
                  {renderRecapContent()}
                </div>
              </div>

              {/* Alertes */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 text-sm">Informations importantes</p>
                    <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Le dépôt de garantie est plafonné à 2 mois de loyer HC</li>
                      <li>La révision annuelle suit l&apos;indice IRL</li>
                      <li>Le contrat doit être signé dans les 30 jours</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Aide */}
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 text-sm">Protection juridique</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Ce modèle est conforme à la législation française en vigueur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Prévisualisation Complète */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header du modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Prévisualisation du contrat</h3>
                <p className="text-sm text-gray-500">Contrat de bail {typesBail.find(t => t.id === formData.typeBail)?.label.toLowerCase()}</p>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
                {/* En-tête contrat */}
                <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-wide">CONTRAT DE BAIL</h2>
                  <p className="text-gray-600 mt-2 font-medium">
                    {typesBail.find(t => t.id === formData.typeBail)?.label.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Conforme à la loi n°89-462 du 6 juillet 1989
                  </p>
                </div>
                
                {/* Corps du contrat */}
                <div className="space-y-6 text-sm leading-relaxed text-gray-800">
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900">ENTRE LES SOUSSIGNÉS :</p>
                    <div className="pl-4 border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
                      <p className="font-semibold">Le Bailleur :</p>
                      <p>[Nom et prénom du propriétaire]</p>
                      <p>[Adresse du propriétaire]</p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg mt-4">
                      <p className="font-semibold">Et le Locataire :</p>
                      <p className="font-medium text-lg">{formData.locataire?.nom || '[Nom du locataire]'}</p>
                      <p>{formData.locataire?.email || '[Email]'}</p>
                      <p>{formData.locataire?.telephone || '[Téléphone]'}</p>
                    </div>
                  </div>

                  <div className="py-4">
                    <p className="font-bold text-gray-900 mb-4">IL A ÉTÉ CONVENU CE QUI SUIT :</p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Article 1 - Objet du bail</p>
                        <p>Le Bailleur loue au Locataire, qui accepte, les locaux suivants :</p>
                        <p className="font-medium mt-2 text-gray-900">{formData.bien?.titre || '[Titre du bien]'}</p>
                        <p className="text-gray-700">Situé au : <span className="font-medium">{formData.bien?.adresse || '[Adresse du bien]'}</span></p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Article 2 - Durée</p>
                        <p>
                          Le présent bail est consenti pour une durée de <span className="font-semibold">{formData.duree} an(s)</span>, 
                          commençant le <span className="font-semibold">{formData.dateEntree ? new Date(formData.dateEntree).toLocaleDateString('fr-FR') : '[Date d&apos;entrée]'}</span> 
                          et se terminant le <span className="font-semibold">{formData.dateSortie ? new Date(formData.dateSortie).toLocaleDateString('fr-FR') : '[Date de sortie]'}</span>.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Article 3 - Loyer et charges</p>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-gray-600">Loyer mensuel hors charges :</p>
                            <p className="text-xl font-bold text-emerald-600">{formData.loyerHC || '0'} €</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Provisions pour charges :</p>
                            <p className="text-xl font-bold text-emerald-600">{formData.charges || '0'} €</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Loyer total (charges comprises) :</span>
                            <span className="text-2xl font-bold text-emerald-700">{totalLoyer} €</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Payable le {formData.jourPaiement} de chaque mois par {formData.modePaiement === 'virement' ? 'virement bancaire' : formData.modePaiement}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Article 4 - Dépôt de garantie</p>
                        <p>
                          Le Locataire verse au Bailleur, à la signature du présent contrat, 
                          un dépôt de garantie d&apos;un montant de <span className="font-semibold">{formData.depotGarantie || '0'} €</span>, 
                          correspondant à <span className="font-semibold">{Math.round(parseInt(formData.depotGarantie || '0') / parseInt(formData.loyerHC || '1'))} mois</span> de loyer hors charges.
                        </p>
                      </div>

                      {formData.revisionAnnuelle ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-bold text-gray-900 mb-2">Article 5 - Révision du loyer</p>
                          <p>
                            Le loyer sera révisé chaque année à la date d&apos;anniversaire du contrat 
                            selon la variation de l&apos;Indice de Référence des Loyers (IRL).
                          </p>
                        </div>
                      ) : null}

                      {formData.assurance ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-bold text-gray-900 mb-2">Article 6 - Assurance</p>
                          <p>
                            Le Locataire doit souscrire une assurance habitation couvrant les risques 
                            locatifs (incendie, dégâts des eaux, etc.) et fournir une attestation 
                            annuelle de paiement à la demande du Bailleur.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="mt-12 pt-8 border-t-2 border-gray-300">
                    <p className="font-bold text-gray-900 mb-6">SIGNATURES</p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="border border-gray-300 rounded-lg p-4 h-32 flex flex-col justify-end">
                        <p className="text-xs text-gray-500 mb-2">Le Bailleur</p>
                        <div className="border-t border-dashed border-gray-400 pt-2">
                          <p className="text-sm text-gray-400">Signature précédée de la mention &quot;bon pour accord&quot;</p>
                        </div>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4 h-32 flex flex-col justify-end">
                        <p className="text-xs text-gray-500 mb-2">Le Locataire</p>
                        <div className="border-t border-dashed border-gray-400 pt-2">
                          <p className="text-sm text-gray-400">Signature précédée de la mention &quot;bon pour accord&quot;</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4">
                      Fait à [Ville], le {new Date().toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer du modal avec actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Printer size={18} />
                  Imprimer
                </button>
                <button
                  onClick={() => {
                    console.log('Téléchargement PDF...');
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  <Download size={18} />
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}