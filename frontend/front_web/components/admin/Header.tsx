'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  UserPlus,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotificationCenter } from './NotificationCenter';
import { createAdminUser } from '@/services/adminService';

export function AdminHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'owner',
    account_status: 'pending',
    password: '',
  });

  useEffect(() => {
    // Restaure le thème admin depuis le localStorage.
    const saved = typeof window !== 'undefined' ? localStorage.getItem('admin_theme') : null;
    const isDark = saved ? saved === 'dark' : true;
    setDarkMode(isDark);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-admin-theme', isDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-admin-theme', next ? 'dark' : 'light');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_theme', next ? 'dark' : 'light');
    }
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/admin/utilisateurs?search=${encodeURIComponent(q)}` : '/admin/utilisateurs');
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createAdminUser({
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role as 'admin' | 'owner' | 'tenant',
        account_status: form.account_status as 'active' | 'pending' | 'blocked',
        password: form.password || undefined,
      });
      setShowAddUser(false);
      setForm({
        email: '',
        first_name: '',
        last_name: '',
        role: 'owner',
        account_status: 'pending',
        password: '',
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerBg = darkMode ? 'bg-[#1E293B] border-gray-800' : 'bg-white border-gray-200';
  const inputBg = darkMode ? 'bg-[#0F172A] border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400';
  const btnBg = darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900';

  return (
    <header className={`border-b px-8 py-4 sticky top-0 z-40 ${headerBg}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={submitSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher utilisateurs, biens, transactions..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${inputBg}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-100'}`}>Ctrl+K</span>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-colors ${btnBg}`}
            title={darkMode ? 'Mode jour' : 'Mode nuit'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={`p-3 rounded-xl transition-colors ${btnBg}`}>
            <Settings size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 rounded-xl transition-colors relative ${btnBg}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1E293B]">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>

            {showNotifications && (
              <NotificationCenter
                onClose={() => setShowNotifications(false)}
                onUnreadChange={setUnreadCount}
              />
            )}
          </div>

          <div className={`h-8 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mx-2`} />

          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
          >
            <UserPlus size={18} />
            <span>Nouvel utilisateur</span>
          </button>
        </div>
      </div>

      {/* Modal ajout utilisateur */}
      {showAddUser && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Ajouter un utilisateur</h3>
              <button onClick={() => setShowAddUser(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={form.first_name}
                  onChange={(e) => setForm(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={form.last_name}
                  onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe (optionnel)"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={form.role}
                  onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                >
                  <option value="owner">Propriétaire</option>
                  <option value="tenant">Locataire</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={form.account_status}
                  onChange={(e) => setForm(prev => ({ ...prev, account_status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                >
                  <option value="pending">En attente</option>
                  <option value="active">Actif</option>
                  <option value="blocked">Bloqué</option>
                </select>
              </div>
              {submitError && (
                <div className="text-sm text-red-600">{submitError}</div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Création...' : 'Créer utilisateur'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
