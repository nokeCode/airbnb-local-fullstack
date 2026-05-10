'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  Users, 
  Building2, 
  TrendingUp,
  Star,
  ChevronRight,
  MessageCircle
} from 'lucide-react';

export default function AgencePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { icon: Building2, value: '15+', label: 'Années d\'expérience', color: 'bg-blue-500' },
    { icon: Users, value: '5000+', label: 'Clients satisfaits', color: 'bg-green-500' },
    { icon: Award, value: '2500+', label: 'Biens gérés', color: 'bg-purple-500' },
    { icon: TrendingUp, value: '98%', label: 'Taux de satisfaction', color: 'bg-rose-500' },
  ];

  const team = [
    {
      name: 'Marie Dubois',
      role: 'Directrice Générale',
      image: '/maison10.png',
      description: '15 ans d\'expérience dans l\'immobilier de luxe',
    },
    {
      name: 'Pierre Martin',
      role: 'Responsable Commercial',
      image: '/maison5.jpg',
      description: 'Expert en négociation et acquisition',
    },
    {
      name: 'Sophie Bernard',
      role: 'Responsable Location',
      image: '/chambre1.avif',
      description: 'Spécialiste du marché locatif',
    },
    {
      name: 'Lucas Petit',
      role: 'Responsable Marketing',
      image: '/maison9.avif',
      description: 'Digital & Stratégie de marque',
    },
  ];

  const services = [
    {
      title: 'Vente immobilière',
      description: 'Estimation précise, mise en valeur de votre bien, accompagnement jusqu\'à la signature.',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Location & Gestion',
      description: 'Gestion complète de vos biens locatifs : recherche de locataires, états des lieux, encaissement des loyers.',
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Conseil en investissement',
      description: 'Analyse du marché, identification des opportunités, optimisation fiscale.',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Estimation gratuite',
      description: 'Étude comparative du marché locale pour déterminer la valeur réelle de votre bien.',
      icon: Award,
      color: 'from-rose-500 to-rose-600',
    },
  ];

  const faqs = [
    {
      question: 'Comment estimer la valeur de mon bien ?',
      answer: 'Nous réalisons une estimation gratuite basée sur une analyse comparative du marché local, l\'état du bien, et les tendances actuelles. Un rapport détaillé vous est remis sous 48h.',
    },
    {
      question: 'Quels sont vos honoraires ?',
      answer: 'Nos honoraires sont transparents et sans surprise. Ils varient selon le service (vente, location, gestion) et sont détaillés dès le premier rendez-vous. Aucun frais caché.',
    },
    {
      question: 'Combien de temps pour vendre mon bien ?',
      answer: 'Le délai moyen de vente est de 45 à 90 jours selon le type de bien et la localisation. Notre expertise marketing et notre réseau qualifié accélèrent le processus.',
    },
    {
      question: 'Proposez-vous la gestion locative ?',
      answer: 'Oui, nous proposons la gestion locative complète : recherche de locataires, rédaction de baux, états des lieux, encaissement des loyers, et suivi des démarches administratives.',
    },
  ];

  const testimonials = [
    {
      name: 'Jean Dupont',
      role: 'Vendeur',
      content: 'Équipe professionnelle et réactive. Mon appartement a été vendu en 3 semaines au prix estimé. Je recommande vivement !',
      rating: 5,
    },
    {
      name: 'Marie Lefebvre',
      role: 'Locataire',
      content: 'Processus de location fluide et transparent. L\'équipe a été très disponible pour répondre à toutes mes questions.',
      rating: 5,
    },
    {
      name: 'Philippe Moreau',
      role: 'Propriétaire investisseur',
      content: 'Je confie la gestion de mes 5 appartements à cette agence depuis 3 ans. Un service irréprochable et des locataires de qualité.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/bg-landscape.png')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Votre partenaire<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                immobilier de confiance
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Depuis plus de 15 ans, nous accompagnons nos clients dans leurs projets 
              immobiliers avec expertise, transparence et engagement.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Nous appeler
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Prendre rendez-vous
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white -mt-16 relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl p-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins immobiliers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`} />
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  <button className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    En savoir plus <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-xl text-gray-600">Des experts passionnés à votre service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Ce que disent nos clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  {faq.question}
                  <ChevronRight className={`w-5 h-5 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Contactez-nous</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Notre équipe est à votre disposition pour répondre à toutes vos questions 
                et vous accompagner dans vos projets immobiliers.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600">123 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@agence-immobiliere.fr</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Horaires</h3>
                    <p className="text-gray-600">Lun-Ven: 9h-19h<br />Samedi: 10h-17h</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
