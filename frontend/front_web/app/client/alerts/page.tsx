'use client';

import { Bell, Plus, Trash2, Edit3, MapPin, Home, Euro, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

const alerts = [
  {
    id: 1,
    name: 'Studio Paris 11e',
    criteria: {
      location: 'Paris 11e, 20e',
      type: ['Studio', 'T1'],
      priceMin: 600,
      priceMax: 900,
      surfaceMin: 20,
    },
    frequency: 'instant',
    active: true,
    createdAt: '2024-03-01',
    matches: 12,
  },
  {
    id: 2,
    name: 'Lyon centre',
    criteria: {
      location: 'Lyon 1er, 2e, 6e, 7e',
      type: ['T2', 'T3'],
      priceMin: 700,
      priceMax: 1200,
      surfaceMin: 40,
    },
    frequency: 'daily',
    active: true,
    createdAt: '2024-02-15',
    matches: 5,
  },
  {
    id: 3,
    name: 'Maison Nantes',
    criteria: {
      location: 'Nantes et alentours',
      type: ['Maison'],
      priceMin: 1000,
      priceMax: 1500,
      surfaceMin: 80,
    },
    frequency: 'weekly',
    active: false,
    createdAt: '2024-01-20',
    matches: 0,
  },
];

export default function AlertesPage() {
  const [alertsList, setAlertsList] = useState(alerts);

  const toggleAlert = (id: number) => {
    setAlertsList(alertsList.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: number) => {
    setAlertsList(alertsList.filter(a => a.id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes alertes</h1>
          <p className="text-gray-500">Soyez notifié des nouveaux biens correspondant à vos critères</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
          <Plus size={20} />
          Créer une alerte
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
            <Bell className="text-emerald-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{alertsList.length}</p>
          <p className="text-gray-500">Alertes créées</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Mail className="text-blue-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">28</p>
          <p className="text-gray-500">Notifications ce mois</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Home className="text-purple-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">17</p>
          <p className="text-gray-500">Biens correspondants</p>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        {alertsList.map((alert) => (
          <div key={alert.id} className={`bg-white rounded-2xl border p-6 transition-all ${alert.active ? 'border-gray-100' : 'border-gray-200 opacity-75'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{alert.name}</h3>
                  <p className="text-sm text-gray-500">Créée le {new Date(alert.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleAlert(alert.id)}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {alert.active ? <ToggleRight size={24} className="text-emerald-600" /> : <ToggleLeft size={24} />}
                </button>
                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit3 size={20} />
                </button>
                <button 
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                <MapPin size={14} />
                {alert.criteria.location}
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                <Home size={14} />
                {alert.criteria.type.join(', ')}
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                <Euro size={14} />
                {alert.criteria.priceMin}€ - {alert.criteria.priceMax}€
              </span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                {alert.criteria.surfaceMin}m² min
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.frequency === 'instant' ? 'bg-red-100 text-red-800' :
                  alert.frequency === 'daily' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {alert.frequency === 'instant' ? '⚡ Instantané' :
                   alert.frequency === 'daily' ? '📅 Quotidien' :
                   '📆 Hebdomadaire'}
                </span>
                {alert.matches > 0 && (
                  <span className="text-sm text-emerald-600 font-medium">
                    {alert.matches} nouveau{alert.matches > 1 ? 'x' : ''} bien{alert.matches > 1 ? 's' : ''} cette semaine
                  </span>
                )}
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Voir les résultats →
              </button>
            </div>
          </div>
        ))}
      </div>

      {alertsList.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune alerte</h3>
          <p className="text-gray-500 mb-4">Créez votre première alerte pour ne rien manquer</p>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
            Créer une alerte
          </button>
        </div>
      )}
    </div>
  );
}