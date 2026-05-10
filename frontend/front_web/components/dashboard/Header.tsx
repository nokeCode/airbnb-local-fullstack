'use client';

import { Search, Bell, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function Header({ 
  title, 
  subtitle, 
  showSearch = true, 
  actionLabel, 
  actionHref,
  onAction 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {title ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex-1 max-w-2xl">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un bien, un locataire, un contrat..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span className="hidden sm:inline">Avril 2024</span>
          </button>
          
          <Link href={"/dashboard/alerts"} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Link>
          
          {actionLabel && (
            <>
              {actionHref ? (
                <Link 
                  href={actionHref}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-200"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">{actionLabel}</span>
                </Link>
              ) : (
                <button 
                  onClick={onAction}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-200"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">{actionLabel}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}