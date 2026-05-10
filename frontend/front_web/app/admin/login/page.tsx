'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/services/authService';
import { getCurrentUser } from '@/services/usersService';
import { getDeviceId, getDeviceName } from '@/utils/device';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez renseigner email et mot de passe');
      return;
    }

    setLoading(true);
    try {
      const deviceId = getDeviceId();
      const deviceName = getDeviceName();

      const data = await loginUser(email, password, deviceId, deviceName, true);

      if (data.requires_2fa) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pending_login', JSON.stringify({
            email,
            password,
            device_name: deviceName,
            trust_device: true,
          }));
        }
        router.push(`/verify-2fa?email=${encodeURIComponent(email)}&flow=login&next=admin`);
        return;
      }

      if (data.access) localStorage.setItem('access', data.access);
      if (data.refresh) localStorage.setItem('refresh', data.refresh);

      const me = await getCurrentUser();
      if (me.role !== 'admin' || !(me as any).is_superuser) {
        setError('Accès réservé au superadmin');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <ShieldCheck className="text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin sécurisé</h1>
            <p className="text-sm text-gray-400">Connexion superadmin</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
              placeholder="admin@exemple.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Mot de passe</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-gray-700 text-white focus:outline-none focus:border-indigo-500 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Retour au <Link href="/login" className="text-indigo-400 hover:text-indigo-300">login utilisateur</Link>
        </div>
      </div>
    </div>
  );
}
