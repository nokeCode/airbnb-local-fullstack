import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCarousel } from "@/components/auth/AuthCarousel";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#EAEAE8] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-[#F5F1EB] rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Partie gauche - Formulaire */}
        <div className="bg-[#F5F1EB] flex items-center justify-center p-10 lg:p-12">
          <LoginForm />
        </div>
        
        {/* Partie droite - Carousel (encadrée, arrondie, superposée) */}
        <div className="relative overflow-hidden rounded-[26px] m-6 border border-white/30 shadow-2xl shadow-black/25  backdrop-blur-sm shadow-xl ">
          <AuthCarousel />
        </div>
      </div>
    </div>
  );
}
