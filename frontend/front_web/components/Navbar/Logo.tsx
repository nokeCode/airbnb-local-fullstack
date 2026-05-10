export default function Logo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {/* Icône d'immeuble simple en SVG */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M13 3l8 4v14" />
        <path d="M9 11v10" />
      </svg>
      <span className="font-sans font-medium text-lg tracking-wide">IMMO-DIRECT</span>
    </div>
  );
}