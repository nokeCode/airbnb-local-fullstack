export interface ClientProperty {
  id: number;
  title: string;
  address: string;
  price: number;
  charges?: number;
  image: string;
  surface: number;
  rooms: number;
  bedrooms?: number;
  type: string;
  available: string;
  distance: string;
  rating: number;
  reviews: number;
  tags: string[];
  isNew?: boolean;
  isFavorite?: boolean;
  description?: string;
}

export const clientProperties: ClientProperty[] = [
  {
    id: 1,
    title: 'Studio moderne avec balcon',
    address: 'Rue de la Roquette, Paris 11e',
    price: 850,
    charges: 80,
    image: 'chambre3.webp',
    surface: 28,
    rooms: 1,
    type: 'Studio',
    available: 'Immédiatement',
    distance: '120m (2 min)',
    rating: 4.7,
    reviews: 24,
    tags: ['Meublé', 'Balcon', 'Métro à 3min'],
    isNew: true,
    description: 'Studio lumineux avec balcon, proche des transports et des commerces.'
  },
  {
    id: 2,
    title: 'T2 lumineux rénové',
    address: 'Avenue Jean Jaurès, Lyon 7e',
    price: 720,
    charges: 60,
    image: '/maison1.jpg',
    surface: 45,
    rooms: 2,
    bedrooms: 1,
    type: 'T2',
    available: '1er mai',
    distance: '250m (4 min)',
    rating: 4.9,
    reviews: 18,
    tags: ['Rénové', 'Cave', 'Parking'],
    isNew: false,
    description: 'Appartement rénové, calme, avec parking et rangements.'
  },
  {
    id: 3,
    title: 'Appartement haussmannien',
    address: 'Boulevard Saint-Germain, Paris 6e',
    price: 1450,
    charges: 150,
    image: '/maison2.webp',
    surface: 55,
    rooms: 2,
    bedrooms: 1,
    type: 'T2',
    available: '15 avril',
    distance: '400m (6 min)',
    rating: 4.8,
    reviews: 42,
    tags: ['Ancien', 'Cheminée', 'Vue sur cour'],
    isNew: true,
    description: 'Appartement de charme avec moulures, cheminée et belle hauteur sous plafond.'
  },
  {
    id: 4,
    title: 'Studio étudiant proche campus',
    address: 'Rue de Strasbourg, Nantes',
    price: 450,
    charges: 40,
    image: '/maison7.jpg',
    surface: 20,
    rooms: 1,
    type: 'Studio',
    available: 'Immédiatement',
    distance: '50m (1 min)',
    rating: 4.5,
    reviews: 31,
    tags: ['Étudiant', 'Internet inclus', 'Meublé'],
    isNew: false,
    description: 'Studio idéal étudiant, internet inclus, proximité transports.'
  },
  {
    id: 5,
    title: 'Loft industriel',
    address: 'Quai de la Loire, Paris 19e',
    price: 1200,
    charges: 100,
    image: '/chambre1.avif',
    surface: 65,
    rooms: 2,
    bedrooms: 1,
    type: 'Loft',
    available: '1er juin',
    distance: '800m (10 min)',
    rating: 4.6,
    reviews: 15,
    tags: ['Atypique', 'Terrasse', 'Open-space'],
    isNew: true,
    description: 'Loft spacieux avec terrasse, volumes ouverts et lumière naturelle.'
  },
  {
    id: 6,
    title: 'T3 familial avec jardin',
    address: 'Allée des Cyprès, Bordeaux',
    price: 980,
    charges: 80,
    image: 'chambre2.avif',
    surface: 70,
    rooms: 3,
    bedrooms: 2,
    type: 'T3',
    available: 'Immédiatement',
    distance: '1.2km (15 min)',
    rating: 4.9,
    reviews: 28,
    tags: ['Jardin', 'Familial', 'Calme'],
    isNew: false,
    description: 'Appartement familial, jardin privatif et environnement calme.'
  },
];
