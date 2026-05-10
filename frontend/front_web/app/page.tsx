import Navbar from '@/components/Navbar/Navbar';
import HeroSection from '@/components/Hero/HeroSection';
import StatsSection from '@/components/stats/StatsSection';
import ServicesSection from '@/components/services/ServicesSection';
import Image from 'next/image';
import ShowcaseSection from '@/components/showcase/ShowcaseSection';
import TestimonialsSection from '@/components/testmonial/TestimonialSection';
import Footer from '@/components/stats/Fouter';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EAEAE8]">

      {/* HERO */}
      <main className="relative w-full max-w-[1440px] h-[90vh] min-h-[850px] overflow-hidden bg-white shadow-2xl flex flex-col">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/bg_landscape_ville.png"
            alt="City Skyline"
            fill
            className="object-cover object-center"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-8 md:px-16">

          <Navbar />

          <div className="flex-grow flex flex-col">

            <HeroSection />

            <div className="mt-auto">
              <StatsSection />
            </div>

          </div>
        </div>

      </main>

      {/* SERVICES SECTION */}
      <ServicesSection />

      {/* SECTION BLANCHE (DESTINATIONS) */}
      <div className="bg-white mt-10">
        <ShowcaseSection />
      </div>

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
