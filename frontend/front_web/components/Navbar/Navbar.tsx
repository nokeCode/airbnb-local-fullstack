import Link from "next/link";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/10">
      <Logo />
      <Navlinks />
      <form action="/bien" method="get" className="hidden lg:flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2.5">
        <input
          type="text"
          name="q"
          placeholder="Rechercher un bien..."
          className="bg-transparent text-sm  placeholder-black/70 outline-none w-48"
        />
        <button
          type="submit"
          className="text-black/90 hover:text-white hover:scale-110 transition-all"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link
          href="/login"
          className="uppercase tracking-wide hover:text-gray-500 border border-white/30 rounded-full px-6 py-2.5 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className="uppercase tracking-wide hover:text-gray-500 border border-white/30 rounded-full px-6 py-2.5 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
        >
          Inscription
        </Link>
        <Link
          href="/verify-2fa"
          className="uppercase tracking-wide border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500"
        >
          CONTACT
        </Link>
      </div>
    </nav>
  );
}