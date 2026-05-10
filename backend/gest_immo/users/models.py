from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):

    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Person(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone = models.CharField(max_length=20, unique=True, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    identity_card_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    birth_date = models.DateField(blank=True, null=True)
    registration_date = models.DateField(auto_now_add=True)

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('owner', 'Propriétaire'),
        ('tenant', 'Locataire'),
        ('agent', 'Agent'),
        ('client', 'Client'),
    ]

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('active', 'Actif'),
        ('blocked', 'Bloqué'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tenant')
    account_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    onboarding_completed = models.BooleanField(default=False)
    activation_requested = models.BooleanField(default=False)

    agency_name = models.CharField(max_length=255, blank=True, null=True)
    speciality = models.CharField(max_length=255, blank=True, null=True)

    profession = models.CharField(max_length=255, blank=True, null=True)

    is_approved = models.BooleanField(default=False, verbose_name="Compte approuvé")

    class Meta:
        verbose_name = "Personne"
        verbose_name_plural = "Personnes"

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

import hashlib
import hmac
from django.conf import settings
from datetime import timedelta
from django.utils import timezone

class TrustedDevice(models.Model):
    """
    Appareils de confiance pour éviter la 2FA répétée
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='trusted_devices'
    )
    device_name = models.CharField(max_length=255, blank=True, null=True)
    device_fingerprint = models.CharField(max_length=64)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    last_used = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Appareil de confiance"
        verbose_name_plural = "Appareils de confiance"
        ordering = ['-last_used']
        unique_together = ('user', 'device_fingerprint')
    
    def __str__(self):
        return f"{self.device_name or 'Appareil inconnu'} - {self.user.email}"
    
    @staticmethod
    def generate_fingerprint(request):
        """Génère une empreinte unique pour l'appareil"""
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        accept = request.META.get('HTTP_ACCEPT', '')
        accept_encoding = request.META.get('HTTP_ACCEPT_ENCODING', '')
        accept_language = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
        ip = request.META.get('REMOTE_ADDR', '')
        
        # Créer une chaîne unique
        raw = f"{user_agent}|{accept}|{accept_encoding}|{accept_language}|{ip}"
        
        # Hasher avec une clé secrète
        secret_key = settings.SECRET_KEY.encode()
        return hmac.new(secret_key, raw.encode(), hashlib.sha256).hexdigest()