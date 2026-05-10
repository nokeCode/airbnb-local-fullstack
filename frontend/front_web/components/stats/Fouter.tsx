export default function Footer() {
  return (
    <footer className="bg-[#2A2421] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold tracking-wide">IMMO-DIRECT</h3>
            <p className="text-sm text-white/70 mt-3">
              Location et vente de biens d exception avec une experience simple et rapide.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>Vente</li>
              <li>Location</li>
              <li>Chambres</li>
              <li>Conseil</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Societe</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>A propos</li>
              <li>Notre equipe</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>+242 00 000 00 00</li>
              <li>contact@immo-direct.com</li>
              <li>Brazzaville, Congo</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <span>© 2026 Immo Direct. Tous droits reserves.</span>
          <div className="flex items-center gap-4">
            <span>Mentions legales</span>
            <span>Politique de confidentialite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
