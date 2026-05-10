import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthCarousel } from "@/components/auth/AuthCarousel";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#EAEAE8] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Partie gauche - Formulaire */}
        <div className="bg-[#F5F1EB] flex items-center justify-center p-10 lg:p-12 overflow-y-auto">
          <RegisterForm />
        </div>
        
        {/* Partie droite - Carousel */}
        <div className="relative overflow-hidden">
          <AuthCarousel />
        </div>
      </div>
    </div>
  );
}
