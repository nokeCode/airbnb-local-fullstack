// app/property/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import { 
  BedDouble, 
  Bath, 
  Maximize, 
  Home, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Share2, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  User
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getProperty } from "@/services/propertiesService";

// Types
interface PropertyDetails {
  id: string;
  image: string;
  gallery: string[];
  title: string;
  location: string;
  price: number;
  type: "maison" | "chambre" | "appartement" | "villa";
  offerType: "vente" | "location";
  surface: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  description: string;
  features: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Données mock (à remplacer par API)
const propertyData: PropertyDetails = {
  id: "1",
  image: "/bg_landscape_ville.png",
  gallery: [
    "/bg_landscape_ville.png",
    "/salon.png",
    "/hero-house.jpg",
    "/roomtour.jpg",
    "/bg_landscape.png"
  ],
  title: "Villa Moderne Luxe",
  location: "Brazzaville, Congo",
  price: 250000,
  type: "villa",
  offerType: "vente",
  surface: 320,
  bedrooms: 5,
  bathrooms: 4,
  yearBuilt: 2022,
  description: "Magnifique villa moderne située dans un quartier résidentiel prestigieux de Brazzaville. Cette propriété d'exception offre des espaces de vie généreux, des finitions haut de gamme et une vue panoramique sur la ville. Parfaite pour une famille nombreuse ou les amateurs d'espaces.",
  features: [
    "Piscine privée",
    "Jardin paysager",
    "Garage double",
    "Système de sécurité",
    "Climatisation centrale",
    "Cuisine équipée",
    "Terrasse panoramique",
    "Salle de sport",
    "Bureau",
    "Dressing"
  ],
  agent: {
    name: "Jean-Marc Koumba",
    phone: "+242 06 123 4567",
    email: "jean-marc@immobilier-congo.com",
    image: "/agent.jpg"
  },
  coordinates: {
    lat: -4.2634,
    lng: 15.2429
  }
};

const normalizeOffer = (value?: string): PropertyDetails["offerType"] => {
  const v = (value || '').toLowerCase();
  if (v.includes('vente') || v.includes('sale')) return 'vente';
  return 'location';
};

const normalizeType = (value?: string): PropertyDetails["type"] => {
  const v = (value || '').toLowerCase();
  if (v.includes('maison')) return 'maison';
  if (v.includes('chambre') || v.includes('studio')) return 'chambre';
  if (v.includes('villa')) return 'villa';
  return 'appartement';
};

const mapApiPropertyToDetails = (raw: any): PropertyDetails => {
  const images = Array.isArray(raw?.images) ? raw.images : [];
  const gallery = images
    .map((img: any) => img?.image || img?.url || img?.file)
    .filter(Boolean);
  const firstImage = raw?.image || raw?.thumbnail || raw?.main_image || gallery[0];
  const owner = raw?.owner || raw?.user || raw?.agent || raw?.proprietaire || {};
  return {
    id: String(raw?.id ?? ''),
    image: firstImage || "/maison1.jpg",
    gallery: gallery.length ? gallery : [firstImage || "/maison1.jpg"],
    title: raw?.title || raw?.name || "Bien",
    location: raw?.address || raw?.location || raw?.city || "",
    price: Number(raw?.price ?? raw?.rent ?? raw?.monthly_rent ?? 0),
    type: normalizeType(raw?.type || raw?.category),
    offerType: normalizeOffer(raw?.offer_type || raw?.offerType || raw?.type_offer || raw?.status),
    surface: Number(raw?.surface ?? raw?.area ?? 0),
    bedrooms: Number(raw?.bedrooms ?? raw?.rooms ?? 0),
    bathrooms: Number(raw?.bathrooms ?? raw?.baths ?? 0),
    yearBuilt: Number(raw?.year_built ?? raw?.construction_year ?? new Date().getFullYear()),
    description: raw?.description || "",
    features: Array.isArray(raw?.features) ? raw.features : [],
    agent: {
      name: owner?.name || owner?.full_name || "Proprietaire",
      phone: owner?.phone || owner?.tel || "",
      email: owner?.email || "",
      image: owner?.avatar || owner?.image || "/agent.jpg",
    },
    coordinates: {
      lat: Number(raw?.lat ?? raw?.latitude ?? 0),
      lng: Number(raw?.lng ?? raw?.longitude ?? 0),
    },
  };
};

// Composant Galerie
const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div>
    <Navbar />
    {/* Main Image Viewer */}
      <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt="Property"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          Voir toutes les photos
        </button>

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentIndex(idx)}
            className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentIndex ? "border-[#9A7B66]" : "border-transparent"
            }`}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </motion.button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={images[currentIndex]}
              alt="Fullscreen"
              fill
              className="object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant Formulaire de Contact
const ContactForm = ({ agent, price, offerType }: { agent: PropertyDetails["agent"], price: number, offerType: string }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    visitDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24"
    >
      {/* Price Header */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <p className="text-gray-500 text-sm mb-1">Prix {offerType === "location" ? "mensuel" : "total"}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            ${price.toLocaleString()}
          </span>
          {offerType === "location" && (
            <span className="text-gray-500">/mois</span>
          )}
        </div>
      </div>

      {/* Agent Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#9A7B66]">
          <Image src={agent.image} alt={agent.name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{agent.name}</h4>
          <p className="text-sm text-gray-500">Agent immobilier</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#9A7B66] text-white font-medium hover:bg-[#8a6b56] transition-colors"
        >
          <Phone className="w-4 h-4" />
          Appeler
        </a>
        <a
          href={`mailto:${agent.email}`}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A7B66] focus:ring-2 focus:ring-[#9A7B66]/20 outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A7B66] focus:ring-2 focus:ring-[#9A7B66]/20 outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Téléphone"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A7B66] focus:ring-2 focus:ring-[#9A7B66]/20 outline-none transition-all"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Date de visite souhaitée"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A7B66] focus:ring-2 focus:ring-[#9A7B66]/20 outline-none transition-all"
            value={formData.visitDate}
            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Votre message..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A7B66] focus:ring-2 focus:ring-[#9A7B66]/20 outline-none transition-all resize-none"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9A7B66] to-[#ff7a2d] text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all"
        >
          Envoyer ma demande
        </motion.button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        En envoyant ce formulaire, vous acceptez notre politique de confidentialité
      </p>
    </motion.div>
  );
};

// Page Principale
export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    let mounted = true;
    const rawId = (params as any)?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) {
      setLoading(false);
      return;
    }
    getProperty(id)
      .then((data) => {
        if (!mounted) return;
        setProperty(data ? mapApiPropertyToDetails(data) : null);
      })
      .catch(() => {
        if (!mounted) return;
        setProperty(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Bien introuvable</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Accueil</span>
            <ChevronRight className="w-4 h-4" />
            <span>Biens</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#9A7B66] font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2"
            >
              {property.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-gray-500"
            >
              <MapPin className="w-5 h-5 text-[#9A7B66]" />
              {property.location}
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRent(property.id)}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Louer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#9A7B66] hover:text-[#9A7B66] transition-all shadow-sm"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8"
        >
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
            property.offerType === "vente" 
              ? "bg-[#9A7B66] text-white" 
              : "bg-emerald-500 text-white"
          }`}>
            {property.offerType === "vente" ? "À vendre" : "À louer"}
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 capitalize">
            {property.type}
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Construit en {property.yearBuilt}
          </span>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={property.gallery} />

            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </motion.section>

            {/* Caractéristiques */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-[#9A7B66]/5 transition-colors group">
                  <Maximize className="w-8 h-8 text-[#9A7B66] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900">{property.surface}</span>
                  <span className="text-sm text-gray-500">m² Surface</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-[#9A7B66]/5 transition-colors group">
                  <BedDouble className="w-8 h-8 text-[#9A7B66] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900">{property.bedrooms}</span>
                  <span className="text-sm text-gray-500">Chambres</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-[#9A7B66]/5 transition-colors group">
                  <Bath className="w-8 h-8 text-[#9A7B66] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900">{property.bathrooms}</span>
                  <span className="text-sm text-gray-500">Salles de bain</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-[#9A7B66]/5 transition-colors group">
                  <Home className="w-8 h-8 text-[#9A7B66] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900 capitalize">{property.type}</span>
                  <span className="text-sm text-gray-500">Type</span>
                </div>
              </div>
            </motion.section>

            {/* Équipements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Équipements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Localisation */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Localisation</h2>
              <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100">
                {/* Placeholder pour la carte - intégrer Google Maps ou Leaflet ici */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#9A7B66] mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">{property.location}</p>
                    <p className="text-sm text-gray-400 mt-1">Carte interactive à intégrer</p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <ContactForm 
              agent={property.agent} 
              price={property.price} 
              offerType={property.offerType} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
