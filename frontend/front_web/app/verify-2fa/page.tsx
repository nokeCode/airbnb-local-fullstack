'use client';

import { TwoFactorForm } from "@/components/auth/TwoFactorForm";
import { AuthCarousel } from "@/components/auth/AuthCarousel";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function TwoFactorAuthPage() {

  const params = useSearchParams();
  const email = params.get("email");
  return (
    <div className="min-h-screen bg-[#EAEAE8] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Partie gauche - Formulaire */}
        <div className="bg-[#F5F1EB] flex items-center justify-center p-10 lg:p-12">
          <TwoFactorForm email={email ?? ""} />
        </div>
        
        {/* Partie droite - Carousel */}
        <div className="relative overflow-hidden">
          <AuthCarousel />
        </div>
      </div>
    </div>
  );
}
