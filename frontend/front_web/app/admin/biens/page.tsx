'use client';

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Download,
  Grid3X3,
  List
} from 'lucide-react';

const fallbackBiens = [
  {
    id: '1',
    titre: 'Appartement T3 - Résidence du Parc',
    adresse: '15 Avenue des Champs-Élysées, Paris 8e',
    type: 'Appartement',
    surface: 65,
    pieces: 3,
    loyer: 850,
    statut: 'loué',
    proprietaire: 'Marie Martin',
    locataire: 'Jean Dupont',
    dateAjout: '2024-01-15',
    image: '/api/placeholder/400/300'
  },
  {
    id: '2',
    titre: 'Villa Bellevue',
    adresse: '42 Rue de la Paix, Nice',
    type: 'Maison',
    surface: 120,
    pieces: 5,
    loyer: 1200,
    statut: 'loué',
    proprietaire: 'Pierre Moreau',
    locataire: 'Sophie Bernard',
    dateAjout: '2024-02-20',
    image: '/api/placeholder/400/300'
  },
  {
    id: '3',
    titre: 'Studio Centre-ville',
    adresse: '8 Rue du Commerce, Lyon 2e',
    type: 'Studio',
    surface: 25,
    pieces: 1,
    loyer: 450,
    statut: 'vacant',
    proprietaire: 'Marie Martin',
    locataire: null,
    dateAjout: '2024-03-10',
    image: '/api/placeholder/400/300'
  },
  {
    id: '4',
    titre: 'Loft Industriel',
    adresse: '23 Quai de la Seine, Paris 19e',
    type: 'Loft',
    surface: 85,
    pieces: 2,
    loyer: 1100,
    statut: 'travaux',
    proprietaire: 'Lucas Petit',
    locataire: null,
    dateAjout: '2024-04-05',
    image: '/api/placeholder/400/300'
  }
];

const statutConfig = {
  loué: { label: 'Loué', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
  vacant: { label: 'Vacant', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: XCircle },
  travaux: { label: 'En travaux', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Clock }
};

export default function BiensManagement() {
  const [viewMode, setViewMode] = useState('list');
  const [filterStatut, setFilterStatut] = useState('tous');

  const biensData = fallbackBiens;

  const filteredBiens = filterStatut === 'tous' 
    ? biensData 
    : biensData.filter(b => b.statut === filterStatut);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gestion des biens immobiliers</h1>
          <p className="text-gray-400">{biensData.length} biens sur la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl">
            <Download size={18} />
            Exporter
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl">
            <Plus size={18} />
            Ajouter un bien
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher un bien, adresse, propriétaire..."
              className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white"
            >
              <option value="tous">Tous les statuts</option>
              <option value="loué">Loués</option>
              <option value="vacant">Vacants</option>
              <option value="travaux">En travaux</option>
            </select>

            <div className="flex bg-gray-800 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className="p-2">
                <Grid3X3 size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className="p-2">
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBiens.map((bien) => {
            const cfg =
              statutConfig[bien.statut as keyof typeof statutConfig] ??
              statutConfig.vacant;
            const StatutIcon = cfg.icon;
            return (
              <div key={bien.id} className="bg-[#1E293B] border rounded-2xl overflow-hidden">
                
                <div className="relative h-48">
                  <img src={bien.image} alt={bien.titre} className="w-full h-full object-cover" />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white">{bien.titre}</h3>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {bien.adresse}
                  </p>

                  <div className="flex justify-between mt-2">
                    <span className="text-emerald-400 font-bold">{bien.loyer}€/mois</span>
                    <span className="text-gray-500 text-sm">{bien.surface}m² • {bien.pieces}p</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <table className="w-full bg-[#1E293B] rounded-2xl overflow-hidden">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="p-4 text-left">Bien</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Loyer</th>
              <th>Propriétaire</th>
              <th>Locataire</th>
              <th></th>
            </tr>
          </thead>

            <tbody>
              {filteredBiens.map((bien) => {
              const cfg =
                statutConfig[bien.statut as keyof typeof statutConfig] ??
                statutConfig.vacant;
              const StatutIcon = cfg.icon;

              return (
                <tr key={bien.id} className="border-t border-gray-800">
                  <td className="p-4">{bien.titre}</td>
                  <td>{bien.type}</td>

                  <td>
                    <span className="flex items-center gap-1">
                      <StatutIcon size={12} />
                      {cfg.label}
                    </span>
                  </td>

                  <td className="text-emerald-400">{bien.loyer}€</td>
                  <td>{bien.proprietaire}</td>
                  <td>{bien.locataire || '-'}</td>

                  <td className="flex gap-2">
                    <Eye size={16} />
                    <Edit2 size={16} />
                    <Trash2 size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
