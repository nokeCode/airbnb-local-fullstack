'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Building2, 
  Receipt, 
  BarChart3, 
  Wrench, 
  Settings, 
  Shield, 
  Bell,
  ChevronDown,
  LogOut,
  Crown,
  MessageSquare,
  FileText,
  Globe,
  Zap
} from 'lucide-react';

const menuSections = [
  {
    title: 'Vue d\'ensemble',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', exact: true },
      { icon: Bell, label: 'Notifications', href: '/admin/notifications', badge: 12 },
      { icon: BarChart3, label: 'Statistiques', href: '/admin/rapports' },
    ]
  },
  {
    title: 'Gestion Utilisateurs',
    items: [
      { 
        icon: Users, 
        label: 'Utilisateurs', 
        href: '/admin/utilisateurs',
        subItems: [
          { label: 'Tous les utilisateurs', href: '/admin/utilisateurs' },
          { label: 'Locataires', href: '/admin/utilisateurs?role=locataire' },
          { label: 'Propriétaires', href: '/admin/utilisateurs?role=proprietaire' },
          { label: 'Agents immobiliers', href: '/admin/utilisateurs?role=agent_immobilier' },
          { label: 'Investisseurs', href: '/admin/utilisateurs?role=investisseur' },
          { label: 'En attente', href: '/admin/utilisateurs?status=en_attente', badge: 5 },
        ]
      },
      { icon: Shield, label: 'Permissions & Rôles', href: '/admin/permissions' },
      { icon: MessageSquare, label: 'Messages Support', href: '/admin/support', badge: 8 },
    ]
  },
  {
    title: 'Gestion Financière',
    items: [
      { 
        icon: CreditCard, 
        label: 'Abonnements', 
        href: '/admin/abonnements',
        subItems: [
          { label: 'Plans & Tarifs', href: '/admin/abonnements' },
          { label: 'Revenus', href: '/admin/abonnements/revenus' },
          { label: 'Codes promo', href: '/admin/abonnements/promotions' },
        ]
      },
      { icon: Receipt, label: 'Transactions', href: '/admin/transactions' },
      { icon: FileText, label: 'Factures', href: '/admin/factures' },
    ]
  },
  {
    title: 'Gestion Immobilière',
    items: [
      { icon: Building2, label: 'Tous les biens', href: '/admin/biens', badge: 156 },
      { icon: Wrench, label: 'Maintenance', href: '/admin/maintenance', badge: 23 },
      { icon: Globe, label: 'Localisations', href: '/admin/localisations' },
    ]
  },
  {
    title: 'Système',
    items: [
      { icon: Settings, label: 'Paramètres', href: '/admin/parametres' },
      { icon: Zap, label: 'Logs & Sécurité', href: '/admin/logs' },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(['Gestion Utilisateurs']);

  const toggleSection = (title: string) => {
    setExpanded(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#1E293B] border-r border-gray-800 flex flex-col z-50">
      {/* Logo Admin */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Crown className="text-white" size={24} />
          </div>
          <div>
            <span className="font-bold text-white text-lg">ImmoAdmin</span>
            <p className="text-xs text-gray-400">Super Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
            >
              <span>{section.title}</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform ${expanded.includes(section.title) ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {expanded.includes(section.title) && (
              <nav className="mt-2 px-4 space-y-1">
                {section.items.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(item.href, item.exact)
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    
                    {item.subItems && isActive(item.href) && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700 pl-4">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="flex items-center justify-between py-2 text-sm text-gray-500 hover:text-white transition-colors"
                          >
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>
        ))}
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-t border-gray-800 bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Super Admin</p>
            <p className="text-xs text-gray-500">admin@immogestion.fr</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}