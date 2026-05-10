export default function StatsSection() {
  const stats = [
    { value: "10", label: "Years of\nexperience" },
    { value: "1K+", label: "Beautiful\ndestinations" },
    { value: "4K+", label: "Happy\ncustomers" },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between py-12 px-4 border-t border-white/20">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center w-full justify-center group">
          <div className="flex items-center gap-6">
            {/* Le Chiffre */}
            <span className="text-6xl md:text-7xl font-bold tracking-tighter text-white">
              {stat.value}
            </span>
            
            {/* Le Texte (on utilise whitespace-pre-line pour gérer les retours à la ligne) */}
            <span className="text-sm md:text-base font-medium leading-tight text-white/90 uppercase tracking-wide whitespace-pre-line">
              {stat.label}
            </span>
          </div>

          {/* La ligne de séparation (sauf après le dernier élément) */}
          {index < stats.length - 1 && (
            <div className="hidden md:block h-16 w-[1px] bg-white/30 mx-auto" />
          )}
        </div>
      ))}
    </div>
  );
}