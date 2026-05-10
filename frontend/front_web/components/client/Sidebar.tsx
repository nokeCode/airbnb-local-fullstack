'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Bell,
  Clock,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { getCurrentUser } from '@/services/usersService';

const menuItems = [
  { icon: Search, label: 'Rechercher', href: '/client', active: true, badge: null },
  { icon: Heart, label: 'Favoris', href: '/client/favoris', badge: 12 },
  { icon: MessageSquare, label: 'Messages', href: '/client/messages', badge: 3 },
  { icon: Calendar, label: 'Visites', href: '/client/visites', badge: 2 },
  { icon: FileText, label: 'Dossier', href: '/client/dossier', badge: null },
  { icon: Clock, label: 'Alertes', href: '/client/alertes', badge: null },
];

const recentSearches = [
  'Appartement Paris 11e',
  'Studio Lyon Part-Dieu',
  'Maison + jardin Nantes',
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [userName, setUserName] = useState<string>('Utilisateur');
  const [userInitial, setUserInitial] = useState<string>('U');

  useEffect(() => {
    // Charge le profil connectÃ© pour afficher le nom dans le sidebar.
    let mounted = true;
    getCurrentUser()
      .then((user: any) => {
        if (!mounted) return;
        const first = (user.first_name || user.prenom || '').toString().trim();
        const last = (user.last_name || user.nom || '').toString().trim();
        const email = (user.email || '').toString().trim();
        const display = [first, last].filter(Boolean).join(' ') || email || 'Utilisateur';
        setUserName(display);
        setUserInitial((display.charAt(0) || 'U').toUpperCase());
      })
      .catch(() => {
        if (!mounted) return;
        setUserName('Utilisateur');
        setUserInitial('U');
      });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
      {/* Sidebar Container */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >        {/* Profil connecté (en haut) */}
        <div className={`border-b border-gray-100 ${isOpen ? 'px-6 py-4' : 'px-3 py-4'}`}>
          <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
              {userInitial}
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500">Connecté</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - PositionnÃ© en haut Ã  droite du sidebar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors z-50 border-2 border-white"
          title={isOpen ? "RÃ©duire" : "Ãtendre"}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Logo */}
        <div className={`p-6 border-b border-gray-100 ${!isOpen && 'p-4'}`}>
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-all ${
              isOpen ? 'w-10 h-10' : 'w-12 h-12'
            }`}>
              <Home className="text-white" size={isOpen ? 20 : 24} />
            </div>
            {isOpen && (
              <div className="animate-fadeIn">
                <span className="font-bold text-gray-900 text-lg">ImmoSearch</span>
                <p className="text-xs text-gray-500">Espace locataire</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className={`flex-1 overflow-y-auto ${isOpen ? 'px-4 py-6' : 'px-3 py-6'}`}>
          <nav className="space-y-1 mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all relative group ${
                  item.active 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'}`}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon size={20} />
                {isOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {/* Tooltip quand sidebar est fermÃ© */}
                {!isOpen && item.badge && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Recherches rÃ©centes - cachÃ© quand fermÃ© */}
          {isOpen && (
            <div className="mb-8 animate-fadeIn">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
                Recherches rÃ©centes
              </p>
              <div className="space-y-1">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  >
                    <Clock size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mon dossier locatif - version compacte quand fermÃ© */}
          <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 ${isOpen ? 'p-4' : 'p-3'}`}>
            <div className={`flex items-center gap-3 mb-3 ${!isOpen && 'justify-center mb-2'}`}>
              <div className={`bg-white rounded-xl flex items-center justify-center shadow-sm ${isOpen ? 'w-10 h-10' : 'w-10 h-10'}`}>
                <FileText className="text-indigo-600" size={20} />
              </div>
              {isOpen && (
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Mon dossier</p>
                  <p className="text-xs text-gray-500">80% complet</p>
                </div>
              )}
            </div>
            {isOpen && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }} />
                </div>
                <button className="w-full py-2 bg-white text-indigo-600 text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all">
                  ComplÃ©ter
                </button>
              </>
            )}
            {!isOpen && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '80%' }} />
              </div>
            )}
          </div>
        </div>

        {/* Profil */}
        <div className={`p-4 border-t border-gray-200 ${!isOpen && 'p-3'}`}>
          <div className={`flex items-center gap-3 ${!isOpen && 'flex-col gap-2'}`}>
            <div className={`bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 ${
              isOpen ? 'w-10 h-10' : 'w-10 h-10'
            }`}>
              <span className={`text-white font-bold ${isOpen ? 'text-sm' : 'text-xs'}`}>SM</span>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Sophie Martin</p>
                <p className="text-xs text-gray-500 truncate">Cherche un studio</p>
              </div>
            )}
            <button className={`p-2 text-gray-400 hover:bg-gray-100 rounded-lg ${!isOpen && 'p-1.5'}`}>
              <Bell size={isOpen ? 18 : 16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile si nÃ©cessaire (optionnel) */}
    </>
  );
}

