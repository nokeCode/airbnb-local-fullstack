import Link from "next/link";

const links = [
  { href: "/vente", label: "VENTE" },
  { href: "/location", label: "LOCATION" },
  { href: "/chambres", label: "CHAMBRES" },
  { href: "/agence", label: "Agence" },
];

export default function Navlinks() {
  return (
    <div className="hidden md:flex items-center gap-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[#5A524D] hover:text-[#3D3530] transition-colors text-base font-bold tracking-wide"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
