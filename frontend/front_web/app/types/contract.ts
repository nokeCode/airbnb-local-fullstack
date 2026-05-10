export interface Contract {
  id: number;
  contract_type: 'rent' | 'sale';
  amount: number | string;
  start_date: string;
  end_date?: string | null;
  document?: string | null;
  property: number; // Property ID
  property_details?: {
    title?: string;
    address?: string;
  };
  client: number; // Person ID (role='client')
  client_details?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  agent?: number | null; // Person ID (role='agent')
  agent_details?: {
    first_name?: string;
    last_name?: string;
  };
  status?: 'active' | 'terminated' | 'expired';
  created_at?: string;
  payments?: Payment[];
  expenses?: Expense[];
}

export interface Payment {
  id: number;
  contract: number;
  amount: number;
  payment_date: string;
  description?: string;
  receipt?: string | null; // PDF receipt
  created_at?: string;
}

export interface Expense {
  id: number;
  contract: number;
  amount: number;
  expense_date: string;
  description: string;
  category?: string; // 'maintenance', 'repair', etc.
  created_at?: string;
}

export interface ContractsDashboard {
  total_contracts: number;
  active_rentals: number;
  sales: number;
  total_revenue: number;
  total_expenses: number;
  monthly_revenue: number;
  occupancy_rate: number;
}

// For create payload
export interface CreateContractPayload {
  contract_type: 'rent' | 'sale';
  property: number;
  client: number;
  agent?: number;
  amount: number;
  start_date: string;
  end_date?: string;
  document?: File | string;
}

export interface CreatePaymentPayload {
  amount: number;
  payment_date: string;
  description?: string;
  receipt?: File;
}
