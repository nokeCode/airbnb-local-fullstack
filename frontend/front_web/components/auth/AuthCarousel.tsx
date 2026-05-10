'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/maison1.jpg',
    quote: "With App, I can manage my global property portfolio and complete secure transactions in minutes — all with crypto. It's the perfect blend of real estate and blockchain innovation.",
    author: 'Liam Smith',
    role: 'Investor',
    company: 'Global Real Estate Investment Firm'
  },
  {
    image: '/chambre1.avif',
    quote: "The platform revolutionized how we handle international property deals. The security and speed are unmatched in the industry.",
    author: 'Sarah Chen',
    role: 'Property Manager',
    company: 'Luxury Estates International'
  },
  {
    image: '/maison9.avif',
    quote: "Finally, a solution that understands the needs of modern real estate investors. The crypto integration is seamless and intuitive.",
    author: 'Marcus Johnson',
    role: 'CEO',
    company: 'Metro Property Group'
  },
  {
    image: '/chambre2.avif',
    quote: "From documentation to payment processing, everything is streamlined. Our transaction time reduced by 70% since we started using this platform.",
    author: 'Elena Rodriguez',
    role: 'Investment Director',
    company: 'Premium Living Co.'
  },
  {
    image: '/maison8.jpg',
    quote: "The transparency and security features give me peace of mind when handling high-value properties across multiple countries.",
    author: 'James Wilson',
    role: 'Private Investor',
    company: 'Wilson Holdings'
  }
];

export function AuthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleManualNav = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    if (direction === 'prev') prevSlide();
    else nextSlide();
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-full">
      {/* Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={`Property ${index + 1}`}
            fill
            className="object-cover bg-black"
            priority={index === 0}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      ))}

      {/* Content Card */}
      <div className="absolute bottom-12 left-12 right-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <blockquote className="text-white text-lg leading-relaxed mb-6">
            "{slides[currentSlide].quote}"
          </blockquote>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-white font-semibold text-lg">
                {slides[currentSlide].author}
              </div>
              <div className="text-white/80 text-sm">
                {slides[currentSlide].role}
              </div>
              <div className="text-white/60 text-sm">
                {slides[currentSlide].company}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => handleManualNav('prev')}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleManualNav('next')}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex gap-2 mt-6 justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
