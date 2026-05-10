from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router pour les ViewSets
router = DefaultRouter()
router.register('users', views.UserViewSet, basename='users')
router.register('admin/users', views.UserViewSet, basename='admin-users')
router.register('activation-requests', views.ActivationRequestViewSet, basename='activation-requests')
router.register('admin/activation-requests', views.ActivationRequestViewSet, basename='admin-activation-requests')

urlpatterns = [
    # Route directe pour /me/
    path('me/', views.UserViewSet.as_view({'get': 'me', 'patch': 'me'}), name='user-me'),

    # Router URLs (gérées par le ViewSet)
    path('', include(router.urls)),
    
    # ============================================================
    # AUTHENTIFICATION
    # ============================================================
    
    # Device trust
    path('login/', views.LoginWithTrustView.as_view(), name='login-trust'),
    path('devices/', views.TrustedDevicesView.as_view(), name='devices'),
    path('devices/<int:pk>/', views.TrustedDevicesView.as_view(), name='device-detail'),
    path('devices/clean/', views.CleanExpiredDevicesView.as_view(), name='clean-devices'),

    # Déconnexion
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    
    # ============================================================
    # INSCRIPTION & PROFIL
    # ============================================================
    
    # Inscription simple (sans OTP)
    path('register/', views.RegisterUserView.as_view(), name='register'),
    
    # Inscription avec validation par email (OTP)
    path('register-otp/', views.RegisterWithOTPView.as_view(), name='register-otp'),
    path('verify-email/', views.VerifyEmailOTPView.as_view(), name='verify-email'),
    path('resend-code/', views.ResendOTPView.as_view(), name='resend-code'),
    
    # Création du profil Person
    path('profile/create/', views.CreatePersonProfileView.as_view(), name='create-profile'),
    
    # Consultation et modification du profil
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('me/', views.CurrentUserView.as_view(), name='current-user'),
    
    
    # ============================================================
    # MOT DE PASSE OUBLIÉ
    # ============================================================
    
    # Demander un code de réinitialisation
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    
    # Vérifier le code et obtenir un token
    path('verify-reset-code/', views.VerifyResetCodeView.as_view(), name='verify-reset-code'),
    
    # Réinitialiser le mot de passe avec le token
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    
    # Changer le mot de passe (utilisateur connecté)
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
]