'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  CreditCard,
  Shield,
  Power,
  Edit2,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  FileText,
  History,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// Mock data pour un utilisateur spécifique
const userData = {
  id: '1',
  email: 'marie.martin@email.com',
  nom: 'Martin',
  prenom: 'Marie',
  role: 'proprietaire',
  status: 'actif',
  telephone: '06 12 34 56 78',
  dateInscription: '2024-01-15',
  derniereConnexion: '2024-04-20 14:30',
  verified: true,
  adresse: '15 Avenue des Champs-Élysées',
  ville: 'Paris',
  codePostal: '75008',
  pays: 'France',
  biensCount: 3,
  locatairesCount: 4,
  abonnement: {
    plan: 'pro',
    prix: 29.99,
    dateDebut: '2024-01-15',
    dateFin: '2025-01-15',
    statut: 'actif',
    facturation: 'annuelle'
  },
  activite: [
    { date: '2024-04-20 14:30', action: 'Connexion', details: 'IP: 192.168.1.1', type: 'connexion' },
    { date: '2024-04-19 10:15', action: 'Ajout bien', details: 'Studio Centre-ville ajouté', type: 'creation' },
    { date: '2024-04-18 16:45', action: 'Paiement reçu', details: 'Loyer Appartement 12: 850€', type: 'financier' },
    { date: '2024-04-15 09:00', action: 'Modification profil', details: 'Téléphone mis à jour', type: 'modification' },
    { date: '2024-04-10 11:20', action: 'Demande maintenance', details: 'Fuite salle de bain signalée', type: 'maintenance' }
  ],
  documents: [
    { nom: 'Contrat_location_2024.pdf', type: 'Contrat', date: '2024-01-15', taille: '2.4 MB' },
    { nom: 'ID_verso_recto.jpg', type: 'Identité', date: '2024-01-15', taille: '1.8 MB' },
    { nom: 'Justificatif_domicile.pdf', type: 'Justificatif', date: '2024-01-15', taille: '0.5 MB' }
  ]
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');
  const [user, setUser] = useState(userData);

  const handleStatusChange = (newStatus: string) => {
    setUser({ ...user, status: newStatus });
  };

  const tabs = [
    { id: 'informations', label: 'Informations', icon: FileText },
    { id: 'activite', label: 'Activité', icon: History },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/utilisateurs" 
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.prenom} {user.nom}
            </h1>
            <p className="text-gray-400 text-sm">ID: {params.id} • {user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleStatusChange(user.status === 'actif' ? 'inactif' : 'actif')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              user.status === 'actif' 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            <Power size={18} />
            {user.status === 'actif' ? 'Désactiver le compte' : 'Activer le compte'}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition-all"
          >
            {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            {isEditing ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        user.status === 'actif' 
          ? 'bg-emerald-500/10 border-emerald-500/20' 
          : 'bg-red-500/10 border-red-500/20'
      }`}>
        <div className="flex items-center gap-3">
          {user.status === 'actif' ? (
            <CheckCircle2 className="text-emerald-400" size={24} />
          ) : (
            <XCircle className="text-red-400" size={24} />
          )}
          <div>
            <p className={`font-semibold ${user.status === 'actif' ? 'text-emerald-400' : 'text-red-400'}`}>
              Compte {user.status === 'actif' ? 'actif' : 'inactif'}
            </p>
            <p className="text-sm text-gray-400">
              Dernière connexion: {user.derniereConnexion}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Changer le statut:</span>
          <select 
            value={user.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
            <option value="banni">Banni</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Carte Profil */}
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.prenom} {user.nom}</h2>
            <p className="text-gray-400 capitalize mb-4">{user.role.replace('_', ' ')}</p>
            <div className="flex justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.verified 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {user.verified ? '✓ Vérifié' : 'En attente de validation'}
              </span>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Coordonnées</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-indigo-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-indigo-400" />
                <span>{user.telephone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-indigo-400" />
                <span>{user.adresse}, {user.codePostal} {user.ville}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar size={18} className="text-indigo-400" />
                <span>Inscrit le {new Date(user.dateInscription).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Stats Rapides */}
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <Building2 className="mx-auto mb-2 text-emerald-400" size={24} />
                <p className="text-2xl font-bold text-white">{user.biensCount}</p>
                <p className="text-xs text-gray-500">Biens</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <Shield className="mx-auto mb-2 text-blue-400" size={24} />
                <p className="text-2xl font-bold text-white">{user.locatairesCount}</p>
                <p className="text-xs text-gray-500">Locataires</p>
              </div>
            </div>
          </div>

          {/* Abonnement */}
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Abonnement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium">
                  {user.abonnement.plan.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Prix</span>
                <span className="text-white font-semibold">{user.abonnement.prix}€/mois</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Facturation</span>
                <span className="text-gray-300 capitalize">{user.abonnement.facturation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Expire le</span>
                <span className="text-gray-300">{new Date(user.abonnement.dateFin).toLocaleDateString('fr-FR')}</span>
              </div>
              <button className="w-full mt-4 py-2 border border-indigo-500 text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors text-sm font-medium">
                Modifier l'abonnement
              </button>
            </div>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex border-b border-gray-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === 'informations' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Prénom</label>
                      <input 
                        type="text" 
                        defaultValue={user.prenom}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom</label>
                      <input 
                        type="text" 
                        defaultValue={user.nom}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
                      <input 
                        type="tel" 
                        defaultValue={user.telephone}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Adresse</label>
                      <input 
                        type="text" 
                        defaultValue={user.adresse}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Code postal</label>
                      <input 
                        type="text" 
                        defaultValue={user.codePostal}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Ville</label>
                      <input 
                        type="text" 
                        defaultValue={user.ville}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Préférences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800 text-indigo-600" />
                        <span className="text-gray-300">Recevoir les notifications par email</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800 text-indigo-600" />
                        <span className="text-gray-300">Recevoir les alertes de paiement</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-700 bg-gray-800 text-indigo-600" />
                        <span className="text-gray-300">Mode maintenance activé</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activite' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Historique d'activité</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
                    <div className="space-y-6">
                      {user.activite.map((act, idx) => (
                        <div key={idx} className="relative pl-10">
                          <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-[#1E293B] ${
                            act.type === 'connexion' ? 'bg-blue-500' :
                            act.type === 'creation' ? 'bg-emerald-500' :
                            act.type === 'financier' ? 'bg-amber-500' :
                            act.type === 'maintenance' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`} />
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-white">{act.action}</h4>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} />
                                {act.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{act.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Documents</h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                      + Ajouter un document
                    </button>
                  </div>
                  <div className="space-y-3">
                    {user.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <FileText className="text-red-400" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-white">{doc.nom}</p>
                            <p className="text-sm text-gray-500">{doc.type} • {doc.taille}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white">
                            Télécharger
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400">
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Messages</h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                      + Nouveau message
                    </button>
                  </div>
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aucun message échangé avec cet utilisateur</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}