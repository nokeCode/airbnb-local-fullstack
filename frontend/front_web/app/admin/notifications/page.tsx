'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { getAdminNotifications } from '@/services/adminService';

const fallbackNotifications = [
  {
    id: '1',
    titre: 'Nouvel utilisateur inscrit',
    message: 'Marie Martin (Propriétaire) vient de créer un compte et attend validation.',
    type: 'info',
    categorie: 'utilisateur',
    priorite: 'moyenne',
    date: new Date(Date.now() - 1000 * 60 * 5),
    lu: false,
  },
  {
    id: '2',
    titre: 'Paiement échoué',
    message: 'Le renouvellement de l\'abonnement Pro de Pierre Bernard a échoué.',
    type: 'error',
    categorie: 'financier',
    priorite: 'haute',
    date: new Date(Date.now() - 1000 * 60 * 30),
    lu: false,
  },
  {
    id: '3',
    titre: 'Demande de maintenance urgente',
    message: 'Fuite d\'eau signalée à la Résidence du Parc - Appartement 12.',
    type: 'warning',
    categorie: 'maintenance',
    priorite: 'critique',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    lu: false,
  },
  {
    id: '4',
    titre: 'Mise à jour système réussie',
    message: 'La version 2.4.0 a été déployée avec succès.',
    type: 'success',
    categorie: 'systeme',
    priorite: 'basse',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4),
    lu: true,
  },
  {
    id: '5',
    titre: 'Nouveau message support',
    message: 'Lucas Petit a envoyé une demande concernant son abonnement.',
    type: 'info',
    categorie: 'support',
    priorite: 'moyenne',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6),
    lu: true,
  }
];

export default function NotificationsPage() {
  const [notificationsData, setNotificationsData] = useState(fallbackNotifications);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    let mounted = true;
    getAdminNotifications()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        const normalized = list.map((n: any) => ({
          id: String(n.id ?? Math.random()),
          titre: n.titre || n.title || 'Notification',
          message: n.message || '',
          type: n.type || 'info',
          categorie: n.categorie || 'systeme',
          priorite: n.priorite || 'moyenne',
          date: n.dateCreation ? new Date(n.dateCreation) : new Date(),
          lu: Boolean(n.lu ?? n.read ?? false),
        }));
        setNotificationsData(normalized.length ? normalized : fallbackNotifications);
      })
      .catch(() => {
        if (!mounted) return;
        setNotificationsData(fallbackNotifications);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const markAllAsRead = () => {
    setNotificationsData(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const deleteAll = () => {
    setNotificationsData([]);
  };

  const filteredNotifications = useMemo(() => {
    if (filter === 'tous') return notificationsData;
    if (filter === 'non_lus') return notificationsData.filter(n => !n.lu);
    return notificationsData.filter(n => n.categorie === filter);
  }, [filter, notificationsData]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="text-red-400" size={24} />;
      case 'warning':
        return <AlertTriangle className="text-amber-400" size={24} />;
      case 'success':
        return <CheckCircle2 className="text-emerald-400" size={24} />;
      default:
        return <Info className="text-blue-400" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Centre de notifications</h1>
          <p className="text-gray-400">Gérez toutes vos alertes et messages système</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors"
          >
            <Check size={18} />
            Tout marquer comme lu
          </button>
          <button
            onClick={deleteAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
          >
            <Trash2 size={18} />
            Tout supprimer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'tous', label: 'Toutes', count: notificationsData.length },
            { id: 'non_lus', label: 'Non lues', count: notificationsData.filter(n => !n.lu).length },
            { id: 'utilisateur', label: 'Utilisateurs' },
            { id: 'financier', label: 'Financier' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'systeme', label: 'Système' },
            { id: 'support', label: 'Support' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {f.label}
              {f.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === f.id ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucune notification</p>
            <p className="text-sm">Vous n'avez pas de notifications dans cette catégorie</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 hover:bg-gray-800/30 transition-colors ${!notif.lu ? 'bg-indigo-500/5' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-800 rounded-xl">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold ${!notif.lu ? 'text-white' : 'text-gray-300'}`}>
                          {notif.titre}
                          {!notif.lu && <span className="ml-2 w-2 h-2 bg-indigo-500 rounded-full inline-block" />}
                        </h3>
                        <p className="text-gray-400 mt-1">{notif.message}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {notif.date.toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        notif.priorite === 'critique' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        notif.priorite === 'haute' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        notif.priorite === 'moyenne' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {notif.priorite.charAt(0).toUpperCase() + notif.priorite.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {notif.categorie}
                      </span>
                      <div className="flex-1" />
                      {!notif.lu && (
                        <button className="text-sm text-indigo-400 hover:text-indigo-300">
                          Marquer comme lu
                        </button>
                      )}
                      <button className="text-sm text-gray-500 hover:text-red-400">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
