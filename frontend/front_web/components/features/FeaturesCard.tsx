export default function FeaturesCard() {
  return (
    <div className="bg-[#9A7B66] rounded-tr-[2.5rem] rounded-tl-[2.5rem] md:rounded-tl-none p-8 flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <h3 className="text-[1.7rem] font-serif leading-tight mb-2 text-white">Expertise &<br/>Accompagnement</h3>
        <p className="text-sm font-light text-white/90">Pour tous vos projets<br/>immobiliers.</p>
      </div>
      
      <div className="flex items-end justify-between mt-2">
        <p className="text-xs text-white/90">Évaluation Immobilière<br/>& Gestion de Biens</p>
        {/* Icône factice remplaçant le dessin des clés/plans */}
        <div className="w-16 h-16 border border-white/40 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
        </div>
      </div>
    </div>
  );
}