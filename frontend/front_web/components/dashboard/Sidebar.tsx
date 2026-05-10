'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Wrench, 
  FileText, 
  MessageSquare, 
  Settings, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { getProperties, getPropertyExpenses } from '@/services/propertiesService';
import { getContracts } from '@/services/contractsService';
import { getCurrentUser } from '@/services/usersService';

type Property = {
  id: number;
  title: string;
  status?: string;
};

type Contract = {
  id: number;
  contract_type: 'rent' | 'sale' | string;
};

const menuPrincipal = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
  { icon: TrendingUp, label: 'Statistiques', href: '/dashboard/statistiques' },
  { icon: Receipt, label: 'Finances', href: '/dashboard/finances' },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [biensExpanded, setBiensExpanded] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [userName, setUserName] = useState<string>('Utilisateur');
  const [userInitial, setUserInitial] = useState<string>('U');

  useEffect(() => {
    // Charge le profil connecté pour afficher le nom dans le sidebar.
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

  useEffect(() => {
    // Charge les biens, contrats et dépenses pour alimenter le sidebar.
    let mounted = true;
    Promise.all([getProperties(), getContracts()])
      .then(async ([props, ctrs]) => {
        if (!mounted) return;
        const propertiesData = Array.isArray(props) ? props : [];
        const contractsData = Array.isArray(ctrs) ? ctrs : [];
        setProperties(propertiesData);
        setContracts(contractsData);

        // Compte simple des dépenses (maintenance) pour badge.
        const expensesEntries = await Promise.all(
          propertiesData.map(async (p: Property) => {
            try {
              const list = await getPropertyExpenses(p.id);
              return Array.isArray(list) ? list.length : 0;
            } catch {
              return 0;
            }
          })
        );
        if (mounted) setMaintenanceCount(expensesEntries.reduce((sum, n) => sum + n, 0));
      })
      .catch(() => {
        if (!mounted) return;
        setProperties([]);
        setContracts([]);
        setMaintenanceCount(0);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  // Liste dynamique des biens dans le sidebar.
  const mesBiens = useMemo(() => {
    const toStatus = (s?: string) => (s || '').toLowerCase();
    const isRented = (s: string) => ['occupied', 'rented', 'loué', 'loue'].some(v => s.includes(v));
    const isAvailable = (s: string) => ['available', 'vacant', 'free', 'a louer', 'à louer'].some(v => s.includes(v));

    return properties.slice(0, 6).map((p, idx) => ({
      label: p.title,
      href: `/dashboard/biens/detail/${p.id}`,
      letter: p.title ? p.title.charAt(0).toUpperCase() : 'B',
      color: idx % 3 === 0 ? 'bg-emerald-500' : idx % 3 === 1 ? 'bg-blue-500' : 'bg-amber-500',
      type: 'Bien',
      status: isRented(toStatus(p.status)) ? 'Loué' : isAvailable(toStatus(p.status)) ? 'Vacant' : 'Travaux',
    }));
  }, [properties]);

  // Badge locataires basé sur les contrats de location.
  const locatairesCount = contracts.filter(c => c.contract_type === 'rent').length;

  const gestionBiens = [
    { icon: Building2, label: 'Mes biens', href: '/dashboard/biens' },
    { icon: Users, label: 'Locataires', href: '/dashboard/locataires', badge: locatairesCount || undefined },
    { icon: FileText, label: 'Baux & Contrats', href: '/dashboard/contrats', badge: contracts.length || undefined },
    { icon: Wrench, label: 'Maintenance', href: '/dashboard/maintenance', badge: maintenanceCount || undefined },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Profil connecté (en haut) */}
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

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors z-50 border-2 border-white"
        title={isOpen ? "Réduire" : "Étendre"}
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 border-b border-gray-100 ${isOpen ? 'p-6' : 'p-4 justify-center'}`}>
        <div className={`bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-all ${
          isOpen ? 'w-10 h-10' : 'w-12 h-12'
        }`}>
          <Building2 className="text-white" size={isOpen ? 20 : 24} />
        </div>
        {isOpen && (
          <div className="animate-fadeIn">
            <span className="font-bold text-gray-900 text-lg">ImmoGestion</span>
            <p className="text-xs text-gray-500">Propriétaire</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className={`flex-1 overflow-y-auto ${isOpen ? 'px-4 py-4' : 'px-3 py-4'}`}>
        <div className="mb-6">
          {isOpen && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Menu principal
            </p>
          )}
          <nav className="space-y-1">
            {menuPrincipal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all relative group ${
                  isActive(item.href)
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isOpen ? 'px-3 py-2.5' : 'px-3 py-3 justify-center'}`}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon size={18} />
                {isOpen && <span>{item.label}</span>}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mb-6">
          {isOpen && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Gestion locative
            </p>
          )}
          <nav className="space-y-1">
            {gestionBiens.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all relative group ${
                  isActive(item.href)
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isOpen ? 'px-3 py-2.5' : 'px-3 py-3 justify-center'}`}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon size={18} />
                {isOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!isOpen && item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
        </div>

        {isOpen && (
          <div className="mb-6 animate-fadeIn">
            <button 
              onClick={() => setBiensExpanded(!biensExpanded)}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2"
            >
              <span>Mes propriétés</span>
              <ChevronDown size={14} className={`transition-transform ${biensExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {biensExpanded && (
              <nav className="space-y-1">
                {mesBiens.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                      'text-gray-700 font-medium hover:bg-gray-50'
                    }`}
                  >
                    {item.letter ? (
                      <div className={`w-6 h-6 ${item.color} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {item.letter}
                      </div>
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Loué' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.status && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'Loué' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>

      {/* Profil Utilisateur */}
      <div className={`border-t border-gray-200 bg-gray-50 ${isOpen ? 'p-4' : 'p-3'}`}>
        <div className={`flex items-center gap-3 ${!isOpen && 'flex-col gap-2'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-bold text-sm">PR</span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Propriétaire</p>
              <p className="text-xs text-gray-500">{properties.length} biens • {locatairesCount} contrats</p>
            </div>
          )}
          <button className={`p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors ${!isOpen && 'p-2'}`}>
            <Settings size={isOpen ? 16 : 20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
