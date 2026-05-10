# 🏠 AirBnB Local Fullstack

<div align="center">
  
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)

**Plateforme complète de gestion immobilière avec mise en location et vente**

[🌐 Démo](#) • [📖 Documentation](#) • [🐛 Signaler un bug](#) • [💡 Proposer une fonctionnalité](#)

</div>

---

## 📸 Aperçu du Projet

<table>
  <tr>
    <td align="center">
      <img src="./frontend/front_web/public/hero-house.jpg" alt="Accueil" width="100%">
      <br><sub><b>Page d'Accueil</b></sub>
    </td>
    <td align="center">
      <img src="./frontend/front_web/public/roomtour.jpg" alt="Visite Virtuelle" width="100%">
      <br><sub><b>Visite des Biens</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./frontend/front_web/public/maison1.jpg" alt="Propriétés" width="100%">
      <br><sub><b>Catalogue de Propriétés</b></sub>
    </td>
    <td align="center">
      <img src="./frontend/front_web/public/chambre1.avif" alt="Détails" width="100%">
      <br><sub><b>Galerie des Chambres</b></sub>
    </td>
  </tr>
</table>

---

## 🚀 À Propos

**AirBnB Local Fullstack** est une plateforme de gestion immobilière moderne qui permet aux propriétaires et aux agents de lister, gérer et monétiser leurs propriétés. Les clients peuvent découvrir, candidater et louer des biens à travers une interface intuitive et réactive.

### 🎯 Objectif
Fournir une solution complète, scalable et facile à utiliser pour la gestion des biens immobiliers, combinant une expérience utilisateur exceptionnelle avec des outils d'administration puissants.

---

## ✨ Fonctionnalités

### 🎨 Frontend

#### 🔐 Authentification & Sécurité
- ✅ **Inscription et Connexion** - Système d'authentification complet avec validation
- ✅ **Authentification 2FA** - Vérification en deux étapes pour la sécurité maximale
- ✅ **Gestion des Rôles** - Interfaces adaptées pour Clients, Propriétaires, Agents et Admins
- ✅ **Onboarding Personnalisé** - Parcours d'initialisation selon le type d'utilisateur

#### 🏠 Gestion des Propriétés
- ✅ **Catalogue Dynamique** - Affichage élégant de toutes les propriétés disponibles
- ✅ **Filtrage Avancé** - Filtrer par prix, localisation, nombre de chambres, équipements
- ✅ **Recherche Géolocalisée** - Intégration Google Maps et Leaflet pour localisation précise
- ✅ **Détails Enrichis** - Galeries d'images, équipements, description détaillée
- ✅ **Avis et Notation** - Système d'évaluation des biens et commentaires utilisateurs

#### 💰 Location & Vente
- ✅ **Sélection Location/Vente** - Pages dédiées pour chaque type de contrat
- ✅ **Candidatures** - Formulaires de candidature intuitifs pour les locataires
- ✅ **Gestion des Visites** - Planification et suivi des visites de propriétés
- ✅ **Suivi de Candidature** - Tableau de bord pour suivre l'état des dossiers

#### ❤️ Favoris & Recommandations
- ✅ **Système de Favoris** - Sauvegarder et gérer les propriétés préférées
- ✅ **Recommandations Personnalisées** - Suggestions basées sur les préférences
- ✅ **Historique de Recherche** - Accès rapide aux recherches précédentes

#### 💬 Communication
- ✅ **Chat en Temps Réel** - Messagerie instantanée avec WebSocket
- ✅ **Notifications Push** - Alertes pour les nouvelles candidatures et messages
- ✅ **Support Intégré** - Channel support pour assistance utilisateur

#### 📊 Tableaux de Bord
- **Dashboard Client** - Vue d'ensemble des candidatures, favoris, notifications
- **Dashboard Propriétaire** - Gestion des propriétés, candidatures, statistiques
- **Dashboard Agent** - Suivi des propriétés gérées, clients, performances
- **Dashboard Admin** - Statistiques globales, gestion des utilisateurs, modération

#### 🎨 Interface & Expérience
- ✅ **Design Responsive** - Adaptée pour mobile, tablette et desktop
- ✅ **Animations Fluides** - Framer Motion pour transitions élégantes
- ✅ **Mode Sombre** - Support du dark mode pour confort visuel
- ✅ **Accessibilité** - Conforme WCAG pour utilisateurs de tous horizons

---

### ⚙️ Backend

#### 👥 Gestion des Utilisateurs
- ✅ **Authentification Robuste** - CustomUser avec email unique et gestion des rôles
- ✅ **Profils Détaillés** - Person model avec informations complètes
- ✅ **Rôles Multiples** - Admin, Propriétaire, Locataire, Agent, Client
- ✅ **Statuts de Compte** - Pending, Active, Blocked avec onboarding tracking
- ✅ **Gestion de Balance** - Système de crédits ou paiements pour les utilisateurs
- ✅ **Vérification d'Identité** - Numéro de carte d'identité et données de naissance

#### 🏢 Gestion des Propriétés
- ✅ **Catalogue Complet** - Modèle Property avec tous les détails immobiliers
- ✅ **Catégorisation** - Système flexible de catégories (Appartement, Maison, Bureau, etc.)
- ✅ **Statuts Dynamiques** - Vacant, Loué, En travaux, Réservé, Disponible, Indisponible
- ✅ **Types de Contrats** - Support Location et Vente
- ✅ **Géolocalisation** - Coordonnées GPS précises et adresse complète
- ✅ **Équipements JSON** - Liste flexible des équipements et services
- ✅ **Pricing Intelligent** - Prix de base, loyer mensuel, charges séparées
- ✅ **Détails Techniques** - Surface, chambres, salles de bain documentées

#### 📋 Gestion des Candidatures
- ✅ **Applications Complètes** - Modèle Application pour candidatures
- ✅ **Statuts de Dossier** - Incomplet, Complet, Vérifié
- ✅ **Workflows de Candidature** - Pending, Accepted, Rejected, Cancelled
- ✅ **Messages de Rejet** - Raisons personnalisées pour rejets
- ✅ **Planification de Visite** - Intégration avec modèle Visit
- ✅ **Conversations Liées** - Chaîne de communication intégrée

#### 📅 Gestion des Visites
- ✅ **Programmation Flexible** - Dates et heures configurables
- ✅ **Statuts Multiples** - Planifiée, Effectuée, Annulée
- ✅ **Tracking Complet** - Historique de toutes les visites
- ✅ **Coordonnées Propriétaire** - Contact direct pour les visites

#### 📝 Contrats
- ✅ **Génération de Contrats** - Modèles automatisés pour locations et ventes
- ✅ **Signature Électronique** - Support pour signature numérique
- ✅ **Historique Complet** - Archivage des contrats signés
- ✅ **Conditions Personnalisables** - Termes ajustables par propriétaire

#### 💬 Système de Features (Communication)
- ✅ **Conversations Thread** - Système de conversations multi-utilisateurs
- ✅ **Messages Temps Réel** - WebSocket consumers pour messagerie instantanée
- ✅ **Notifications Push** - Système d'alerte configurable
- ✅ **Middleware Personnalisé** - Gestion des permissions et authentification
- ✅ **Routing WebSocket** - Gestion des connexions en temps réel

#### 🔐 Sécurité & Permissions
- ✅ **Contrôle d'Accès** - Permissions spécifiques par rôle
- ✅ **Validation des Données** - Serializers DRF complets
- ✅ **Protection CSRF** - Sécurité des requêtes POST/PUT/DELETE
- ✅ **Rate Limiting** - Protection contre les abus
- ✅ **Logging Complet** - Audit trail de toutes les opérations

#### 📊 API & Documentation
- ✅ **API RESTful** - Endpoints complets pour toutes les fonctionnalités
- ✅ **Documentation Swagger** - Génération automatique de documentation
- ✅ **Pagination** - Gestion optimisée des listes longues
- ✅ **Filtrage Avancé** - Recherche et tri sur tous les modèles

---

## 🛠️ Tech Stack

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 16.1.6 | Framework React avec SSR/SSG |
| **React** | 19.2.3 | Librairie UI principale |
| **TypeScript** | 5 | Typage statique |
| **Tailwind CSS** | 4 | Styling utility-first |
| **Framer Motion** | 12.36 | Animations fluides |
| **React Leaflet** | 5.0 | Cartes interactives |
| **Google Maps API** | Latest | Géolocalisation |
| **Recharts** | 3.8 | Graphiques & statistiques |
| **React Icons** | 5.6 | Icônes SVG |
| **ESLint** | 9 | Linting du code |

### Backend
| Technologie | Usage |
|-------------|-------|
| **Django** | Framework web Python |
| **Django REST Framework** | API RESTful |
| **Django Channels** | WebSocket & async |
| **PostgreSQL** | Base de données |
| **JWT** | Authentification tokens |
| **Celery** | Tasks asynchrones |
| **Redis** | Cache & sessions |

---

## 📂 Structure du Projet

```
airbnb-local-fullstack/
├── frontend/
│   └── front_web/                    # Application Next.js
│       ├── app/                      # Pages et routes
│       │   ├── admin/               # Dashboard admin
│       │   ├── agence/              # Pages agents
│       │   ├── bien/                # Pages propriétés
│       │   ├── client/              # Pages clients
│       │   ├── dashboard/           # Tableaux de bord
│       │   ├── location/            # Pages location
│       │   ├── login/               # Authentification
│       │   ├── property/            # Détails propriétés
│       │   ├── register/            # Inscription
│       │   ├── vente/               # Pages vente
│       │   └── verify-2fa/          # Vérification 2FA
│       ├── components/              # Composants réutilisables
│       │   ├── admin/              # Composants admin
│       │   ├── auth/               # Composants auth
│       │   ├── dashboard/          # Dashboard UI
│       │   ├── features/           # Fonctionnalités
│       │   ├── Navbar/             # Navigation
│       │   └── showcase/           # Showcase des biens
│       ├── lib/                     # Utilitaires & API
│       │   ├── api.ts              # Client API
│       │   ├── auth.ts             # Auth utils
│       │   ├── websocket.ts        # WebSocket client
│       │   └── favorites.ts        # Gestion favoris
│       ├── services/                # Services métier
│       │   ├── authService.tsx     # Authentification
│       │   ├── contractsService.ts # Contrats
│       │   └── ...
│       ├── hooks/                   # React hooks custom
│       │   ├── useNotifications.ts
│       │   └── useUsers.ts
│       ├── public/                  # Assets statiques & images
│       └── package.json             # Dépendances
│
└── backend/
    └── gest_immo/                   # Application Django
        ├── config/                  # Configuration Django
        │   ├── settings.py         # Configuration globale
        │   ├── urls.py             # Routage principal
        │   ├── wsgi.py             # WSGI app
        │   ├── asgi.py             # ASGI (WebSocket)
        │   └── swagger.py          # Config Swagger
        ├── users/                   # Gestion des utilisateurs
        │   ├── models.py           # CustomUser, Person
        │   ├── views.py            # UserViewSet
        │   ├── serializers.py      # Sérialisation
        │   └── backends.py         # Auth backends
        ├── properties/              # Gestion des propriétés
        │   ├── models.py           # Property, Category
        │   ├── views.py            # PropertyViewSet
        │   ├── serializers.py      # PropertySerializer
        │   └── permissions.py      # Permissions custom
        ├── contracts/               # Gestion des contrats
        │   ├── models.py           # Application, Visit
        │   ├── views.py            # ContractViewSet
        │   └── serializers.py      # Sérialisation
        ├── features/                # Communication & Features
        │   ├── models.py           # Conversation, Message
        │   ├── consumers.py        # WebSocket consumers
        │   ├── routing.py          # WebSocket routing
        │   ├── views.py            # API views
        │   └── middleware.py       # Custom middleware
        ├── scripts/                 # Scripts utilitaires
        │   └── loader_Json.py      # Chargement données
        ├── media/                   # Fichiers uploadés
        │   └── pieces/
        ├── manage.py               # Django CLI
        ├── db.sqlite3              # Base de données
        └── requirements.txt         # Dépendances Python
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** 18+ et npm/pnpm
- **Python** 3.9+
- **PostgreSQL** 12+ (optionnel, SQLite en développement)

### Frontend Setup

```bash
# Accéder au répertoire frontend
cd frontend/front_web

# Installer les dépendances
pnpm install
# ou
npm install

# Lancer le serveur de développement
pnpm dev
# L'app sera disponible à http://localhost:3000
```

### Backend Setup

```bash
# Accéder au répertoire backend
cd backend/gest_immo

# Créer un environnement virtuel
python -m venv backenv

# Activer l'environnement
# Sur Windows:
backenv\Scripts\activate
# Sur Linux/Mac:
source backenv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Charger les données initiales (optionnel)
python manage.py runscript loader_Json

# Lancer le serveur Django
python manage.py runserver

# L'API sera disponible à http://localhost:8000
```

### Variables d'Environnement Frontend
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000
```

### Variables d'Environnement Backend
```env
# .env
DEBUG=True
SECRET_KEY=votre_clé_secrète
DATABASE_URL=postgresql://user:password@localhost:5432/airbnb_local
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🎯 Utilisation

### Pour les Clients
1. 📝 S'inscrire et créer un profil
2. 🔍 Explorer le catalogue de propriétés
3. ❤️ Ajouter des propriétés aux favoris
4. 📋 Soumettre une candidature
5. 💬 Communiquer avec le propriétaire
6. 📅 Planifier une visite
7. ✍️ Signer le contrat numériquement

### Pour les Propriétaires
1. 🏠 Créer une annonce de propriété
2. 📸 Ajouter des photos et détails
3. 💰 Définir les prix et conditions
4. 📊 Gérer les candidatures reçues
5. 👥 Vérifier les dossiers des candidats
6. 📅 Planifier et valider les visites
7. 📝 Générer et signer des contrats

### Pour les Agents
1. 🏢 Gérer un portefeuille de propriétés
2. 📈 Suivre les statistiques de vente
3. 👥 Gérer les clients et candidatures
4. 📞 Communiquer avec clients et propriétaires
5. 📊 Analyser les performances

### Pour les Admins
1. 👨‍💼 Modérer les utilisateurs et contenus
2. 📊 Voir les statistiques globales
3. 🔧 Gérer les catégories et configurations
4. 🚨 Gérer les signalements et litiges
5. 📋 Vérifier les identités des utilisateurs

---

## 🔌 API Endpoints Principaux

### Authentication
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/logout/` - Déconnexion
- `POST /api/auth/verify-2fa/` - Vérifier 2FA

### Properties
- `GET /api/properties/` - Lister toutes les propriétés
- `GET /api/properties/{id}/` - Détails d'une propriété
- `POST /api/properties/` - Créer une propriété
- `PUT /api/properties/{id}/` - Modifier une propriété
- `DELETE /api/properties/{id}/` - Supprimer une propriété

### Applications
- `GET /api/applications/` - Lister les candidatures
- `POST /api/applications/` - Soumettre une candidature
- `PUT /api/applications/{id}/` - Mettre à jour une candidature

### Users
- `GET /api/users/me/` - Profil de l'utilisateur
- `PUT /api/users/me/` - Modifier le profil
- `GET /api/users/{id}/` - Profil public d'un utilisateur

### Messages (WebSocket)
- `ws://localhost:8000/ws/chat/{conversation_id}/` - Chat en temps réel

---

## 📈 Roadmap

- [ ] Système de paiement intégré (Stripe)
- [ ] Vérification d'identité via IA
- [ ] Tours virtuels 3D des propriétés
- [ ] Calendrier d'availability avancé
- [ ] App mobile (React Native)
- [ ] Intégration vidéo pour visites virtuelles
- [ ] IA pour recommandations intelligentes
- [ ] Export en PDF des dossiers

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. 🍴 Fork le projet
2. 🌱 Créer une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
3. 📝 Commiter vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push vers la branche (`git push origin feature/AmazingFeature`)
5. 🔃 Ouvrir une Pull Request

---

## 📜 Licence

Ce projet est sous la licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Support

Pour toute question ou assistance :
- 📧 Email : support@airbnblocal.dev
- 💬 Discord : [Rejoindre le serveur](#)
- 🐛 Issues : [GitHub Issues](#)

---

## ⭐ Statistiques du Projet

![GitHub Stars](https://img.shields.io/github/stars/yourusername/airbnb-local-fullstack?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/airbnb-local-fullstack?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/airbnb-local-fullstack)

---

<div align="center">
  Made with ❤️ by Your Team
  <br><br>
  <a href="#top">⬆ Retour au haut de la page</a>
</div>