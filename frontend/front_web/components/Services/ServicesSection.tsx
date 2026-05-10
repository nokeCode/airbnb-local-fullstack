// ServicesSection.tsx
"use strict";
import ServiceCard from "./ServiceCard";

const services = [
    {
        title: "Location de Maisons",
        description: "Trouvez la maison de vos rêves parmi notre large sélection de propriétés à louer.",
        icon: "home",
        color: "from-amber-500 to-orange-500"
    },
    {
        title: "Location d'Appartements",
        description: "Explorez nos appartements modernes et confortables disponibles à la location.",
        icon: "building",
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "Location de Villas",
        description: "Découvrez nos villas luxueuses pour une expérience de location exceptionnelle.",
        icon: "castle",
        color: "from-emerald-500 to-teal-500"
    }
];

export default function ServicesSection() {
    return (
        <section className="relative py-12 px-4 md:px-16 overflow-hidden">
            {/* Éléments de fond décoratifs */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[#9A7B66]/5 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-amber-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* En-tête de section compact */}
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-block">
                        <span className="bg-[#9A7B66]/10 text-[#9A7B66] text-sm font-medium px-4 py-1.5 rounded-full">
                            ✦ Ce que nous proposons
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                        Nos Services
                    </h2>
                    <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                        Découvrez nos services de location immobilière adaptés à vos besoins. 
                        Des solutions sur mesure pour chaque style de vie.
                    </p>
                </div>

                {/* Grille de cartes compacte */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}