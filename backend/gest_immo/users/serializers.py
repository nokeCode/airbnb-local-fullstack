from rest_framework import serializers
from .models import CustomUser
from .models import Person
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Ajouter les infos de l'utilisateur
        data['user_id'] = self.user.id
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        
        # Ajouter les infos du profil Person s'il existe
        if hasattr(self.user, 'profile'):
            profile = self.user.profile
            data['profile'] = {
                'id': profile.id,
                'phone': profile.phone,
                'role': profile.role,
                'balance': str(profile.balance),
            }
        else:
            data['profile'] = None
            
        return data

class UserSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'un utilisateur"""
    class Meta:
        model = CustomUser 
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class PersonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = [
            'role', 'onboarding_completed',
            'phone', 'address', 'identity_card_number', 
            'birth_date', 'profession',
            'agency_name', 'speciality'
        ]
        extra_kwargs = {
            'phone': {'required': False},
            'address': {'required': False},
            'identity_card_number': {'required': False},
            'birth_date': {'required': False},
        }


class PersonSerializer(serializers.ModelSerializer):
    """Affichage complet d'une personne avec ses infos User"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Person
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'address', 'identity_card_number', 'birth_date',
            'registration_date', 'role', 'balance',
            'agency_name', 'speciality', 'profession',
            'account_status', 'onboarding_completed', 'activation_requested'
        ]


class UpdateRoleSerializer(serializers.ModelSerializer):
    """Permet à l'admin de changer uniquement le rôle d'un utilisateur"""
    class Meta:
        model = Person
        fields = ['role']


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Permet à un utilisateur de modifier son propre profil"""
    email = serializers.EmailField(source='user.email', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = Person
        fields = [
            'email', 'first_name', 'last_name',
            'phone', 'address', 'identity_card_number', 'birth_date',
            'agency_name', 'speciality', 'profession',
            'onboarding_completed', 'role', 'activation_requested'
        ]

    def update(self, instance, validated_data):
        # Mise à jour des champs User imbriqués
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Mise à jour des champs Person
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance