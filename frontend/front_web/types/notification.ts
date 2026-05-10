export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: NotificationType;
  lu: boolean;
  dateCreation: Date;
  lien?: string;
  image?: string;
  action?: {
    label: string;
    url: string;
  };
  // Métadonnées
  categorie: 'utilisateur' | 'systeme' | 'financier' | 'securite' | 'maintenance';
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
}