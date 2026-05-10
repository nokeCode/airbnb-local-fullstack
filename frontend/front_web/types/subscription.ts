export interface SubscriptionPlan {
  id: string;
  nom: string;
  prix: number;
  frequence: 'mensuel' | 'annuel';
  fonctionnalites: string[];
  limiteBiens?: number;
  limiteLocataires?: number;
  supportPrioritaire: boolean;
  analyticsAvance: boolean;
}

export interface SubscriptionRevenue {
  mois: string;
  revenusAbonnements: number;
  revenusTransactions: number;
  total: number;
  nouveauxInscrits: number;
  desabonnements: number;
  tauxConversion: number;
}