// TestimonialCard.tsx
"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  text: string;
  name: string;
  role?: string;
  initials: string;
  color: string;
}

const TestimonialCard = ({ text, name, role, initials, color }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Bordure décorative au survol */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}20, transparent)`,
        }}
      ></div>

      {/* Contenu */}
      <div className="relative">
        {/* Guillemets décoratifs */}
        <div className="text-3xl leading-none mb-2 opacity-20" style={{ color }}>
          "
        </div>

        {/* Texte du témoignage */}
        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
          {text}
        </p>

        {/* Séparateur */}
        <div className="w-8 h-0.5 bg-gray-200 mb-4 group-hover:w-12 group-hover:bg-[#9A7B66] transition-all duration-300"></div>

        {/* Profil et notes */}
        <div className="flex items-center gap-2.5">
          {/* Avatar avec animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
            style={{ backgroundColor: color, color: "white" }}
          >
            {initials}
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Étoiles */}
            <div className="flex gap-0.5 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Nom et rôle */}
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-gray-900 text-xs truncate">
                {name}
              </p>
              {role && (
                <>
                  <span className="text-gray-300">•</span>
                  <p className="text-[#9A7B66] text-[10px] truncate">
                    {role}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Effet de brillance */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </motion.div>
  );
};

export default TestimonialCard;