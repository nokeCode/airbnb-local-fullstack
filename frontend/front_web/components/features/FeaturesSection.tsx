import Navbar from '@/components/Navbar/Navbar';
import HeroSection from '@/components/Hero/HeroSection';
import StatsSection from '@/components/stats/StatsSection';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EAEAE8] p-4 md:p-8 flex items-center justify-center font-sans">
      
      <main className="relative w-full max-w-[1440px] h-[90vh] min-h-[850px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col">
        
        {/* Arrière-plan Ville avec plus de ciel */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/bg-city.jpg" // Ton image de ville avec beaucoup de ciel
            alt="City Skyline" 
            fill 
            className="object-cover object-center"
            priority
          />
          {/* Overlay sombre en bas pour faire ressortir les stats en blanc */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col h-full px-8 md:px-16">
          <Navbar />
          
          <div className="flex-grow flex flex-col">
            <HeroSection />
            
            {/* Nouveau bas de page épuré */}
            <div className="mt-auto">
              <StatsSection />
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}