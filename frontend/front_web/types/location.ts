export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'rejected' | string;
export type DossierStatus = 'incomplete' | 'pending' | 'complete' | string;

export interface MinimalUser {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface MinimalProperty {
  id: number;
  title?: string;
  address?: string;
  price?: number;
  image?: string | null;
}

export interface Application {
  id: number;
  // Backend peut renvoyer soit un objet, soit un id (FK).
  property: MinimalProperty | number;
  tenant: MinimalUser | number;
  owner?: MinimalUser | number;
  property_title?: string;
  tenant_name?: string;
  message?: string;
  status: ApplicationStatus;
  dossier_status: DossierStatus;
  visit_date?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  conversation_id?: number | null;
}

export type LeaseStatus = 'draft' | 'sent' | 'signed' | 'active' | 'terminated' | string;

export interface Lease {
  id: number;
  application?: Application | null;
  property: MinimalProperty;
  tenant: MinimalUser;
  owner?: MinimalUser;
  status: LeaseStatus;
  start_date?: string | null;
  end_date?: string | null;
  monthly_rent?: number | string | null;
  deposit_amount?: number | string | null;
  document_url?: string | null;
  signed_at?: string | null;
}

export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | string;

export interface Visit {
  id: number;
  property: MinimalProperty;
  tenant: MinimalUser;
  owner: MinimalUser;
  scheduled_date: string;
  status: VisitStatus;
  notes?: string | null;
}
