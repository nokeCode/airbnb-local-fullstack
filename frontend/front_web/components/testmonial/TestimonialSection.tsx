// TestimonialsSection.tsx
"use client";

import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
    name: "Savannah Nguyen",
    role: "Propriétaire",
    initials: "SN",
    color: "#e74c3c",
  },
  {
    text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
    name: "Savannah Nguyen",
    role: "Locataire",
    initials: "SN",
    color: "#2ecc71",
  },
  {
    text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
    name: "Savannah Nguyen",
    role: "Agent immobilier",
    initials: "SN",
    color: "#3498db",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#9A7B66]/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/10 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        {/* En-tête minimaliste */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-medium text-[#9A7B66] bg-[#9A7B66]/10 px-3 py-1 rounded-full mb-3">
            ✦ Témoignages
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
            Avis Clients
          </h2>
          <div className="w-16 h-0.5 bg-[#9A7B66]/30 mx-auto mt-3"></div>
        </div>

        {/* Grille de témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="opacity-0 animate-[fade-in-up_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;