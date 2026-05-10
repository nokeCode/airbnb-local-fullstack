// components/onboarding/OnboardingContainer.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProgressBar } from './ProgressBar';
import { RoleQuestion } from './questions/RoleQuestion';
import { TenantQuestions } from './questions/tenant/TenantQuestions';
import { AgentQuestions } from './questions/agent/AgentQuestions';
import { CompleteStep } from './questions/CompleteStep';
import { ChevronLeft, ChevronRight, Check, Home } from 'lucide-react';
import { createProfile } from '@/services/usersService';

export type OnboardingData = {
  role: 'tenant' | 'agent' | 'owner' | 'investor' | 'manager' | '';
  // Champs locataire
  tenantBudget?: string;
  tenantLocation?: string[];
  tenantMoveInDate?: string;
  tenantPropertyType?: string[];
  tenantAmenities?: string[];
  // Champs agent
  agentExperience?: string;
  agentSpecialty?: string[];
  agentAgency?: string;
  agentZone?: string[];
  agentTransactions?: string;
  // Commun
  timeline: string;
};

const initialData: OnboardingData = {
  role: '',
  timeline: '',
};

export function OnboardingContainer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Définition dynamique des étapes selon le rôle
  const getSteps = () => {
    const baseSteps = [
      { id: 'role', component: RoleQuestion, title: 'Votre profil' },
    ];

    if (data.role === 'tenant') {
      baseSteps.push(
        { id: 'tenant-budget', component: TenantQuestions.BudgetStep, title: 'Votre budget' },
        { id: 'tenant-location', component: TenantQuestions.LocationStep, title: 'Où cherchez-vous ?' },
        { id: 'tenant-property', component: TenantQuestions.PropertyTypeStep, title: 'Type de bien' },
        { id: 'tenant-amenities', component: TenantQuestions.AmenitiesStep, title: 'Vos critères' },
        { id: 'tenant-date', component: TenantQuestions.MoveInDateStep, title: 'Quand emménager ?' }
      );
    } else if (data.role === 'agent') {
      baseSteps.push(
        { id: 'agent-experience', component: AgentQuestions.ExperienceStep, title: 'Votre expérience' },
        { id: 'agent-specialty', component: AgentQuestions.SpecialtyStep, title: 'Votre spécialité' },
        { id: 'agent-zone', component: AgentQuestions.ZoneStep, title: 'Vos zones' },
        { id: 'agent-agency', component: AgentQuestions.AgencyStep, title: 'Votre structure' },
        { id: 'agent-transactions', component: AgentQuestions.TransactionsStep, title: 'Votre activité' }
      );
    }

    baseSteps.push({ id: 'complete', component: CompleteStep, title: 'C\'est parti !' });
    return baseSteps;
  };

  const steps = getSteps();
  const CurrentStepComponent = steps[currentStep].component;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Si on change de rôle, on réinitialise les étapes spécifiques
    if (field === 'role') {
      setCurrentStep(0);
    }
  };

  const canProceed = () => {
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case 'role': return !!data.role;
      case 'tenant-budget': return !!data.tenantBudget;
      case 'tenant-location': return (data.tenantLocation?.length || 0) > 0;
      case 'tenant-property': return (data.tenantPropertyType?.length || 0) > 0;
      case 'tenant-amenities': return true; // Optionnel
      case 'tenant-date': return !!data.tenantMoveInDate;
      case 'agent-experience': return !!data.agentExperience;
      case 'agent-specialty': return (data.agentSpecialty?.length || 0) > 0;
      case 'agent-zone': return (data.agentZone?.length || 0) > 0;
      case 'agent-agency': return !!data.agentAgency;
      case 'agent-transactions': return !!data.agentTransactions;
      case 'complete': return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      console.log('Onboarding data:', data);
      // Mappe les rôles onboarding vers les rôles backend (admin/owner/tenant).
      const backendRole =
        data.role === 'tenant' ? 'tenant' : data.role ? 'owner' : 'tenant';

      // Création du profil côté backend (statut + onboarding).
      const profile = await createProfile({
        role: backendRole,
        onboarding_completed: true,
      });

      // Redirection selon le rôle retourné par le backend.
      if (profile.role === 'tenant') {
        router.push('/client');
      } else if (profile.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div 
      className="min-h-screen w-full flex items-start md:items-center justify-center p-4 md:p-8 relative overflow-x-hidden"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Contenu principal encadré */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Card principale avec bordure, ombre et fond blanc */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
          
          {/* Header avec image décorative */}
          <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
            </div>
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Home className="w-6 h-6" />
                <span className="text-sm font-medium uppercase tracking-wider opacity-90">Bienvenue</span>
              </div>
              <h1 className="text-2xl font-bold">Créez votre profil</h1>
            </div>
          </div>

          {/* Corps du formulaire */}
          <div className="p-8 md:p-10">
            {/* Progression */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    currentStep === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Retour
                </button>
                
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  Étape {currentStep + 1} sur {steps.length}
                </span>
              </div>

              <ProgressBar progress={progress} />
              
              <motion.h2 
                key={currentStep}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-gray-900 mt-6 text-center"
              >
                {steps[currentStep].title}
              </motion.h2>
            </div>

            {/* Zone de questions avec hauteur fixe pour éviter les sauts */}
            <div className="relative min-h-[320px] mb-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full"
                >
                  <CurrentStepComponent 
                    data={data} 
                    updateData={updateData} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer avec indicateurs et bouton */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
              {/* Dots de progression */}
              <div className="flex gap-2 order-2 sm:order-1">
                {steps.map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      width: idx === currentStep ? 24 : 8,
                      backgroundColor: idx <= currentStep ? '#111827' : '#D1D5DB'
                    }}
                    className="h-2 rounded-full transition-all duration-300"
                  />
                ))}
              </div>

              {/* Bouton principal */}
              <div className="order-1 sm:order-2">
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                      canProceed()
                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continuer
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        Terminer
                        <Check size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Texte footer */}
        <p className="text-center text-white/80 text-sm mt-6 drop-shadow-md">
          En continuant, vous acceptez nos conditions d'utilisation
        </p>
      </motion.div>
    </div>
  );
}
