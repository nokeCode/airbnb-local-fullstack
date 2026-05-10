// components/Hero/HeroMedia.tsx
import Image from "next/image";

export default function HeroMedia() {
  return (
    <div className="relative">
      {/* Tags */}
      <div className="flex gap-2 mb-2">
        <span className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-stone-600 border border-stone-200">
          LOCATION
        </span>
        <span className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-stone-600 border border-stone-200">
          VENTE
        </span>
        <span className="px-4 py-1.5 bg-stone-700 rounded-full text-xs font-medium text-white">
          NOUVEAUTÉ
        </span>
      </div>

      {/* Title and description */}
      <div className="mb-2">
        <h3 className="text-xl font-medium text-stone-800 mb-1">
          Appartement de<br />Standing avec Vue
        </h3>
        <p className="text-sm text-stone-500">
          Visite virtuelle et plans disponibles.
        </p>
      </div>

      {/* Main Image */}
      <div className="relative h-40 overflow-visible">
        <div className="absolute left-0 right-0 -bottom-12 h-64 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/house.webp"
            alt="Appartement de standing"
            fill
            className="object-cover object-center"
            priority
          />
          
          {/* Room tour badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-stone-600 mb-1">ROOMTOUR</p>
            <div className="w-16 h-10 bg-stone-200 rounded overflow-hidden relative">
              <Image
                src="/house.webp"
                alt="Room tour thumbnail"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Play button */}
          <button className="absolute top-1/2 right-20 transform -translate-y-1/2 w-12 h-12 bg-stone-400/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-stone-400 transition-colors">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
