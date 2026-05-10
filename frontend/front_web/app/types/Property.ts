export interface PropertyImage {
  id: number;
  image: string;
}

export interface PropertyOwner {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  contract_type: 'sale' | 'rent';
  status: string;
  category_name: string;
  equipements: string[];
  latitude: number;
  longitude: number;
  owner: PropertyOwner;
  images: PropertyImage[];
}

// Types pour affichage PropertyCard (mapping depuis Property)
export interface DisplayProperty {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  image: string; // images[0]?.image || default
  surface: number;
  bedrooms: number;
  bathrooms?: number;
  type: string; // category_name
  equipements: string[]; // slice(0,4)
  ownerName: string;
  ownerAvatar?: string;
  contract_type: 'sale' | 'rent';
  status: string;
  favorite?: boolean;
}

// Filtres étendus pour API
export interface PropertyFilters {
  contract_type?: 'sale' | 'rent';
  city?: string;
  price_min?: number;
  price_max?: number;
  surface_min?: number;
  surface_max?: number;
  bedrooms_min?: number;
  category_name?: string;
  status?: string;
  search?: string;
}
