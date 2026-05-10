from rest_framework import serializers
from .models import Contract, Paiement, Application, Visit
from properties.models import Property

class ApplicationSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField(source='conversation.id', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    tenant_name = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'property', 'property_title', 'tenant', 'tenant_name', 
            'message', 'status', 'dossier_status', 'rejection_reason', 
            'visit_date', 'conversation_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['tenant', 'status', 'conversation', 'created_at', 'updated_at']

    def get_tenant_name(self, obj):
        return f"{obj.tenant.user.first_name} {obj.tenant.user.last_name}"

class VisitSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    tenant_name = serializers.SerializerMethodField()
    agent_name = serializers.SerializerMethodField()

    class Meta:
        model = Visit
        fields = [
            'id', 'property', 'property_title', 'tenant', 'tenant_name',
            'agent', 'agent_name', 'scheduled_date', 'status', 'notes', 'created_at'
        ]
        read_only_fields = ['created_at']

    def get_tenant_name(self, obj):
        return f"{obj.tenant.user.first_name} {obj.tenant.user.last_name}"

    def get_agent_name(self, obj):
        if obj.agent:
            return f"{obj.agent.user.first_name} {obj.agent.user.last_name}"
        return None

class PaiementSerializer(serializers.ModelSerializer):
    """Serializer pour les paiements"""
    
    class Meta:
        model = Paiement
        fields = ['id', 'amount', 'payment_date', 'receipt', 'contract']
        read_only_fields = ['contract']


class ContractSerializer(serializers.ModelSerializer):
    """Serializer pour les contrats avec paiement initial optionnel"""
    
    initial_payment = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        write_only=True, 
        required=False,
        help_text="Montant du premier paiement (optionnel)"
    )
    
    class Meta:
        model = Contract
        fields = [
            'id', 'amount', 'start_date', 'end_date', 'contract_type',
            'document', 'created_at', 'property', 'client', 'agent',
            'application', 'initial_payment'
        ]
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        initial_payment = validated_data.pop('initial_payment', None)
        
        # Récupérer le bien
        property_obj = validated_data.get('property')
        
        # Créer le contrat
        contract = Contract.objects.create(**validated_data)
        
        # Si un paiement initial est fourni, le créer
        if initial_payment:
            Paiement.objects.create(
                contract=contract,
                amount=initial_payment,
                payment_date=validated_data.get('start_date')
            )
        
        # Changer le statut du bien en indisponible
        if property_obj:
            property_obj.status = 'unavailable'
            property_obj.save()
        
        return contract