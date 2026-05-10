'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { getCurrentUser } from '@/services/usersService';
import type { CurrentUser } from '@/types/user';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasToken, setHasToken] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    // Empêche l'accès admin sans authentification.
    let mounted = true;
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('access') || localStorage.getItem('token'))
      : null;
    if (!token) {
      setHasToken(false);
      setAuthChecked(true);
      router.replace('/admin/login');
      return;
    }
    setHasToken(true);

    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        setCurrentUser(user);

        // Redirection selon le rôle (si non superadmin).
        if (!user.is_superuser && (user.role === 'tenant' || user.role === 'locataire')) {
          router.replace('/client');
        } else if (!user.is_superuser && (user.role === 'owner' || user.role === 'proprietaire' || user.role === 'agent_immobilier' || user.role === 'investisseur')) {
          router.replace('/dashboard');
        } else if (user.role === 'admin' && !(user as any).is_superuser) {
          // Admin non superuser: accès refusé.
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          router.replace('/login');
        }
      })
      .catch(() => {
        if (!mounted) return;
        setCurrentUser(null);
        setHasToken(false);
        router.replace('/admin/login');
      })
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex admin-shell">
      <AdminSidebar />
      <div className="flex-1 ml-72 flex flex-col admin-shell-main">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto admin-shell-content">
          {hasToken && authChecked && (currentUser as any)?.is_superuser ? children : null}
        </main>
      </div>
    </div>
  );
}
