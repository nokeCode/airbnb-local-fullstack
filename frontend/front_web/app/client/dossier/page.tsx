'use client';

import { FileText, Upload, CheckCircle, AlertCircle, User, Briefcase, CreditCard, Home, Shield, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';

const sections = [
  {
    id: 'identity',
    title: 'Identité',
    icon: User,
    completed: true,
    documents: [
      { name: 'Carte d\'identité', status: 'verified', date: '15/03/2024' },
      { name: 'Justificatif de domicile', status: 'verified', date: '15/03/2024' },
    ],
  },
  {
    id: 'professional',
    title: 'Situation professionnelle',
    icon: Briefcase,
    completed: true,
    documents: [
      { name: 'Contrat de travail', status: 'verified', date: '15/03/2024' },
      { name: '3 derniers bulletins de salaire', status: 'verified', date: '15/03/2024' },
    ],
  },
  {
    id: 'financial',
    title: 'Situation financière',
    icon: CreditCard,
    completed: false,
    documents: [
      { name: 'Avis d\'imposition', status: 'verified', date: '15/03/2024' },
      { name: 'Relevé bancaire', status: 'pending', date: null },
    ],
  },
  {
    id: 'guarantor',
    title: 'Garant',
    icon: Shield,
    completed: false,
    documents: [
      { name: 'Pièce d\'identité du garant', status: 'missing', date: null },
      { name: 'Justificatif de revenus du garant', status: 'missing', date: null },
    ],
  },
];

export default function DossierPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('identity');
  const completionRate = 65;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon dossier locatif</h1>
        <p className="text-gray-500">Complétez votre dossier pour répondre plus vite aux annonces</p>
      </div>

      {/* Progress card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Votre dossier est à {completionRate}%</h2>
            <p className="text-indigo-100 text-sm">Un dossier complet augmente vos chances de louer</p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">{completionRate}%</span>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors">
            <Upload size={18} />
            Ajouter des documents
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors">
            <Download size={18} />
            Télécharger mon dossier
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  section.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <section.icon size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500">
                    {section.documents.filter(d => d.status === 'verified').length} / {section.documents.length} documents
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {section.completed ? (
                  <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Complet
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                    <AlertCircle size={16} />
                    À compléter
                  </span>
                )}
                <ChevronRight size={20} className={`text-gray-400 transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {expandedSection === section.id && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-4 space-y-3">
                  {section.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className={
                          doc.status === 'verified' ? 'text-emerald-500' : 
                          doc.status === 'pending' ? 'text-amber-500' : 'text-gray-400'
                        } />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                          {doc.date && <p className="text-xs text-gray-500">Ajouté le {doc.date}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'verified' && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                            <CheckCircle size={12} />
                            Vérifié
                          </span>
                        )}
                        {doc.status === 'pending' && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                            <Clock size={12} />
                            En cours
                          </span>
                        )}
                        {doc.status === 'missing' && (
                          <button className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full hover:bg-indigo-700 transition-colors">
                            <Upload size={12} />
                            Ajouter
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield className="text-blue-600" size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Vos données sont sécurisées</h4>
          <p className="text-sm text-blue-700">
            Vos documents sont chiffrés et stockés en France. Ils ne sont partagés qu'avec les propriétaires 
            que vous choisissez de contacter. Vous pouvez demander la suppression de vos données à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}

// Ajout de l'import manquant
import { Clock } from 'lucide-react';