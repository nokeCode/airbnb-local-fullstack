// ShowcaseSection.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ShowcaseCard, { type Property } from "./ShowcaseCard";

const properties: (Property & { id: number })[] = [
  {
    id: 1,
    image: "/bg_landscape_ville.png",
    title: "Villa Moderne Luxe",
    location: "Brazzaville, Congo",
    price: 250000,
    type: "maison",
    offerType: "vente",
    surface: 320,
    bedrooms: 5,
  },
  {
    id: 2,
    image: "/salon.png",
    title: "Chambre Confort Premium",
    location: "Pointe-Noire, Congo",
    price: 450,
    type: "chambre",
    offerType: "location",
    surface: 25,
    bedrooms: 1,
  },
  {
    id: 3,
    image: "/hero-house.jpg",
    title: "Appartement Centre-Ville",
    location: "Brazzaville, Congo",
    price: 1200,
    type: "maison",
    offerType: "location",
    surface: 85,
    bedrooms: 3,
  },
  {
    id: 4,
    image: "/roomtour.jpg",
    title: "Suite Lumineuse",
    location: "Dolisie, Congo",
    price: 300,
    type: "chambre",
    offerType: "location",
    surface: 30,
    bedrooms: 1,
  },
  {
    id: 5,
    image: "/bg_landscape.png",
    title: "Villa Piscine Tropicale",
    location: "Pointe-Noire, Congo",
    price: 380000,
    type: "maison",
    offerType: "vente",
    surface: 450,
    bedrooms: 6,
  },
  {
    id: 6,
    image: "/house.webp",
    title: "Chambre Vue Panoramique",
    location: "Brazzaville, Congo",
    price: 550,
    type: "chambre",
    offerType: "location",
    surface: 35,
    bedrooms: 1,
  },
];

type Filter = "tous" | "maison" | "chambre";

const ShowcaseSection = () => {
  const [filter, setFilter] = useState<Filter>("tous");

  const filtered = filter === "tous" ? properties : properties.filter((p) => p.type === filter);

  const tabs: { label: string; value: Filter }[] = [
    { label: "Tous", value: "tous" },
    { label: "Maisons", value: "maison" },
    { label: "Chambres", value: "chambre" },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#9A7B66]/10 text-[#9A7B66] text-sm font-medium mb-4">
            ✦ Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            Nos Biens Disponibles
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Découvrez notre sélection exclusive de maisons et chambres à vendre ou à louer
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 mb-10"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === tab.value
                  ? "bg-[#9A7B66] text-white shadow-lg shadow-[#9A7B66]/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#9A7B66] hover:text-[#9A7B66]"
              }`}
            >
              {tab.label}
              {filter === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#9A7B66] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((property, index) => (
              <motion.div
                key={property.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <ShowcaseCard {...property} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href={`/bien/`}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-3.5 rounded-full bg-white border-2 border-gray-200 text-gray-800 font-semibold hover:border-[#9A7B66] hover:text-[#9A7B66] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Voir plus
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
