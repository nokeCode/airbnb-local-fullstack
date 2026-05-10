// ServiceCard.tsx
"use client";
import { motion } from "framer-motion";

// Icônes SVG personnalisées
const icons = {
    home: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    ),
    building: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 22V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v20"></path>
            <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2"></path>
            <path d="M20 12h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
        </svg>
    ),
    castle: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 20v-9a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v9"></path>
            <path d="M6 20V10"></path>
            <path d="M18 20V10"></path>
            <path d="M6 12h12"></path>
            <path d="M6 16h12"></path>
            <path d="M9 4v6"></path>
            <path d="M15 4v6"></path>
        </svg>
    )
};

export default function ServiceCard({ service }: { service: any }) {
    return (
        <motion.article
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        >
            {/* Bordure animée */}
            <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} style={{ padding: '2px' }}>
                <div className="absolute inset-0 bg-white rounded-xl"></div>
            </div>

            {/* Contenu compact */}
            <div className="relative p-6">
                {/* Icône SVG animée */}
                <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-12 h-12 mb-4 text-gray-700 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${service.color} group-hover:bg-clip-text transition-all duration-300`}
                >
                    {icons[service.icon as keyof typeof icons]}
                </motion.div>

                {/* Titre avec soulignement */}
                <h3 className="relative text-lg font-semibold mb-3 text-gray-900 inline-block">
                    {service.title}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${service.color} group-hover:w-full transition-all duration-300 ease-out`}></span>
                </h3>

                {/* Description courte */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                </p>

                {/* Lien animé */}
                <motion.div
                    className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    En savoir plus
                    <motion.svg 
                        className="w-4 h-4 ml-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                </motion.div>

                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </div>

            {/* Indicateur pulse */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} animate-pulse`}></div>
            </div>
        </motion.article>
    );
}