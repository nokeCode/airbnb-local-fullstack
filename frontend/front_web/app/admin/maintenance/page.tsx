'use client';

import { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Plus,
  MessageSquare,
  ArrowRight,
  Euro
} from 'lucide-react';

const fallbackInterventions = [
  {
    id: 'INT-001',
    titre: "Fuite d'eau salle de bain",
    bien: 'Appartement 12 - Résidence du Parc',
    adresse: '15 Avenue des Champs-Élysées, Paris 8e',
    urgence: 'critique',
    statut: 'en_cours',
    dateCreation: '2024-04-20',
    dateIntervention: '2024-04-21',
    proprietaire: 'Marie Martin',
    locataire: 'Jean Dupont',
    cout: 450,
    artisan: 'Plombier Pro Paris',
    description: 'Fuite importante sous le lavabo, nécessite intervention urgente'
  },
  {
    id: 'INT-002',
    titre: 'Chaudière à réviser',
    bien: 'Villa Bellevue',
    adresse: '42 Rue de la Paix, Nice',
    urgence: 'moyenne',
    statut: 'planifie',
    dateCreation: '2024-04-18',
    dateIntervention: '2024-05-05',
    proprietaire: 'Pierre Moreau',
    locataire: 'Sophie Bernard',
    cout: 180,
    artisan: 'Chauffage Service Nice',
    description: 'Entretien annuel obligatoire'
  },
  {
    id: 'INT-003',
    titre: 'Peinture salon à refaire',
    bien: 'Studio Centre-ville',
    adresse: '8 Rue du Commerce, Lyon 2e',
    urgence: 'basse',
    statut: 'en_attente',
    dateCreation: '2024-04-15',
    dateIntervention: null,
    proprietaire: 'Marie Martin',
    locataire: null,
    cout: 800,
    artisan: null,
    description: "Murs abîmés par l'ancien locataire, à faire avant relocation"
  },
  {
    id: 'INT-004',
    titre: 'Serrure bloquée',
    bien: 'Loft Industriel',
    adresse: '23 Quai de la Seine, Paris 19e',
    urgence: 'haute',
    statut: 'termine',
    dateCreation: '2024-04-19',
    dateIntervention: '2024-04-19',
    proprietaire: 'Lucas Petit',
    locataire: 'Emma Garcia',
    cout: 120,
    artisan: 'Serrurerie Rapide 75',
    description: "Locataire bloqué à l'extérieur, intervention urgente"
  }
];

const urgenceConfig = {
  critique: { label: 'Critique', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: AlertTriangle },
  haute: { label: 'Haute', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: AlertTriangle },
  moyenne: { label: 'Moyenne', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
  basse: { label: 'Basse', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle2 }
};

const statutConfig = {
  en_attente: { label: 'En attente', color: 'text-gray-400' },
  planifie: { label: 'Planifié', color: 'text-blue-400' },
  en_cours: { label: 'En cours', color: 'text-amber-400' },
  termine: { label: 'Terminé', color: 'text-emerald-400' }
};

export default function MaintenancePage() {
  const [filterUrgence, setFilterUrgence] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');

  const interventionsData = fallbackInterventions;

  const filteredInterventions = interventionsData.filter(i => {
    const matchUrgence = filterUrgence === 'tous' || i.urgence === filterUrgence;
    const matchStatut = filterStatut === 'tous' || i.statut === filterStatut;
    return matchUrgence && matchStatut;
  });

  const stats = {
    enAttente: interventionsData.filter(i => i.statut === 'en_attente').length,
    enCours: interventionsData.filter(i => i.statut === 'en_cours').length,
    critiques: interventionsData.filter(i => i.urgence === 'critique').length,
    coutTotal: interventionsData.reduce((acc, i) => acc + i.cout, 0)
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Maintenance & Interventions</h1>
          <p className="text-gray-400">Suivi des réparations et travaux</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl">
          <Plus size={18} />
          Nouvelle intervention
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">En attente</p>
          <p className="text-2xl text-white">{stats.enAttente}</p>
        </div>
        <div className="bg-[#1E293B] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">En cours</p>
          <p className="text-2xl text-white">{stats.enCours}</p>
        </div>
        <div className="bg-[#1E293B] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">Urgences</p>
          <p className="text-2xl text-white">{stats.critiques}</p>
        </div>
        <div className="bg-[#1E293B] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">Coût total</p>
          <p className="text-2xl text-white">{stats.coutTotal}€</p>
        </div>
      </div>

      {/* Interventions */}
      <div className="space-y-4">
        {filteredInterventions.map((intervention) => {
          const UrgenceIcon = urgenceConfig[intervention.urgence].icon;

          return (
            <div key={intervention.id} className="bg-[#1E293B] p-6 rounded-2xl">
              
              <h3 className="text-white font-semibold mb-2">{intervention.titre}</h3>

              <p className="text-gray-400 text-sm mb-2">{intervention.description}</p>

              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {intervention.adresse}
                </span>
                <span>
                  Créé le {new Date(intervention.dateCreation).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <p className="text-white font-bold">{intervention.cout}€</p>

            </div>
          );
        })}
      </div>

    </div>
  );
}