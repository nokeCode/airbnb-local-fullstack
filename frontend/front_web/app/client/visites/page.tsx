'use client';

import { Calendar, Clock, MapPin, Video, X, Check, AlertCircle, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const visits = [
  {
    id: 1,
    property: 'Studio moderne avec balcon',
    address: 'Rue de la Roquette, Paris 11e',
    date: '2024-03-20',
    time: '14:00',
    type: 'physique',
    status: 'confirmed',
    owner: 'M. Dubois',
    image: '/api/placeholder/200/150',
    notes: 'Apporter carte d\'identité',
  },
  {
    id: 2,
    property: 'T2 lumineux rénové',
    address: 'Avenue Jean Jaurès, Lyon 7e',
    date: '2024-03-22',
    time: '10:30',
    type: 'visio',
    status: 'pending',
    owner: 'Agence Centrale',
    image: '/api/placeholder/200/150',
    link: 'https://meet.example.com/abc123',
  },
  {
    id: 3,
    property: 'Loft industriel',
    address: 'Quai de la Loire, Paris 19e',
    date: '2024-03-15',
    time: '16:00',
    type: 'physique',
    status: 'completed',
    owner: 'Mme Laurent',
    image: '/api/placeholder/200/150',
    feedback: 'Très bien, mais un peu bruyant',
  },
];

const upcomingVisits = visits.filter(v => v.status !== 'completed');
const pastVisits = visits.filter(v => v.status === 'completed');

export default function VisitesPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes visites</h1>
          <p className="text-gray-500">Gérez vos rendez-vous de visite</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
            <Calendar size={18} />
            Demander une visite
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          À venir ({upcomingVisits.length})
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'past' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Passées ({pastVisits.length})
        </button>
      </div>

      {/* Visits list */}
      <div className="space-y-4">
        {(activeTab === 'upcoming' ? upcomingVisits : pastVisits).map((visit) => (
          <div key={visit.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-6">
              {/* Image */}
              <div className="w-40 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={visit.image} alt={visit.property} className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        visit.type === 'physique' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {visit.type === 'physique' ? 'Visite physique' : 'Visio'}
                      </span>
                      {visit.status === 'pending' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                          En attente
                        </span>
                      )}
                      {visit.status === 'confirmed' && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                          Confirmée
                        </span>
                      )}
                      {visit.status === 'completed' && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
                          Terminée
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{visit.property}</h3>
                    <p className="text-gray-500 flex items-center gap-1 text-sm">
                      <MapPin size={14} />
                      {visit.address}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                      <Calendar size={18} />
                      {new Date(visit.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 justify-end">
                      <Clock size={14} />
                      {visit.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>Avec : <strong>{visit.owner}</strong></span>
                  {visit.notes && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircle size={14} />
                      {visit.notes}
                    </span>
                  )}
                  {visit.feedback && (
                    <span className="text-gray-500 italic">"{visit.feedback}"</span>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  {visit.status === 'confirmed' && (
                    <>
                      {visit.type === 'visio' ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                          <Video size={18} />
                          Rejoindre la visio
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                          <MapPin size={18} />
                          Voir l'itinéraire
                        </button>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                        <MessageSquare size={18} />
                        Contacter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors ml-auto">
                        <X size={18} />
                        Annuler
                      </button>
                    </>
                  )}
                  {visit.status === 'pending' && (
                    <>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                        <Clock size={18} />
                        En attente de confirmation
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors ml-auto">
                        Annuler la demande
                      </button>
                    </>
                  )}
                  {visit.status === 'completed' && (
                    <>
                      <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                        <FileText size={18} />
                        Faire une offre
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                        <MessageSquare size={18} />
                        Envoyer un message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {upcomingVisits.length === 0 && activeTab === 'upcoming' && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune visite planifiée</h3>
          <p className="text-gray-500 mb-4">Demandez une visite pour commencer</p>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
            Trouver un bien
          </button>
        </div>
      )}
    </div>
  );
}