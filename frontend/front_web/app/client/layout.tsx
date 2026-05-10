'use client';

import { Sidebar } from "@/components/client/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/usersService";
import type { CurrentUser } from "@/types/user";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Empêche l'accès client sans authentification.
    let mounted = true;
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('access') || localStorage.getItem('token'))
      : null;
    if (!token) {
      setHasToken(false);
      setAuthChecked(true);
      router.replace('/login');
      return;
    }
    setHasToken(true);

    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        setCurrentUser(user);

        // Redirection selon le rôle.
        if (user.role === 'owner' || user.role === 'proprietaire' || user.role === 'agent_immobilier') {
          router.replace('/dashboard');
        } else if (user.role === 'admin') {
          router.replace('/admin');
        }
      })
      .catch(() => {
        if (!mounted) return;
        // Token invalide -> on bloque l'accès client.
        setCurrentUser(null);
        setHasToken(false);
        router.replace('/login');
      })
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        {/* On affiche les pages client uniquement si le rôle est compatible */}
        {hasToken && authChecked ? children : null}
      </main>
    </div>
  );
}
