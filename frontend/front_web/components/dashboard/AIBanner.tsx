'use client';

import { Sparkles, ChevronRight, TrendingUp, Calculator } from 'lucide-react';

export function AIBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Sparkles className="text-yellow-300" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Assistant IA Immobilier</h4>
            <p className="text-indigo-100 text-sm max-w-md">
              Analysez la rentabilité de vos biens, prévoyez les vacances locatives et optimisez vos loyers avec l'IA.
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
            <Calculator size={16} />
            Simuler un loyer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg">
            <TrendingUp size={16} />
            Analyse rentabilité
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}