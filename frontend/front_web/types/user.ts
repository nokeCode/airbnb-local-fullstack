// Rôles backend (nouveaux) + anciens rôles UI pour compatibilité.
export type UserRole =
  | 'admin'
  | 'owner'
  | 'tenant'
  | 'proprietaire'
  | 'locataire'
  | 'agent_immobilier'
  | 'investisseur';

// Statuts backend (nouveaux) + anciens statuts UI pour compatibilité.
export type UserStatus =
  | 'active'
  | 'pending'
  | 'blocked'
  | 'actif'
  | 'inactif'
  | 'en_attente'
  | 'suspendu'
  | 'banni';

// Profil minimal renvoyé par /users/me/ pour piloter l'accès.
export interface CurrentUser {
  id: string | number;
  email: string;
  role: UserRole;
  account_status: UserStatus;
  onboarding_completed?: boolean;
  activation_requested?: boolean;
  is_superuser?: boolean;
  name?: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  status: UserStatus;
  telephone?: string;
  dateInscription: Date;
  derniereConnexion?: Date;
  avatar?: string;
  verified: boolean;
  // Spécifique selon le rôle
  biensCount?: number;           // Pour propriétaire
  loyerMensuel?: number;         // Pour locataire
  agence?: string;               // Pour agent immobilier
  portfolioValue?: number;       // Pour investisseur
  abonnement?: {
    plan: 'gratuit' | 'starter' | 'pro' | 'enterprise';
    dateDebut: Date;
    dateFin?: Date;
    statut: 'actif' | 'expire' | 'annule';
  };
}

// Demande d'activation pour un propriétaire/agent bloqué.
export interface ActivationRequest {
  id: string;
  user: {
    id: string | number;
    email: string;
    nom?: string;
    prenom?: string;
    role?: UserRole;
  };
  plan?: 'gratuit' | 'starter' | 'pro' | 'enterprise';
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  abonnement?: string;
}
