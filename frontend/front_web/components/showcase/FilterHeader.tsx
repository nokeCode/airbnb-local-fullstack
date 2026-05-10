// FilterHeader.tsx
"use client";

import { motion } from "framer-motion";

export default function FilterHeader() {
  const categories = ['London', 'Bangkok', 'England', 'Singapore', 'Italy'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 text-gray-900">
        Find Your Dream{" "}
        <span className="bg-gradient-to-r from-[#9A7B66] to-[#ff7a2d] bg-clip-text text-transparent">
          Destination
        </span>
      </h1>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((city, index) => (
          <motion.button
            key={city}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              index === 0
                ? 'bg-gradient-to-r from-[#9A7B66] to-[#ff7a2d] text-white shadow-lg shadow-orange-500/25'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#9A7B66] hover:text-[#9A7B66] hover:shadow-md'
            }`}
          >
            {city}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}