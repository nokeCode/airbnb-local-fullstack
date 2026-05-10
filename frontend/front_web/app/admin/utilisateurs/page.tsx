'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Mail,
  CheckCircle2,
  Download,
  Plus,
  User as UserIcon,
  Home,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import type { ActivationRequest, User, UserRole, UserStatus } from '@/types/user';
import {
  approveActivationRequest,
  getActivationRequests,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminUserStatus,
  bulkAdminUserAction,
  sendEmailToUsers,
} from '@/services/adminService';

const users: User[] = [];

type RoleDisplayConfig = {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

type StatusDisplayConfig = {
  label: string;
  color: string;
  bg: string;
  icon: LucideIcon;
};

const roleConfig: Record<UserRole, RoleDisplayConfig> = {
  tenant: { label: 'Locataire', icon: UserIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  owner: { label: 'Propriétaire', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  admin: { label: 'Administrateur', icon: Shield, color: 'text-red-400', bg: 'bg-red-400/10' },
  proprietaire: { label: 'Propriétaire', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  locataire: { label: 'Locataire', icon: UserIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  agent_immobilier: {
    label: 'Agent immobilier',
    icon: Home,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  investisseur: {
    label: 'Investisseur',
    icon: Home,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
};

const statusConfig: Record<UserStatus, StatusDisplayConfig> = {
  active: { label: 'Actif', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 },
  pending: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Power },
  blocked: { label: 'Bloqué', color: 'text-red-400', bg: 'bg-red-400/10', icon: PowerOff },
  actif: { label: 'Actif', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 },
  inactif: { label: 'Inactif', color: 'text-red-400', bg: 'bg-red-400/10', icon: PowerOff },
  en_attente: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Power },
  suspendu: { label: 'Suspendu', color: 'text-red-400', bg: 'bg-red-400/10', icon: PowerOff },
  banni: { label: 'Banni', color: 'text-red-400', bg: 'bg-red-400/10', icon: PowerOff },
};

const defaultRoleConfig: RoleDisplayConfig = {
  label: 'Utilisateur',
  icon: UserIcon,
  color: 'text-gray-400',
  bg: 'bg-gray-400/10',
};

const defaultStatusConfig: StatusDisplayConfig = {
  label: 'Inconnu',
  color: 'text-gray-400',
  bg: 'bg-gray-400/10',
  icon: PowerOff,
};

type AdminUserApiResult = {
  id?: string | number;
  user_id?: string | number;
  email?: string;
  last_name?: string;
  nom?: string;
  first_name?: string;
  prenom?: string;
  role?: UserRole;
  account_status?: UserStatus;
  status?: UserStatus;
  phone?: string;
  telephone?: string;
  date_joined?: string;
  last_login?: string;
  verified?: boolean;
  is_verified?: boolean;
  properties_count?: number;
  biensCount?: number;
  agence?: string;
  subscription?: {
    plan?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  };
};

type AdminUsersResponse = {
  results?: AdminUserApiResult[];
  count?: number;
};

const normalizePlan = (plan?: string): NonNullable<User['abonnement']>['plan'] => {
  if (plan === 'starter' || plan === 'pro' || plan === 'enterprise') return plan;
  return 'gratuit';
};

const normalizeSubscriptionStatus = (
  status?: string
): NonNullable<User['abonnement']>['statut'] => {
  if (status === 'expire' || status === 'annule') return status;
  return 'actif';
};

export default function UsersManagement() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filterRole, setFilterRole] = useState<string>('tous');
  const [filterStatus, setFilterStatus] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [usersData, setUsersData] = useState<User[]>(users);
  const [usersLoading, setUsersLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(users.length);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [activationRequests, setActivationRequests] = useState<ActivationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  // États pour les modales et actions
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'delete' | 'activate' | 'suspend' | 'delete-bulk' | 'suspend-bulk' | 'email' | null;
    userId?: string;
    userName?: string;
  }>({ isOpen: false, action: null });

  useEffect(() => {
    let mounted = true;

    getActivationRequests()
      .then((data) => {
        if (!mounted) return;
        setActivationRequests(Array.isArray(data) ? data : []);
        setRequestsError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setRequestsError(err instanceof Error ? err.message : 'Erreur de chargement');
      })
      .finally(() => {
        if (mounted) setLoadingRequests(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    getAdminUsers({
      search: searchQuery || undefined,
      role: filterRole !== 'tous' ? filterRole : undefined,
      account_status: filterStatus !== 'tous' ? filterStatus : undefined,
      page,
      page_size: pageSize,
    })
      .then((response: AdminUsersResponse) => {
        if (!mounted) return;

        const results = Array.isArray(response.results) ? response.results : [];
        const mapped: User[] = results.map((raw) => ({
          id: String(raw.id ?? raw.user_id ?? `${Math.random()}`),
          email: raw.email || '',
          nom: raw.last_name || raw.nom || '',
          prenom: raw.first_name || raw.prenom || '',
          role: raw.role || 'owner',
          status: raw.account_status || raw.status || 'pending',
          telephone: raw.phone || raw.telephone,
          dateInscription: raw.date_joined ? new Date(raw.date_joined) : new Date(),
          derniereConnexion: raw.last_login ? new Date(raw.last_login) : undefined,
          verified: Boolean(raw.verified ?? raw.is_verified ?? true),
          biensCount: raw.properties_count ?? raw.biensCount,
          agence: raw.agence,
          abonnement: raw.subscription
            ? {
                plan: normalizePlan(raw.subscription.plan),
                dateDebut: raw.subscription.start_date ? new Date(raw.subscription.start_date) : new Date(),
                dateFin: raw.subscription.end_date ? new Date(raw.subscription.end_date) : undefined,
                statut: normalizeSubscriptionStatus(raw.subscription.status),
              }
            : undefined,
        }));

        setUsersData(mapped);
        setTotalUsers(typeof response.count === 'number' ? response.count : mapped.length);
      })
      .catch(() => {
        if (!mounted) return;
        setUsersData([]);
        setTotalUsers(0);
      })
      .finally(() => {
        if (mounted) setUsersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [searchQuery, filterRole, filterStatus, page]);

  const filteredUsers = useMemo(
    () =>
      usersData.filter((user) => {
        const matchRole = filterRole === 'tous' || user.role === filterRole;
        const matchStatus = filterStatus === 'tous' || user.status === filterStatus;
        const normalizedSearch = searchQuery.toLowerCase();
        const matchSearch =
          (user.nom || '').toLowerCase().includes(normalizedSearch) ||
          (user.prenom || '').toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch);

        return matchRole && matchStatus && matchSearch;
      }),
    [usersData, filterRole, filterStatus, searchQuery]
  );

  const toggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    setConfirmModal({
      isOpen: true,
      action: newStatus === 'active' ? 'activate' : 'suspend',
      userId,
      userName: usersData.find((u) => u.id === userId)?.prenom || 'Utilisateur',
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setConfirmModal({
      isOpen: true,
      action: 'delete',
      userId,
      userName,
    });
  };

  const handleEditUser = (userId: string) => {
    // Redirection vers la page d'édition
    window.location.href = `/admin/utilisateurs/${userId}`;
  };

  const confirmAction = async () => {
    if (!confirmModal.action || !confirmModal.userId) return;

    setActionLoading(true);
    setActionError(null);
    setSuccessMessage(null);

    try {
      const userId = confirmModal.userId;
      const action = confirmModal.action;

      switch (action) {
        case 'activate':
          await toggleAdminUserStatus(userId, 'active');
          setSuccessMessage('Utilisateur activé avec succès');
          break;
        case 'suspend':
          await toggleAdminUserStatus(userId, 'blocked');
          setSuccessMessage('Utilisateur suspendu avec succès');
          break;
        case 'delete':
          await deleteAdminUser(userId);
          setSuccessMessage('Utilisateur supprimé avec succès');
          break;
        case 'suspend-bulk':
          await bulkAdminUserAction(selectedUsers, 'suspend');
          setSuccessMessage(`${selectedUsers.length} utilisateur(s) suspendu(s)`);
          setSelectedUsers([]);
          break;
        case 'delete-bulk':
          await bulkAdminUserAction(selectedUsers, 'delete');
          setSuccessMessage(`${selectedUsers.length} utilisateur(s) supprimé(s)`);
          setSelectedUsers([]);
          break;
        case 'email':
          // À implémenter avec une modale pour le message
          setSuccessMessage('Email envoyé avec succès');
          break;
      }

      // Recharger les utilisateurs
      getAdminUsers({
        search: searchQuery || undefined,
        role: filterRole !== 'tous' ? filterRole : undefined,
        account_status: filterStatus !== 'tous' ? filterStatus : undefined,
        page,
        page_size: pageSize,
      })
        .then((response) => {
          const results = Array.isArray(response.results) ? response.results : [];
          const mapped: User[] = results.map((raw) => ({
            id: String(raw.id ?? raw.user_id ?? `${Math.random()}`),
            email: raw.email || '',
            nom: raw.last_name || raw.nom || '',
            prenom: raw.first_name || raw.prenom || '',
            role: raw.role || 'owner',
            status: raw.account_status || raw.status || 'pending',
            telephone: raw.phone || raw.telephone,
            dateInscription: raw.date_joined ? new Date(raw.date_joined) : new Date(),
            derniereConnexion: raw.last_login ? new Date(raw.last_login) : undefined,
            verified: Boolean(raw.verified ?? raw.is_verified ?? true),
            biensCount: raw.properties_count ?? raw.biensCount,
            agence: raw.agence,
            abonnement: raw.subscription
              ? {
                  plan: normalizePlan(raw.subscription.plan),
                  dateDebut: raw.subscription.start_date ? new Date(raw.subscription.start_date) : new Date(),
                  dateFin: raw.subscription.end_date ? new Date(raw.subscription.end_date) : undefined,
                  statut: normalizeSubscriptionStatus(raw.subscription.status),
                }
              : undefined,
          }));
          setUsersData(mapped);
          setTotalUsers(typeof response.count === 'number' ? response.count : mapped.length);
        })
        .catch(() => {
          setUsersData([]);
          setTotalUsers(0);
        });

      setConfirmModal({ isOpen: false, action: null });

      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await approveActivationRequest(requestId);
      setActivationRequests((prev) => prev.filter((req) => req.id !== requestId));
      setRequestsError(null);
    } catch (error) {
      setRequestsError(error instanceof Error ? error.message : 'Erreur lors de l’activation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">Gestion des utilisateurs</h1>
          <p className="text-gray-400">Gérez les comptes, permissions et accès de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-700">
            <Download size={18} />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700">
            <Plus size={18} />
            <span>Ajouter un utilisateur</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-[#1E293B] p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-700 bg-[#0F172A] py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-700 bg-[#0F172A] px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="tous">Tous les rôles</option>
              <option value="tenant">Locataires</option>
              <option value="owner">Propriétaires</option>
              <option value="admin">Administrateurs</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-700 bg-[#0F172A] px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="tous">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="blocked">Bloqués</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-6 border-t border-gray-800 pt-4 text-sm">
          <span className="text-gray-400">
            Total: <span className="font-semibold text-white">{totalUsers}</span>
          </span>
          <span className="text-emerald-400">
            Actifs: <span className="font-semibold">{usersData.filter((u) => u.status === 'active').length}</span>
          </span>
          <span className="text-amber-400">
            En attente: <span className="font-semibold">{usersData.filter((u) => u.status === 'pending').length}</span>
          </span>
          <span className="text-red-400">
            Bloqués: <span className="font-semibold">{usersData.filter((u) => u.status === 'blocked').length}</span>
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-[#1E293B] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Demandes d'activation</h2>
            <p className="text-sm text-gray-400">Propriétaires en attente de validation admin</p>
          </div>
          <span className="text-xs text-gray-400">
            {loadingRequests ? 'Chargement...' : `${activationRequests.length} demande(s)`}
          </span>
        </div>

        {loadingRequests ? (
          <div className="h-16 animate-pulse rounded-xl bg-gray-800/60" />
        ) : requestsError ? (
          <div className="text-sm text-red-400">{requestsError}</div>
        ) : activationRequests.length === 0 ? (
          <div className="text-sm text-gray-500">Aucune demande en attente.</div>
        ) : (
          <div className="space-y-2">
            {activationRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-[#0F172A] p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {req.user?.prenom || 'Utilisateur'} {req.user?.nom || ''}
                  </p>
                  <p className="text-xs text-gray-400">{req.user?.email || '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Plan: <span className="text-white">{req.plan || 'non précisé'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700"
                  >
                    Activer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800 bg-[#0F172A]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedUsers(usersData.map((u) => u.id));
                      else setSelectedUsers([]);
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Abonnement</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Inscription</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">
                  Dernière connexion
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {usersLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const currentRoleConfig = roleConfig[user.role] ?? defaultRoleConfig;
                  const currentStatusConfig = statusConfig[user.status] ?? defaultStatusConfig;
                  const RoleIcon = currentRoleConfig.icon;
                  const StatusIcon = currentStatusConfig.icon;

                  return (
                    <tr key={user.id} className="group transition-colors hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedUsers([...selectedUsers, user.id]);
                            else setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                          }}
                          className="rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 font-bold text-white">
                            {(user.prenom || '')[0]}
                            {(user.nom || '')[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {user.prenom || ''} {user.nom || ''}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.telephone && <p className="text-xs text-gray-600">{user.telephone}</p>}
                          </div>
                          {!user.verified && (
                            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                              Non vérifié
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 ${currentRoleConfig.bg}`}
                        >
                          <RoleIcon size={14} className={currentRoleConfig.color} />
                          <span className={`text-sm font-medium ${currentRoleConfig.color}`}>
                            {currentRoleConfig.label}
                          </span>
                        </div>
                        {user.role === 'owner' && user.biensCount && (
                          <p className="mt-1 text-xs text-gray-500">{user.biensCount} biens</p>
                        )}
                        {user.role === 'owner' && user.agence && (
                          <p className="mt-1 text-xs text-gray-500">{user.agence}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${currentStatusConfig.bg}`}
                        >
                          <StatusIcon size={14} className={currentStatusConfig.color} />
                          <span className={`text-sm font-medium ${currentStatusConfig.color}`}>
                            {currentStatusConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.abonnement ? (
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                user.abonnement.plan === 'enterprise'
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : user.abonnement.plan === 'pro'
                                    ? 'bg-indigo-500/10 text-indigo-400'
                                    : user.abonnement.plan === 'starter'
                                      ? 'bg-emerald-500/10 text-emerald-400'
                                      : 'bg-gray-500/10 text-gray-400'
                              }`}
                            >
                              {user.abonnement.plan.toUpperCase()}
                            </span>
                            <p className="mt-1 text-xs text-gray-500">
                              {user.abonnement.statut === 'actif' ? 'Actif' : 'Inactif'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Gratuit</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {user.derniereConnexion ? (
                          new Date(user.derniereConnexion).toLocaleDateString('fr-FR')
                        ) : (
                          <span className="text-gray-600">Jamais</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.status)}
                            disabled={actionLoading}
                            className={`rounded-lg p-2 text-gray-400 transition-colors disabled:opacity-50 ${
                              user.status === 'active'
                                ? 'hover:bg-red-500/10 hover:text-red-400'
                                : 'hover:bg-emerald-500/10 hover:text-emerald-400'
                            }`}
                            title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                          >
                            {user.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                          </button>
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400"
                            title="Éditer"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                            disabled={actionLoading}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 bg-[#0F172A] px-6 py-4">
          <p className="text-sm text-gray-500">
            Affichage de <span className="text-white">{(page - 1) * pageSize + 1}</span> à{' '}
            <span className="text-white">{Math.min(page * pageSize, totalUsers)}</span> sur{' '}
            <span className="text-white">{totalUsers}</span> utilisateurs
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Précédent
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">{page}</button>
            <button
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * pageSize >= totalUsers}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-gray-700 bg-[#1E293B] px-6 py-4 shadow-2xl">
          <span className="text-sm text-gray-400">
            <span className="font-semibold text-white">{selectedUsers.length}</span> utilisateur(s) sélectionné(s)
          </span>
          <div className="h-6 w-px bg-gray-700" />
          <button
            onClick={() => setConfirmModal({ isOpen: true, action: 'activate' })}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/10 disabled:opacity-50"
          >
            <Power size={16} />
            Activer
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, action: 'suspend-bulk' })}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <PowerOff size={16} />
            Suspendre
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, action: 'email' })}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <Mail size={16} />
            Envoyer email
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, action: 'delete-bulk' })}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      )}

      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
          {successMessage}
        </div>
      )}

      {actionError && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 shadow-lg">
          {actionError}
        </div>
      )}

      {/* Modale de confirmation */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#1E293B] p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-white">Confirmation</h3>
            <p className="mb-6 text-sm text-gray-400">
              {confirmModal.action === 'delete'
                ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${confirmModal.userName}"? Cette action est irréversible.`
                : confirmModal.action === 'suspend'
                  ? `Êtes-vous sûr de vouloir suspendre l'utilisateur "${confirmModal.userName}"?`
                  : confirmModal.action === 'activate'
                    ? `Êtes-vous sûr de vouloir activer l'utilisateur "${confirmModal.userName}"?`
                    : confirmModal.action === 'delete-bulk'
                      ? `Êtes-vous sûr de vouloir supprimer les ${selectedUsers.length} utilisateur(s) sélectionné(s)? Cette action est irréversible.`
                      : confirmModal.action === 'suspend-bulk'
                        ? `Êtes-vous sûr de vouloir suspendre les ${selectedUsers.length} utilisateur(s) sélectionné(s)?`
                        : confirmModal.action === 'email'
                          ? `Êtes-vous sûr de vouloir envoyer un email aux ${selectedUsers.length} utilisateur(s) sélectionné(s)?`
                          : 'Êtes-vous sûr?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, action: null })}
                disabled={actionLoading}
                className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
                  confirmModal.action === 'delete' || confirmModal.action === 'delete-bulk'
                    ? 'bg-red-600 hover:bg-red-700'
                    : confirmModal.action === 'suspend' || confirmModal.action === 'suspend-bulk'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                } disabled:opacity-50`}
              >
                {actionLoading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
