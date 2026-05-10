import Image from 'next/image';

export default function HeroVisual() {
  return (
    <div className="relative bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 pb-6 shadow-2xl max-w-[32rem] w-full">
      {/* Badges */}
      <div className="flex gap-2 mb-6">
        <span className="px-4 py-1.5 rounded-full border border-gray-300 text-[10px] font-bold tracking-wider uppercase">Location</span>
        <span className="px-4 py-1.5 rounded-full border border-gray-300 text-[10px] font-bold tracking-wider uppercase">Vente</span>
        <span className="px-4 py-1.5 rounded-full bg-[#9A7B66] text-white text-[10px] font-bold tracking-wider uppercase">Nouveauté</span>
      </div>

      <h2 className="text-[2rem] font-serif leading-[1.1] mb-2 text-[#2D2A26]">
        Appartement de<br/>Standing avec Vue
      </h2>
      <p className="text-black font-medium text-sm mb-6">Visite virtuelle et plans disponibles.</p>

      {/* Image du salon */}
      <div className="relative h-full w-full rounded-2xl overflow-hidden">
        <Image src="/salon.png" alt="Salon intérieur" fill className="object-cover" />
      </div>

      {/* Vignette Roomtour flottante */}
      <div className="absolute top-8 -right-12 bg-[#F3EFEA] p-3 rounded-3xl shadow-xl flex flex-col items-center gap-3 w-36">
        <span className="text-[10px] font-bold text-[#2D2A26] tracking-widest uppercase mt-2">Roomtour</span>
        <div className="relative w-full h-24 rounded-2xl overflow-hidden group cursor-pointer">
          <Image src="/roomtour.jpg" alt="Chambre" fill className="object-cover brightness-75 group-hover:brightness-90 transition" />
          {/* Bouton Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#A48976] rounded-full p-2.5 shadow-lg">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}