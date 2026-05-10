// app/biens/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  BedDouble,
  Maximize,
  Home,
  X,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getProperties } from "@/services/propertiesService";

// Types
type PropertyType = "all" | "maison" | "chambre" | "appartement" | "villa";
type OfferType = "all" | "vente" | "location";
type SortOption = "newest" | "price-asc" | "price-desc" | "surface-asc" | "surface-desc";

interface Property {
  id: string;
  image: string;
  title: string;
  location: string;
  price: number;
  type: PropertyType;
  offerType: OfferType;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  featured: boolean;
  dateAdded: string;
}

const ITEMS_PER_PAGE = 6;

const normalizeOffer = (value?: string): OfferType => {
  const v = (value || '').toLowerCase();
  if (v.includes('vente') || v.includes('sale')) return 'vente';
  if (v.includes('location') || v.includes('rent') || v.includes('lease')) return 'location';
  return 'location';
};

const normalizeType = (value?: string): PropertyType => {
  const v = (value || '').toLowerCase();
  if (v.includes('maison')) return 'maison';
  if (v.includes('chambre') || v.includes('studio')) return 'chambre';
  if (v.includes('villa')) return 'villa';
  return 'appartement';
};

const mapApiProperty = (raw: any): Property => {
  const images = Array.isArray(raw?.images) ? raw.images : [];
  const firstImage = raw?.image || raw?.thumbnail || raw?.main_image || images[0]?.image || images[0]?.url || images[0]?.file;
  return {
    id: String(raw?.id ?? ''),
    image: firstImage || '/maison1.jpg',
    title: raw?.title || raw?.name || 'Bien',
    location: raw?.address || raw?.location || raw?.city || '',
    price: Number(raw?.price ?? raw?.rent ?? raw?.monthly_rent ?? 0),
    type: normalizeType(raw?.type || raw?.category),
    offerType: normalizeOffer(raw?.offer_type || raw?.offerType || raw?.type_offer || raw?.status),
    surface: Number(raw?.surface ?? raw?.area ?? 0),
    bedrooms: Number(raw?.bedrooms ?? raw?.rooms ?? 0),
    bathrooms: Number(raw?.bathrooms ?? raw?.baths ?? 0),
    featured: Boolean(raw?.featured || raw?.is_featured),
    dateAdded: String(raw?.created_at || raw?.date_added || new Date().toISOString()),
  };
};


// Composant Carte Propriété
const PropertyCard = ({
  property,
  viewMode,
  onRent,
}: {
  property: Property;
  viewMode: "grid" | "list";
  onRent: (id: string) => void;
}) => {
  const isGrid = viewMode === "grid";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 ${
        isGrid ? "" : "flex flex-col md:flex-row"
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isGrid ? "h-64" : "h-64 md:h-auto md:w-80 flex-shrink-0"}`}>
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-lg">
              ★ Premium
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
            property.offerType === "vente" ? "bg-[#9A7B66] text-white" : "bg-emerald-500 text-white"
          }`}>
            {property.offerType === "vente" ? "À vendre" : "À louer"}
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
            {property.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#9A7B66] transition-colors line-clamp-1">
              {property.title}
            </h3>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.location}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-gray-900">
              ${property.price.toLocaleString()}
            </p>
            {property.offerType === "location" && (
              <span className="text-xs text-gray-500">/mois</span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className={`flex gap-4 text-gray-500 text-sm my-4 ${isGrid ? "" : "md:my-auto"}`}>
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-[#9A7B66]" />
            {property.surface} m²
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-[#9A7B66]" />
            {property.bedrooms} ch.
          </span>
          <span className="flex items-center gap-1.5">
            <Home className="w-4 h-4 text-[#9A7B66]" />
            {property.bathrooms} sdb
          </span>
        </div>

        {/* Action */}
        <div className={`flex items-center ${isGrid ? "justify-between mt-auto pt-4 border-t border-gray-100" : "justify-end gap-3 mt-4 md:mt-auto"}`}>
          <span className="text-xs text-gray-400">
            Ajouté le {new Date(property.dateAdded).toLocaleDateString('fr-FR')}
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRent(property.id)}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Louer
            </motion.button>
            <Link href={`/property/${property.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-[#9A7B66] transition-colors shadow-lg shadow-gray-900/20 hover:shadow-[#9A7B66]/30"
            >
              Voir détails
            </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Filtre Mobile
const MobileFilter = ({ 
  isOpen, 
  onClose, 
  filters, 
  setFilters 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  filters: any; 
  setFilters: any;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto lg:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Filtres</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Contenu des filtres (même que sidebar) */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function BiensPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") ?? "";
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProperties()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setProperties(list.map(mapApiProperty));
      })
      .catch(() => {
        if (!mounted) return;
        setProperties([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRent = (id: string) => {
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("access") || localStorage.getItem("token"))
        : null;
    if (!token) {
      router.push(`/login?next=/client&property=${id}`);
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPropertyId", id);
    }
    router.push(`/client?property=${id}`);
  };

  // Filtres
  const [filters, setFilters] = useState({
    type: "all" as PropertyType,
    offerType: "all" as OfferType,
    priceRange: [0, 1000000],
    surfaceRange: [0, 500],
    bedrooms: "all" as string
  });

  useEffect(() => {
    setSearchQuery(urlQuery);
    setCurrentPage(1);
  }, [urlQuery]);

  // Filtrage et tri
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Recherche texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    // Filtre type
    if (filters.type !== "all") {
      result = result.filter(p => p.type === filters.type);
    }

    // Filtre offre
    if (filters.offerType !== "all") {
      result = result.filter(p => p.offerType === filters.offerType);
    }

    // Filtre prix
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtre surface
    result = result.filter(p => 
      p.surface >= filters.surfaceRange[0] && p.surface <= filters.surfaceRange[1]
    );

    // Filtre chambres
    if (filters.bedrooms !== "all") {
      const count = parseInt(filters.bedrooms);
      result = result.filter(p => p.bedrooms >= count);
    }

    // Tri
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "surface-asc":
        result.sort((a, b) => a.surface - b.surface);
        break;
      case "surface-desc":
        result.sort((a, b) => b.surface - a.surface);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }

    return result;
  }, [filters, sortBy, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setFilters({
      type: "all",
      offerType: "all",
      priceRange: [0, 1000000],
      surfaceRange: [0, 500],
      bedrooms: "all"
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors self-start">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                Nos Biens Immobiliers
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {filteredProperties.length} propriétés trouvées
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ville ou titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A7B66] focus:ring-2 focus:ring-[#9A7B66]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtres
                  </h3>
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-[#9A7B66] hover:underline"
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* Type de bien */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type de bien</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#9A7B66] outline-none text-sm"
                  >
                    <option value="all">Tous les types</option>
                    <option value="maison">Maison</option>
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="chambre">Chambre</option>
                  </select>
                </div>

                {/* Type d'offre */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type d'offre</label>
                  <div className="flex gap-2">
                    {["all", "vente", "location"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters({ ...filters, offerType: type as OfferType })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          filters.offerType === type
                            ? "bg-[#9A7B66] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {type === "all" ? "Tous" : type === "vente" ? "Vente" : "Location"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Budget max: ${filters.priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full accent-[#9A7B66]"
                  />
                </div>

                {/* Surface */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Surface min: {filters.surfaceRange[0]} m²
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={filters.surfaceRange[0]}
                    onChange={(e) => setFilters({ ...filters, surfaceRange: [parseInt(e.target.value), 500] })}
                    className="w-full accent-[#9A7B66]"
                  />
                </div>

                {/* Chambres */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Chambres minimum</label>
                  <div className="flex gap-2">
                    {["all", "1", "2", "3", "4+"].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFilters({ ...filters, bedrooms: num })}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          filters.bedrooms === num
                            ? "bg-[#9A7B66] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {num === "all" ? "Tous" : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-[#9A7B66] hover:text-[#9A7B66] transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-sm border-none bg-transparent focus:outline-none cursor-pointer font-medium text-gray-700"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="surface-asc">Surface croissante</option>
                    <option value="surface-desc">Surface décroissante</option>
                  </select>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" ? "bg-white shadow-sm text-[#9A7B66]" : "text-gray-500"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" ? "bg-white shadow-sm text-[#9A7B66]" : "text-gray-500"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid/List */}
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {currentProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    viewMode={viewMode}
                    onRent={handleRent}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {loading && currentProperties.length === 0 && (
              <div className="text-center py-20 text-gray-500">Chargement...</div>
            )}
            {!loading && currentProperties.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun bien trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-full bg-[#9A7B66] text-white font-medium hover:bg-[#8a6b56] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#9A7B66] hover:text-[#9A7B66] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-medium transition-all ${
                      currentPage === page
                        ? "bg-[#9A7B66] text-white shadow-lg shadow-[#9A7B66]/25"
                        : "border border-gray-200 hover:border-[#9A7B66] hover:text-[#9A7B66]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#9A7B66] hover:text-[#9A7B66] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilter 
        isOpen={showMobileFilter} 
        onClose={() => setShowMobileFilter(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </main>
  );
}
