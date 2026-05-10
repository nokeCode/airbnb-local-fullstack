export default function HeroText() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-serif leading-[0.9] tracking-tight text-[#2D2A26] uppercase">
        Trouvez<br />
        Votre Chez-<br />
        Vous Idéal<sup className="text-4xl top-[-0.5em] align-baseline">®</sup>
      </h1>
      <p className="text-lg md:text-xl font-medium mt-2 text-[#2D2A26]">
        / Achat, Vente, Location de Biens d'Exception /
      </p>
      <button className="mt-6 px-8 py-3.5 bg-[#2A2421] text-white rounded-full text-sm font-bold tracking-wider hover:bg-black transition-colors">
        RECHERCHER
      </button>
    </div>
  );
}