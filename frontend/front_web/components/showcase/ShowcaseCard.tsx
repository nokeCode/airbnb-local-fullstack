"use client";

import { motion } from "framer-motion";
import { Home, BedDouble, Maximize, Heart, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Property {
  id?: number;
  image: string;
  title: string;
  location: string;
  price: number;
  type: "maison" | "chambre";
  offerType: "vente" | "location";
  surface: number;
  bedrooms: number;
}

const ShowcaseCard = ({ id, image, title, location, price, type, offerType, surface, bedrooms }: Property) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              offerType === "vente"
                ? "bg-[#9A7B66] text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {offerType === "vente" ? "À vendre" : "À louer"}
          </motion.span>
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Type badge bottom */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
            {type === "maison" ? "Maison" : "Chambre"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-[#9A7B66] transition-colors">
            {title}
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#9A7B66] group-hover:text-white transition-all duration-300"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>

        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-[#9A7B66]" />
            {surface} m²
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-[#9A7B66]" />
            {bedrooms} ch.
          </span>
          <span className="flex items-center gap-1.5">
            <Home className="w-4 h-4 text-[#9A7B66]" />
            {type === "maison" ? "Maison" : "Chambre"}
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900">
              <span className="font-bold text-xl">{price.toLocaleString()} FCFA</span>
              {offerType === "location" && (
                <span className="text-gray-400 text-sm font-medium"> /mois</span>
              )}
            </p>
          </div>
          <Link href={`/property/${id ?? 1}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-[#9A7B66] transition-colors duration-300 shadow-lg shadow-gray-900/20 hover:shadow-[#9A7B66]/30"
            >
              Voir détail
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#9A7B66]/20 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default ShowcaseCard;
