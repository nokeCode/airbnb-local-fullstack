'use client';

import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Mail, 
  CreditCard, 
  Bell, 
  Globe, 
  Database,
  Save,
  CheckCircle2,
  AlertTriangle,
  Key,
  Users,
  FileText
} from 'lucide-react';

const settingsSections = [
  { id: 'general', label: 'Général', icon: Settings },
  { id: 'securite', label: 'Sécurité', icon: Shield },
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API & Intégrations', icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Paramètres système</h1>
          <p className="text-gray-400">Configuration de la plateforme ImmoGestion</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
        >
          <Save size={18} />
          {saved ? 'Enregistré !' : 'Enregistrer les modifications'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-4 space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Paramètres généraux</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nom de la plateforme</label>
                    <input 
                      type="text" 
                      defaultValue="ImmoGestion"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">URL du site</label>
                    <input 
                      type="url" 
                      defaultValue="https://immogestion.fr"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email de contact</label>
                    <input 
                      type="email" 
                      defaultValue="contact@immogestion.fr"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Téléphone support</label>
                    <input 
                      type="tel" 
                      defaultValue="01 23 45 67 89"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Localisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Langue par défaut</label>
                      <select className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Devise</label>
                      <select className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar ($)</option>
                        <option value="GBP">Livre (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'securite' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Sécurité</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Shield className="text-emerald-400" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Authentification à deux facteurs (2FA)</p>
                        <p className="text-sm text-gray-500">Obligatoire pour tous les admins</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-lg">
                        <Key className="text-amber-400" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Politique de mot de passe</p>
                        <p className="text-sm text-gray-500">Min. 12 caractères, majuscules, chiffres</p>
                      </div>
                    </div>
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                      Configurer
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="text-red-400" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Blocage automatique</p>
                        <p className="text-sm text-gray-500">Après 5 tentatives échouées</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Sessions actives</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <Globe className="text-gray-500" size={20} />
                        <div>
                          <p className="text-white font-medium">Chrome - Windows</p>
                          <p className="text-sm text-gray-500">Paris, France • IP: 192.168.1.1</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Actuelle</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <Globe className="text-gray-500" size={20} />
                        <div>
                          <p className="text-white font-medium">Safari - iPhone</p>
                          <p className="text-sm text-gray-500">Lyon, France • IP: 192.168.2.1</p>
                        </div>
                      </div>
                      <button className="text-red-400 hover:text-red-300 text-sm">
                        Déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'emails' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Configuration emails</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Serveur SMTP</label>
                    <input 
                      type="text" 
                      defaultValue="smtp.immogestion.fr"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Port</label>
                    <input 
                      type="number" 
                      defaultValue="587"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Utilisateur SMTP</label>
                    <input 
                      type="text" 
                      defaultValue="noreply@immogestion.fr"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Mot de passe SMTP</label>
                    <input 
                      type="password" 
                      defaultValue="••••••••••••"
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Templates d'emails</h3>
                  <div className="space-y-3">
                    {['Bienvenue nouvel utilisateur', 'Confirmation de paiement', 'Rappel loyer', 'Alerte maintenance'].map((template) => (
                      <div key={template} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText className="text-gray-500" size={20} />
                          <span className="text-white">{template}</span>
                        </div>
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                          Éditer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'paiements' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Configuration des paiements</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <CreditCard className="text-blue-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Stripe</p>
                          <p className="text-sm text-gray-500">Cartes bancaires & prélèvements</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <input 
                        type="text" 
                        placeholder="Clé API publique"
                        defaultValue="pk_live_••••••••••••••••"
                        className="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white"
                      />
                      <input 
                        type="password" 
                        placeholder="Clé API secrète"
                        defaultValue="••••••••••••"
                        className="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg">
                          <Database className="text-indigo-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">PayPal</p>
                          <p className="text-sm text-gray-500">Paiements internationaux</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Préférences de notifications</h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'Nouvelle inscription utilisateur', desc: 'Recevoir une alerte pour chaque nouvel utilisateur', checked: true },
                    { label: 'Nouveau paiement reçu', desc: 'Notification pour chaque transaction complétée', checked: true },
                    { label: 'Demande de maintenance', desc: 'Alerte pour les interventions urgentes', checked: true },
                    { label: 'Échec de paiement', desc: 'Notification des paiements échoués', checked: true },
                    { label: 'Tentative de connexion suspecte', desc: 'Alerte sécurité pour connexions anormales', checked: false },
                    { label: 'Rapport hebdomadaire', desc: 'Résumé des activités chaque lundi', checked: true },
                  ].map((notif, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div>
                        <p className="font-medium text-white">{notif.label}</p>
                        <p className="text-sm text-gray-500">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.checked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">API & Intégrations</h2>
                
                <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-white">Clés API</h3>
                      <p className="text-sm text-gray-500">Gérez les accès à l'API ImmoGestion</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                      + Nouvelle clé
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
                      <div>
                        <p className="font-medium text-white">Production - Application Mobile</p>
                        <p className="text-sm text-gray-500 font-mono mt-1">imm_live_••••••••••••••••</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Active</span>
                        <button className="text-gray-400 hover:text-white">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
                      <div>
                        <p className="font-medium text-white">Test - Développement</p>
                        <p className="text-sm text-gray-500 font-mono mt-1">imm_test_••••••••••••••••</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Active</span>
                        <button className="text-gray-400 hover:text-white">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Webhooks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div>
                        <p className="font-medium text-white">Paiement complété</p>
                        <p className="text-sm text-gray-500">https://api.immogestion.fr/webhooks/payment</p>
                      </div>
                      <span className="text-xs text-emerald-400">200 OK</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}