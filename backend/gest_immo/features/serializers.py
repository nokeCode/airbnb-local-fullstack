from rest_framework import serializers
from properties.models import Property, PropertyImage
from .models import ChatMessage, Conversation
from users.serializers import UserSerializer

class BaseProfileSerializer(serializers.Serializer):
    """Champs communs à tous les profils"""
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255)
    identity_card_number = serializers.CharField(max_length=50)
    birth_date = serializers.DateField()
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    profession = serializers.CharField(max_length=255, required=False, allow_blank=True)


class ClientProfileSerializer(BaseProfileSerializer):
    """Profil client (champs spécifiques)"""
    pass  # Pas de champs spécifiques pour le client pour l'instant
    


class AgentProfileSerializer(BaseProfileSerializer):
    """Profil agent (champs spécifiques)"""
    agency_name = serializers.CharField(max_length=255, required=True)
    speciality = serializers.CharField(max_length=255, required=False, allow_blank=True)


class CreatePropertySerializer(serializers.ModelSerializer):
    """Serializer pour créer un bien avec ses images"""
    
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Property
        fields = [
            'title', 'description', 'owner_name', 'owner_phone',
            'address', 'postal_code', 'city', 'country',
            'latitude', 'longitude',
            'surface', 'bedrooms', 'bathrooms', 'equipements',
            'price', 'contract_type', 'status', 'category',
            'agent',
            'images' 
        ]
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        
        # Créer le bien
        property = Property.objects.create(**validated_data)
        
        # Ajouter les images
        for image in images:
            PropertyImage.objects.create(property=property, image=image)
        
        return property


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'sender_id', 'sender_name', 'content', 'created_at', 'is_read', 'read_at'
        ]
        read_only_fields = ['sender_id', 'is_read', 'read_at', 'created_at']

    def get_sender_name(self, obj):
        if obj.sender.first_name:
            return f"{obj.sender.first_name} {obj.sender.last_name}".strip()
        return obj.sender.email


class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    property = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'type', 'other_user', 'property', 'last_message', 
            'unread_count', 'updated_at'
        ]

    def get_other_user(self, obj):
        request = self.context.get('request')
        if not request:
            return None
        
        other_user = obj.participants.exclude(id=request.user.id).first()
        if not other_user:
            return None
            
        return {
            "id": other_user.id,
            "name": f"{other_user.first_name} {other_user.last_name}".strip() or other_user.email,
            "avatar": None,
            "is_online": False,
            "last_seen": None
        }

    def get_property(self, obj):
        if not obj.property:
            return None
        
        request = self.context.get('request')
        first_image = obj.property.images.first()
        image_url = None
        if first_image:
            image_url = first_image.image.url
            if request:
                image_url = request.build_absolute_uri(image_url)
        
        return {
            "id": obj.property.id,
            "title": obj.property.title,
            "price": obj.property.price,
            "address": obj.property.address,
            "image": image_url
        }

    def get_last_message(self, obj):
        last_msg = ChatMessage.objects.filter(conversation=obj).order_by('-created_at').first()
        if last_msg:
            return {
                "content": last_msg.content,
                "created_at": last_msg.created_at,
                "is_read": last_msg.is_read,
                "sender_id": last_msg.sender.id
            }
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request:
            return 0
        return ChatMessage.objects.filter(
            conversation=obj,
            receiver=request.user,
            is_read=False
        ).count()
