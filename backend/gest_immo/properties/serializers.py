from rest_framework import serializers
from .models import Category, Property, PropertyImage
from contracts.models import Expense

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']


class OwnerSerializer(serializers.Serializer):
    """Données du propriétaire/agent pour affichage"""
    id = serializers.IntegerField()
    name = serializers.CharField()
    email = serializers.CharField()
    phone = serializers.CharField()
    avatar = serializers.CharField(allow_null=True, required=False)


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), 
        write_only=True, 
        required=False
    )
    category_name = serializers.CharField(write_only=True, required=False)
    equipment = serializers.ListField(
        child=serializers.CharField(), 
        write_only=True, 
        required=False,
        source='equipments'
    )
    category_data = CategorySerializer(source='category', read_only=True)
    agent_name = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    
    def get_agent_name(self, obj):
        if obj.agent:
            return f"{obj.agent.user.first_name} {obj.agent.user.last_name}"
        return None
    
    def get_owner(self, obj):
        """Retourne les données du propriétaire/agent"""
        if obj.owner_profile and obj.owner_profile.user:
            user = obj.owner_profile.user
            return {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'phone': obj.owner_profile.phone or '',
                'avatar': None
            }
        elif obj.agent and obj.agent.user:
            user = obj.agent.user
            return {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'phone': obj.agent.phone or '',
                'avatar': None
            }
        return None

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description',
            'owner_name', 'owner_phone', 'owner', 'address', 
            'postal_code', 'city', 'country',
            'latitude', 'longitude',
            'surface', 'bedrooms', 'bathrooms', 'equipments', 'equipment',
            'price', 'monthly_rent', 'monthly_charges', 'contract_type', 'status',
            'category', 'category_name', 'category_data', 'agent', 'agent_name',
            'images', 'uploaded_images', 'available_date'
        ]
        extra_kwargs = {
            'category': {'required': False},
            'equipments': {'read_only': True}
        }

    def create(self, validated_data):
        images_data = validated_data.pop('uploaded_images', [])
        category_name = validated_data.pop('category_name', None)
        
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            validated_data['category'] = category
            
        property = Property.objects.create(**validated_data)
        for image in images_data:
            PropertyImage.objects.create(property=property, image=image)
        return property

    def update(self, instance, validated_data):
        images_data = validated_data.pop('uploaded_images', [])
        category_name = validated_data.pop('category_name', None)
        
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            validated_data['category'] = category
            
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        for image in images_data:
            PropertyImage.objects.create(property=instance, image=image)
        return instance


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'