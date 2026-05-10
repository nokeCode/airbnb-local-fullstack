'use client';

import { useState } from 'react';
import { 
  Search, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  Globe,
  Terminal
} from 'lucide-react';

const fallbackLogs = [
  {
    id: '1',
    timestamp: '2024-04-21 14:32:15',
    niveau: 'info',
    categorie: 'auth',
    message: 'Connexion réussie',
    utilisateur: 'admin@immogestion.fr',
    ip: '192.168.1.100',
    userAgent: 'Chrome 124 / Windows 11',
    details: 'Authentification à deux facteurs validée'
  },
  {
    id: '2',
    timestamp: '2024-04-21 14:30:00',
    niveau: 'warning',
    categorie: 'auth',
    message: 'Tentative de connexion échouée',
    utilisateur: 'unknown',
    ip: '45.123.45.67',
    userAgent: 'Firefox 125 / Linux',
    details: 'Mot de passe incorrect (3ème tentative)'
  },
  {
    id: '3',
    timestamp: '2024-04-21 13:15:22',
    niveau: 'error',
    categorie: 'database',
    message: 'Erreur connexion base de données',
    utilisateur: 'system',
    ip: 'internal',
    userAgent: 'Node.js/18',
    details: 'Timeout après 30s - Pool de connexions saturé'
  },
  {
    id: '4',
    timestamp: '2024-04-21 12:00:00',
    niveau: 'info',
    categorie: 'user',
    message: 'Utilisateur créé',
    utilisateur: 'marie.martin@email.com',
    ip: '192.168.1.105',
    userAgent: 'Safari / iOS 17',
    details: 'Nouveau compte propriétaire créé via invitation'
  },
  {
    id: '5',
    timestamp: '2024-04-21 10:45:30',
    niveau: 'success',
    categorie: 'payment',
    message: 'Paiement traité',
    utilisateur: 'pierre.moreau@capital.com',
    ip: '192.168.1.110',
    userAgent: 'Chrome 124 / macOS',
    details: 'Abonnement Enterprise renouvelé - 999.99€'
  }
];

const niveauConfig = {
  info: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle2 },
  warning: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: AlertTriangle },
  error: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
  success: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 }
};

export default function LogsPage() {
  const [logsData, setLogsData] = useState(fallbackLogs);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Logs & Sécurité</h1>
          <p className="text-gray-400">Journal d'activité et événements système</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl">
          <Terminal size={18} />
          Console temps réel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white"
            />
          </div>

          <div className="flex gap-3">
            <select className="px-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white">
              <option value="tous">Tous niveaux</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>

            <select className="px-4 py-3 bg-[#0F172A] border border-gray-700 rounded-xl text-white">
              <option value="tous">Toutes catégories</option>
              <option value="auth">Authentification</option>
              <option value="user">Utilisateurs</option>
              <option value="payment">Paiements</option>
              <option value="database">Base de données</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">

          <thead className="bg-[#0F172A]">
            <tr>
              <th className="p-4 text-left">Timestamp</th>
              <th>Niveau</th>
              <th>Message</th>
              <th>Utilisateur</th>
              <th>Source</th>
            </tr>
          </thead>

          <tbody>
            {logsData.map((log) => {
              const NiveauIcon = niveauConfig[log.niveau].icon;

              return (
                <tr key={log.id} className="border-t border-gray-800">
                  
                  <td className="p-4 text-gray-400 font-mono">{log.timestamp}</td>

                  <td>
                    <span className={`px-2 py-1 text-xs border rounded ${niveauConfig[log.niveau].color}`}>
                      <NiveauIcon size={12} />
                      {log.niveau.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <p className="text-white">{log.message}</p>
                    <p className="text-gray-500 text-sm">{log.details}</p>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      {log.utilisateur}
                    </div>
                  </td>

                  <td className="text-gray-400 text-sm">
                    <p className="flex items-center gap-1">
                      <Globe size={12} />
                      {log.ip}
                    </p>
                    <p className="text-xs text-gray-600">{log.userAgent}</p>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}