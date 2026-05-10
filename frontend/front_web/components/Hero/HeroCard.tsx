// components/Hero/HeroCard.tsx
import Image from "next/image";
import HeroMedia from "./HeroMedia";
const tabs = [
  { label: "Interior", active: false },
  { label: "Design", active: false },
  { label: "3D", active: true },
];

export default function HeroCard() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-white/50 max-w-md overflow-visible">
      <HeroMedia />
    </div>
  );
}
