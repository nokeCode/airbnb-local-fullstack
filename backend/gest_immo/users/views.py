from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
import random
from datetime import timedelta
from django.utils import timezone
from .models import TrustedDevice

from .models import Person, CustomUser
from .serializers import (
    UserSerializer, PersonCreateSerializer, PersonSerializer,
    UpdateRoleSerializer, UpdateProfileSerializer,
    CustomTokenObtainPairSerializer
)
from features.models import Notification


User = get_user_model()


# ============================================================
# PERMISSIONS PERSONNALISÉES
# ============================================================

class IsAdmin(permissions.BasePermission):
    """
    Permission personnalisée : vérifie si l'utilisateur est admin.
    
    Un utilisateur est considéré admin si :
    - Il est superuser ou staff Django
    - OU il a un profil (Person) avec le rôle 'admin'
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
            
        # Autoriser superuser et staff par défaut
        if user.is_superuser or user.is_staff:
            return True
            
        # Sinon vérifier le rôle dans le profil Person
        return hasattr(user, 'profile') and user.profile.role == 'admin'

# ============================================================
# INSCRIPTION ET PROFIL
# ============================================================

class RegisterUserView(generics.CreateAPIView):
    """
    ÉTAPE 1 : Création du compte utilisateur (sans profil)
    ---
    POST /api/auth/register/
    Body: {
        "email": "user@test.com",
        "password": "motdepasse",
        "first_name": "Jean",
        "last_name": "Dupont"
    }
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreatePersonProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        if hasattr(user, 'profile'):
            return Response({"error": "Un profil existe déjà"}, status=400)
        
        serializer = PersonCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        role = data.get('role', 'tenant')
        
        if role == 'owner':
            account_status = 'pending'
            message = "Profil propriétaire en attente de validation"
        else:
            account_status = 'active'
            message = "Profil locataire créé"
        
        is_approved = (account_status == 'active')
        
        person = Person.objects.create(
            user=user,
            phone=data.get('phone'),
            address=data.get('address'),
            identity_card_number=data.get('identity_card_number'),
            birth_date=data.get('birth_date'),
            role=role,
            profession=data.get('profession', ''),
            agency_name=data.get('agency_name', ''),
            speciality=data.get('speciality', ''),
            account_status=account_status,
            is_approved=is_approved,
            onboarding_completed=data.get('onboarding_completed', True)
        )
        
        return Response({
            "message": message, 
            "is_approved": is_approved,
            "account_status": account_status,
            "onboarding_completed": True
        }, status=201)

class ProfileView(APIView):
    """
    Consultation et modification des profils
    ---
    GET  /api/auth/profile/?user_id=1  → Voir le profil de l'utilisateur 1
    PATCH /api/auth/profile/           → Modifier un profil (user_id dans body)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Récupérer user_id depuis les query params
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            person = Person.objects.get(user_id=user_id)
            return Response(PersonSerializer(person).data)
        except Person.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

    def patch(self, request):
        # Récupérer user_id depuis le body
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            person = Person.objects.get(user_id=user_id)
            serializer = UpdateProfileSerializer(person, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(PersonSerializer(person).data)
        except Person.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)


# ============================================================
# DÉCONNEXION
# ============================================================

class LogoutView(APIView):
    """
    Déconnexion (invalidation du refresh token)
    ---
    URL : POST /api/auth/logout/
    Body : {"refresh": "token..."}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
            return Response({"message": "Déconnexion réussie"})
        except Exception:
            return Response({"error": "Token invalide"}, status=400)


# ============================================================
# GESTION DES UTILISATEURS (ADMIN)
# ============================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    Gestion des utilisateurs — réservée à l'admin (sauf 'me')

    GET    /api/auth/users/              -> liste de tous les utilisateurs (admin)
    GET    /api/auth/users/me/           -> mon propre profil (connecté)
    PATCH  /api/auth/users/me/           -> modifier mon propre profil (connecté)
    GET    /api/auth/users/{id}/         -> détail d'un utilisateur (admin)
    GET    /api/auth/users/agents/       -> liste des agents uniquement (admin)
    GET    /api/auth/users/clients/      -> liste des clients uniquement (admin)
    PATCH  /api/auth/users/{id}/role/    -> changer le rôle d'un utilisateur (admin)
    DELETE /api/auth/users/{id}/         -> supprimer un utilisateur (admin)
    """
    serializer_class = PersonSerializer
    queryset = Person.objects.all().select_related('user')

    def get_permissions(self):
        if self.action in ['me']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        user = request.user
        try:
            person = user.profile
        except Person.DoesNotExist:
            # Si pas de profil, on renvoie au moins les infos User
            return Response({
                "id": user.id,
                "email": user.email,
                "role": None,
                "account_status": None,
                "is_superuser": user.is_superuser
            })

        if request.method == 'GET':
            return Response({
                "id": user.id,
                "email": user.email,
                "role": person.role,
                "account_status": person.account_status,
                "is_superuser": user.is_superuser,
                "onboarding_completed": person.onboarding_completed,
                "activation_requested": person.activation_requested
            })
        
        elif request.method == 'PATCH':
            serializer = UpdateProfileSerializer(person, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # Recharger après mise à jour
            return Response({
                "id": user.id,
                "email": user.email,
                "role": person.role,
                "account_status": person.account_status,
                "is_superuser": user.is_superuser,
                "onboarding_completed": person.onboarding_completed,
                "activation_requested": person.activation_requested
            })

    @action(detail=False, methods=['get'], url_path='agents')
    def agents(self, request):
        agents = Person.objects.filter(role='agent').select_related('user')
        return Response(PersonSerializer(agents, many=True).data)

    @action(detail=False, methods=['get'], url_path='clients')
    def clients(self, request):
        clients = Person.objects.filter(role='client').select_related('user')
        return Response(PersonSerializer(clients, many=True).data)

    @action(detail=True, methods=['patch'], url_path='role')
    def update_role(self, request, pk=None):
        person = self.get_object()
        serializer = UpdateRoleSerializer(person, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(PersonSerializer(person).data)

    def destroy(self, request, pk=None):
        person = self.get_object()
        person.user.delete()
        return Response({"message": "Utilisateur supprimé"}, status=204)


class ActivationRequestViewSet(viewsets.ViewSet):
    """
    Gestion des demandes d'activation
    """
    
    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def create(self, request):
        """POST /activation-requests/ -> Demander l'activation"""
        try:
            person = request.user.profile
            if person.role != 'owner':
                return Response({"error": "Seuls les propriétaires peuvent demander une activation"}, status=400)
            person.activation_requested = True
            person.save()
            return Response({"requested": True, "message": "Demande d'activation envoyée"})
        except Person.DoesNotExist:
            return Response({"error": "Profil non trouvé"}, status=404)

    def list(self, request):
        """GET /admin/activation-requests/ -> Liste des demandes (Admin)"""
        queryset = Person.objects.filter(activation_requested=True)
        serializer = PersonSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """POST /admin/activation-requests/{id}/approve/ -> Approuver (Admin)"""
        try:
            person = Person.objects.get(pk=pk)
            person.account_status = 'active'
            person.activation_requested = False
            person.is_approved = True
            person.save()
            return Response({"status": "active", "message": "Compte activé"})
        except Person.DoesNotExist:
            return Response({"error": "Demande non trouvée"}, status=404)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """POST /admin/activation-requests/{id}/reject/ -> Rejeter (Admin)"""
        try:
            person = Person.objects.get(pk=pk)
            person.account_status = 'blocked'
            person.activation_requested = False
            person.save()
            return Response({"status": "blocked", "message": "Compte rejeté/bloqué"})
        except Person.DoesNotExist:
            return Response({"error": "Demande non trouvée"}, status=404)

# ============================================================
# INSCRIPTION AVEC VALIDATION EMAIL (OTP)
# ============================================================

class RegisterWithOTPView(APIView):
    """
    ÉTAPE 1 : Inscription avec envoi de code OTP
    ---
    POST /api/auth/register-otp/
    Body: {
        "email": "user@test.com",
        "password": "motdepasse",
        "first_name": "Jean",
        "last_name": "Dupont"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")

        if not email or not password:
            return Response(
                {"error": "Email et mot de passe requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier si l'utilisateur existe déjà
        user = CustomUser.objects.filter(email=email).first()
        if user:
            if user.is_active:
                return Response(
                    {"error": "Un utilisateur avec cet email existe déjà"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Mettre à jour les infos de l'utilisateur inactif
                user.first_name = first_name
                user.last_name = last_name
                user.set_password(password)
                user.save()
        else:
            # Créer l'utilisateur (inactif)
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_active=False
            )

        # Générer code OTP
        otp_code = str(random.randint(100000, 999999))
        cache.set(f'verify_{user.id}', otp_code, timeout=900)  # 15 minutes

        # Envoyer par email
        try:
            send_mail(
                'Code de vérification - Activez votre compte',
                f'Bienvenue {first_name} {last_name} !\n\n'
                f'Votre code de vérification est : {otp_code}\n\n'
                f'Ce code est valable 15 minutes.',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            user.delete()
            return Response(
                {"error": f"Erreur lors de l'envoi de l'email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        admins = CustomUser.objects.filter(profile__role='admin', is_active=True)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                type='agent_pending',
                title='Nouvel agent en attente',
                message=f"{first_name} {last_name} ({email}) a demandé son inscription.",
                data={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'user_id': user.id
                }
            )

        return Response({
            "success": True,
            "message": "Inscription réussie. Un code de vérification a été envoyé par email.",
            "user_id": user.id,
            "email": email
        }, status=status.HTTP_201_CREATED)


class VerifyEmailOTPView(APIView):
    """
    ÉTAPE 2 : Vérification du code OTP pour activer le compte
    ---
    POST /api/auth/verify-email/
    Body: {
        "email": "user@test.com",
        "code": "123456"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        if not email or not code:
            return Response(
                {"error": "Email et code requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Utilisateur non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.is_active:
            return Response({"message": "Ce compte est déjà activé"})

        cached_code = cache.get(f'verify_{user.id}')

        if not cached_code:
            return Response(
                {"error": "Code expiré. Veuillez demander un nouveau code."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if code != cached_code:
            return Response(
                {"error": "Code invalide"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Activer le compte
        user.is_active = True
        user.save()
        cache.delete(f'verify_{user.id}')

        # Générer token JWT
        refresh = RefreshToken.for_user(user)

        response_data = {
            "message": "Compte activé avec succès",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_active": True,
                "is_superuser": user.is_superuser
            }
        }

        # Ajouter les infos du profil s'il existe (probablement pas encore, mais par sécurité)
        if hasattr(user, 'profile'):
            profile = user.profile
            response_data["profile"] = {
                "id": profile.id,
                "phone": profile.phone,
                "role": profile.role,
                "account_status": profile.account_status,
                "onboarding_completed": profile.onboarding_completed,
                "is_approved": profile.is_approved
            }
        else:
            response_data["profile"] = None

        return Response(response_data)


class ResendOTPView(APIView):
    """
    Renvoyer un nouveau code de vérification
    ---
    POST /api/auth/resend-code/
    Body: {
        "email": "user@test.com"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Utilisateur non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.is_active:
            return Response({"message": "Ce compte est déjà activé"})

        # Générer nouveau code
        otp_code = str(random.randint(100000, 999999))
        cache.set(f'verify_{user.id}', otp_code, timeout=900)

        send_mail(
            'Nouveau code de vérification',
            f'Voici votre nouveau code de vérification : {otp_code}\n\n'
            f'Ce code est valable 15 minutes.',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Nouveau code envoyé par email"})


# ============================================================
# MOT DE PASSE OUBLIÉ
# ============================================================

class ForgotPasswordView(APIView):
    """
    ÉTAPE 1 : Demander un code de réinitialisation
    ---
    POST /api/auth/forgot-password/
    Body: {"email": "user@test.com"}
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({
                "message": "Si cet email existe, vous recevrez un code de réinitialisation"
            })

        otp_code = str(random.randint(100000, 999999))
        cache.set(f'reset_{user.id}', otp_code, timeout=900)

        send_mail(
            'Réinitialisation de votre mot de passe',
            f'Bonjour {user.first_name} {user.last_name},\n\n'
            f'Votre code de vérification est : {otp_code}\n\n'
            f'Ce code est valable 15 minutes.',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({
            "message": "Si cet email existe, vous recevrez un code de réinitialisation"
        })


class VerifyResetCodeView(APIView):
    """
    ÉTAPE 2 : Vérifier le code et obtenir un token de réinitialisation
    ---
    POST /api/auth/verify-reset-code/
    Body: {
        "email": "user@test.com",
        "code": "123456"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        if not email or not code:
            return Response(
                {"error": "Email et code requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Code invalide ou expiré"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cached_code = cache.get(f'reset_{user.id}')

        if not cached_code or code != cached_code:
            return Response(
                {"error": "Code invalide ou expiré"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Code valide : autoriser la réinitialisation
        refresh = RefreshToken.for_user(user)
        cache.set(f'reset_auth_{user.id}', 'authorized', timeout=600)

        return Response({
            "message": "Code valide. Vous pouvez maintenant réinitialiser votre mot de passe.",
            "reset_token": str(refresh.access_token),
            "email": email
        })


class ResetPasswordView(APIView):
    """
    ÉTAPE 3 : Réinitialiser le mot de passe avec le token
    ---
    POST /api/auth/reset-password/
    Body: {
        "email": "user@test.com",
        "new_password": "nouveauMotDePasse123",
        "reset_token": "token_recu_à_l'étape_2"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        reset_token = request.data.get("reset_token")

        if not email or not new_password or not reset_token:
            return Response(
                {"error": "Email, nouveau mot de passe et token requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Utilisateur non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )

        authorized = cache.get(f'reset_auth_{user.id}')
        if not authorized:
            return Response(
                {"error": "Non autorisé. Veuillez refaire la demande."},
                status=status.HTTP_403_FORBIDDEN
            )

        if len(new_password) < 6:
            return Response(
                {"error": "Le mot de passe doit contenir au moins 6 caractères"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        cache.delete(f'reset_{user.id}')
        cache.delete(f'reset_auth_{user.id}')

        send_mail(
            'Mot de passe modifié avec succès',
            f'Bonjour {user.first_name} {user.last_name},\n\n'
            f'Votre mot de passe a été modifié avec succès.',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=True,
        )

        return Response({"message": "Mot de passe réinitialisé avec succès"})


class ChangePasswordView(APIView):
    """
    Changer le mot de passe (utilisateur connecté)
    ---
    POST /api/auth/change-password/
    Authorization: Bearer <token>
    Body: {
        "old_password": "ancienMotDePasse",
        "new_password": "nouveauMotDePasse123"
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {"error": "Ancien et nouveau mot de passe requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {"error": "Ancien mot de passe incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 6:
            return Response(
                {"error": "Le nouveau mot de passe doit contenir au moins 6 caractères"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        send_mail(
            'Mot de passe modifié',
            f'Bonjour {user.first_name} {user.last_name},\n\n'
            f'Votre mot de passe a été modifié avec succès.',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=True,
        )

        return Response({"message": "Mot de passe modifié avec succès"})


class LoginWithTrustView(APIView):
    """
    Connexion avec support des appareils de confiance
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        code = request.data.get("code")
        
        # Marquer cet appareil comme fiable ?
        trust_device = request.headers.get('X-Trust-Device', 'false').lower() == 'true'
        device_name = request.headers.get('X-Device-Name', 'Appareil inconnu')
        device_id = request.headers.get('X-Device-ID', None)
        
        # 1. Vérifier email/mot de passe
        user = authenticate(email=email, password=password)
        if not user:
            return Response({"error": "Email ou mot de passe incorrect", "email": email, "password": password}, status=401)

        # 2. Vérifier que le compte est actif
        if not user.is_active:
            return Response({"error": "Ce compte est désactivé"}, status=403)

        # 3. Générer l'empreinte de l'appareil
        fingerprint = device_id or TrustedDevice.generate_fingerprint(request)
        
        # 4. Vérifier si l'appareil est déjà de confiance
        trusted_device = TrustedDevice.objects.filter(
            user=user,
            device_fingerprint=fingerprint,
            is_active=True,
            expires_at__gt=timezone.now()
        ).first()

        # 5. Si l'appareil est de confiance, pas besoin de code
        if trusted_device:
            # Mettre à jour la date de dernière utilisation
            trusted_device.last_used = timezone.now()
            trusted_device.save()
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            # Préparer les données de réponse
            response_data = {
                "success": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "trusted": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_superuser": user.is_superuser
                }
            }
            
            # Ajouter les infos du profil s'il existe
            if hasattr(user, 'profile'):
                profile = user.profile
                response_data["profile"] = {
                    "phone": profile.phone,
                    "address": profile.address,
                    "identity_card_number": profile.identity_card_number,
                    "birth_date": profile.birth_date,
                    "role": profile.role,
                    "profession": profile.profession,
                    "agency_name": profile.agency_name,
                    "speciality": profile.speciality,
                    "is_approved": profile.is_approved,
                    "account_status": profile.account_status,
                    "onboarding_completed": profile.onboarding_completed
                }
            else:
                response_data["profile"] = None
                
            return Response(response_data)

        # 6. Appareil non fiable : 2FA requise
        if not code:
            # Générer code à 6 chiffres
            otp_code = str(random.randint(100000, 999999))
            
            # Stocker en cache (5 minutes) avec l'empreinte
            cache.set(f'2fa_{user.id}', otp_code, timeout=300)
            
            # Envoyer par email
            try:
                send_mail(
                    'Code de vérification',
                    f'Votre code de connexion est : {otp_code}\n\nCe code est valable 5 minutes.',
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print("Erreur lors de l'envoi de l'email:", e)
                
            
            return Response({
                "requires_2fa": True,
                "message": "Code de vérification envoyé par email",
                "user_id": user.id,
                "can_trust": True
            })

        # 7. Vérifier le code fourni
        cached_code = cache.get(f'2fa_{user.id}')
        if not cached_code or code != cached_code:
            return Response({"error": "Code invalide ou expiré"}, status=400)
        
        # Code valide, on le supprime
        cache.delete(f'2fa_{user.id}')

        # 8. Si l'utilisateur veut marquer cet appareil comme fiable
        if trust_device and code:
            # Créer un appareil de confiance (valable 30 jours)
            TrustedDevice.objects.create(
                user=user,
                device_name=device_name,
                device_fingerprint=fingerprint,
                ip_address=request.META.get('REMOTE_ADDR', ''),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                expires_at=timezone.now() + timedelta(days=30)
            )

        # 9. Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            "success": True,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "trusted": trust_device,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_superuser": user.is_superuser
            }
        }
        
        # Ajouter les infos du profil s'il existe
        if hasattr(user, 'profile'):
            profile = user.profile
            response_data["profile"] = {
                "phone": profile.phone,
                "address": profile.address,
                "identity_card_number": profile.identity_card_number,
                "birth_date": profile.birth_date,
                "role": profile.role,
                "profession": profile.profession,
                "agency_name": profile.agency_name,
                "speciality": profile.speciality,
                "is_approved": profile.is_approved,
                "account_status": profile.account_status,
                "onboarding_completed": profile.onboarding_completed
            }
        else:
            response_data["profile"] = None
            
        return Response(response_data)


class TrustedDevicesView(APIView):
    """
    Gérer les appareils de confiance
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Liste tous les appareils de confiance de l'utilisateur"""
        devices = TrustedDevice.objects.filter(
            user=request.user,
            is_active=True,
            expires_at__gt=timezone.now()
        ).values('id', 'device_name', 'last_used', 'created_at', 'expires_at')
        
        return Response({
            "success": True,
            "message": "Appareils de confiance récupérés",
            "devices": list(devices)
        })

    def delete(self, request, pk=None):
        """Révoquer un ou plusieurs appareils"""
        if pk:
            try:
                device = TrustedDevice.objects.get(id=pk, user=request.user)
                device.is_active = False
                device.save()
                return Response({"message": "Appareil révoqué"})
            except TrustedDevice.DoesNotExist:
                return Response({"error": "Appareil non trouvé"}, status=404)
        else:
            TrustedDevice.objects.filter(user=request.user).update(is_active=False)
            return Response({"message": "Tous les appareils ont été révoqués"})


class CleanExpiredDevicesView(APIView):
    """
    Nettoyer les appareils expirés (admin seulement)
    """
    permission_classes = [IsAdmin]

    def post(self, request):
        expired = TrustedDevice.objects.filter(expires_at__lte=timezone.now())
        count = expired.count()
        expired.delete()
        return Response({"message": f"{count} appareils expirés supprimés"})

class CurrentUserView(APIView):
    """
    Récupérer les informations de l'utilisateur connecté
    ---
    GET /api/users/me/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
            'date_joined': user.date_joined,
        }
        
        # Ajouter les infos du profil s'il existe
        if hasattr(user, 'profile'):
            profile = user.profile
            data['profile'] = {
                'id': profile.id,
                'phone': profile.phone,
                'address': profile.address,
                'identity_card_number': profile.identity_card_number,
                'birth_date': profile.birth_date,
                'role': profile.role,
                'balance': str(profile.balance),
                'is_approved': profile.is_approved,
                'agency_name': profile.agency_name,
                'speciality': profile.speciality,
                'profession': profile.profession,
            }
        else:
            data['profile'] = None
        
        return Response(data)