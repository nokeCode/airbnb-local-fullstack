'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Check,
  Trash2,
  UserPlus,
  AlertTriangle,
  CreditCard,
  Building2,
  MessageSquare,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Notification, NotificationType } from '@/types/notification';
import {
  deleteAdminNotification,
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead
} from '@/services/adminService';

const getIcon = (categorie: string) => {
  switch (categorie) {
    case 'utilisateur': return UserPlus;
    case 'financier': return CreditCard;
    case 'maintenance': return Building2;
    case 'securite': return AlertTriangle;
    case 'systeme': return Settings;
    default: return MessageSquare;
  }
};

const getColor = (type: NotificationType) => {
  switch (type) {
    case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'success': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'system': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  }
};

export function NotificationCenter({
  onClose,
  onUnreadChange,
}: {
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}) {
  const [filter, setFilter] = useState<string>('tous');
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () =>
    getAdminNotifications()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const normalized = list.map((n) => ({
          ...n,
          dateCreation: n.dateCreation ? new Date(n.dateCreation as any) : new Date(),
        }));
        setNotifs(normalized);
      })
      .catch(() => {
        setNotifs([]);
      })
      .finally(() => {
        setLoading(false);
      });

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    markAdminNotificationRead(id).catch(() => null);
  };

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
    markAllAdminNotificationsRead().catch(() => null);
  };

  const deleteNotification = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
    deleteAdminNotification(id).catch(() => null);
  };

  const filteredNotifs = filter === 'tous'
    ? notifs
    : notifs.filter(n => n.categorie === filter || (filter === 'non_lus' && !n.lu));

  const nonLusCount = notifs.filter(n => !n.lu).length;

  useEffect(() => {
    const load = () => fetchNotifs();
    load();
    const interval = setInterval(load, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // WebSocket admin notifications (optionnel).
    const wsUrl = process.env.NEXT_PUBLIC_ADMIN_WS_URL || '';
    if (!wsUrl) return;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = () => {
        fetchNotifs();
      };
    } catch {
      // ignore
    }
    return () => {
      ws?.close();
    };
  }, []);

  useEffect(() => {
    if (onUnreadChange) onUnreadChange(nonLusCount);
  }, [nonLusCount, onUnreadChange]);

  return (
    <div className="absolute right-0 top-full mt-4 w-[480px] bg-[#1E293B] border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-white">Notifications</h3>
          {nonLusCount > 0 && (
            <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {nonLusCount} nouvelles
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Tout marquer comme lu"
          >
            <CheckCircle2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-800 overflow-x-auto">
        {['tous', 'non_lus', 'utilisateur', 'financier', 'maintenance', 'systeme'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f === 'tous' ? 'Toutes' :
             f === 'non_lus' ? 'Non lues' :
             f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle2 size={48} className="mx-auto mb-3 opacity-50" />
            <p>Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredNotifs.map((notif) => {
              const Icon = getIcon(notif.categorie);
              return (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-800/50 transition-colors ${!notif.lu ? 'bg-indigo-500/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl border ${getColor(notif.type)} h-fit`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold ${!notif.lu ? 'text-white' : 'text-gray-300'}`}>
                          {notif.titre}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(notif.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{notif.message}</p>

                      {notif.action && (
                        <button className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300">
                          {notif.action.label}
                        </button>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        {!notif.lu && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                          >
                            <Check size={12} />
                            Marquer comme lu
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors ml-auto"
                        >
                          <Trash2 size={12} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 bg-[#0F172A]">
        <button className="w-full py-2 text-sm text-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
}
