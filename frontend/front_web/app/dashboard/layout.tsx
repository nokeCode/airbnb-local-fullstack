'use client';

import { Sidebar } from "@/components/dashboard/Sidebar";
import { ActivationOverlay } from "@/components/dashboard/ActivationOverlay";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, requestActivation } from "@/services/usersService";
import type { CurrentUser } from "@/types/user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationRequested, setActivationRequested] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté et autorisé à voir le dashboard.
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
        setActivationRequested(Boolean(user.activation_requested));

        // Redirection selon le rôle.
        if (user.role === 'tenant') {
          router.replace('/client');
        } else if (user.role === 'admin') {
          router.replace('/admin');
        }
      })
      .catch(() => {
        if (!mounted) return;
        // Token invalide -> on bloque l'accès dashboard.
        setCurrentUser(null);
        setHasToken(false);
        router.replace('/login');
      })
      .finally(() => {
        if (mounted) {
          setLoadingUser(false);
          setAuthChecked(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  // Dashboard bloqué si propriétaire en attente d'activation admin.
  const isBlocked = useMemo(() => {
    if (!currentUser) return false;
    const role = currentUser.role;
    const status = (currentUser as any).account_status ?? (currentUser as any).status;
    const isOwner = role === 'owner' || role === 'proprietaire' || role === 'agent_immobilier' || role === 'investisseur';
    const isPending = status === 'pending' || status === 'en_attente';
    const isBlockedStatus = status === 'blocked' || status === 'suspendu' || status === 'banni' || status === 'inactif';
    return isOwner && (isPending || isBlockedStatus);
  }, [currentUser]);

  const handleActivationRequest = async (plan: string) => {
    if (activationRequested || activationLoading) return;
    try {
      setActivationLoading(true);
      await requestActivation(plan);
      setActivationRequested(true);
    } catch {
      setActivationRequested(false);
    } finally {
      setActivationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } ${isBlocked ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        {hasToken && authChecked ? children : null}
      </main>

      {/* Overlay d'activation (propriétaire en attente) */}
      {!loadingUser && (
        <ActivationOverlay
          open={isBlocked}
          requested={activationRequested}
          loading={activationLoading}
          onRequest={handleActivationRequest}
        />
      )}
    </div>
  );
}
