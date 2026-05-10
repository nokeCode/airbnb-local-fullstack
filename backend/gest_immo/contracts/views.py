from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from .models import Contract, Paiement, Application, Visit
from .serializers import ContractSerializer, PaiementSerializer, ApplicationSerializer, VisitSerializer
from .permissions import IsAdmin, IsAdminOrAgent, IsOwnerClient
from properties.models import Property
from users.models import Person

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = user.profile
        scope = self.request.query_params.get('scope')

        if profile.role == 'admin':
            return Application.objects.all()
        
        if scope == 'owner':
            return Application.objects.filter(property__owner_profile=profile)
        elif scope == 'tenant':
            return Application.objects.filter(tenant=profile)
        
        # Default behavior: show both if applicable or filter by role
        return Application.objects.filter(Q(tenant=profile) | Q(property__owner_profile=profile))

    def perform_create(self, serializer):
        property_id = self.request.data.get('property')
        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
            
        tenant = self.request.user.profile
        
        # Create conversation
        from features.models import Conversation
        conversation = Conversation.objects.create(property=property_obj, type="application")
        conversation.participants.add(self.request.user)
        if property_obj.owner_profile:
            conversation.participants.add(property_obj.owner_profile.user)
        if property_obj.agent:
            conversation.participants.add(property_obj.agent.user)
            
        serializer.save(tenant=tenant, conversation=conversation)

class VisitViewSet(viewsets.ModelViewSet):
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = user.profile
        if profile.role == 'admin':
            return Visit.objects.all()
        return Visit.objects.filter(Q(tenant=profile) | Q(property__owner_profile=profile) | Q(agent=profile))

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        visit = self.get_object()
        visit.status = 'completed'
        visit.save()
        return Response({'status': 'visit completed'})

class LeaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les baux (basé sur Contract)
    """
    serializer_class = ContractSerializer
    permission_classes = [IsAdminOrAgent]

    def get_queryset(self):
        user = self.request.user
        profile = user.profile
        if profile.role == 'admin':
            return Contract.objects.filter(contract_type='rent')
        return Contract.objects.filter(contract_type='rent').filter(Q(agent=profile) | Q(property__owner_profile=profile))

    def perform_create(self, serializer):
        application_id = self.request.data.get('application_id')
        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            raise serializers.ValidationError("Application non trouvée")

        serializer.save(
            application=application,
            property=application.property,
            client=application.tenant,
            contract_type='rent'
        )
        application.status = 'accepted'
        application.save()

    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        lease = self.get_object()
        # Logique de signature (ex: marquer comme signé, générer PDF final, etc.)
        return Response({'status': 'lease signed'})

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsAdminOrAgent()]
        if self.action == 'destroy':
            return [IsAdmin()]
        if self.action == 'terminate':
            return [IsAdminOrAgent()]  # ← Agent peut résilier
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        profile = user.profile

        if profile.role == 'admin':
            return Contract.objects.all().select_related('property', 'client', 'agent')
        if profile.role == 'agent':
            return Contract.objects.filter(agent=profile).select_related('property', 'client', 'agent')
        if profile.role == 'client':
            return Contract.objects.filter(client=profile).select_related('property', 'client', 'agent')
        return Contract.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.profile.role == 'agent':
            serializer.save(agent=user.profile)
        else:
            serializer.save()

    @action(detail=True, methods=['post'], url_path='terminate')
    def terminate_contract(self, request, pk=None):
        """
        Résilier un contrat (agent ou admin)
        ---
        POST /api/contracts/{id}/terminate/
        """
        contract = self.get_object()
        user = request.user
        
        if user.profile.role == 'agent' and contract.agent != user.profile:
            raise PermissionDenied("Vous ne pouvez pas résilier un contrat qui ne vous appartient pas.")
        
        property_obj = contract.property
        
        if property_obj:
            property_obj.status = 'available'
            property_obj.save()
        
        return Response({
            "message": "Contrat résilié avec succès",
            "contract_id": contract.id,
            "property_id": property_obj.id,
            "property_status": "available"
        })

class PaiementViewSet(viewsets.ModelViewSet):
    """
    Gestion des paiements liés à un contrat
    ---
    Endpoints (imbriqués dans les contrats) :
        GET    /contracts/{contract_id}/payments/   → Liste des paiements
        POST   /contracts/{contract_id}/payments/   → Ajouter un paiement (admin/agent)
        GET    /contracts/{contract_id}/payments/{id}/ → Détail
        PUT    /contracts/{contract_id}/payments/{id}/ → Modifier
        DELETE /contracts/{contract_id}/payments/{id}/ → Supprimer
    
    Exemple de paiement :
        {
            "amount": 150000,
            "payment_date": "2026-04-01",
            "receipt": (fichier PDF optionnel)
        }
    """
    serializer_class = PaiementSerializer
    permission_classes = [IsAdminOrAgent]

    def get_queryset(self):
        """
        Filtre les paiements selon le rôle de l'utilisateur
        """
        user = self.request.user
        profile = user.profile
        contract_id = self.kwargs.get('contract_pk')

        # Base queryset : tous les paiements du contrat spécifié
        queryset = Paiement.objects.filter(contract_id=contract_id)

        # Admin : voit tous les paiements du contrat
        if profile.role == 'admin':
            return queryset.select_related('contract__property', 'contract__client', 'contract__agent')

        # Agent : voit uniquement les paiements de ses contrats
        if profile.role == 'agent':
            return queryset.filter(contract__agent=profile).select_related('contract__property', 'contract__client')

        # Client : voit uniquement les paiements de ses contrats
        if profile.role == 'client':
            return queryset.filter(contract__client=profile).select_related('contract__property', 'contract__agent')

        return queryset.none()

    def perform_create(self, serializer):
        contract_id = self.kwargs['contract_pk']
        serializer.save(contract_id=contract_id)

class DashboardStatsView(APIView):
    """
    Tableau de bord statistiques (admin uniquement)
    ---
    Endpoint : GET /api/contracts/dashboard/
    
    Retourne des statistiques globales sur :
        - Biens (total, disponibles, location/vente)
        - Utilisateurs (agents, clients)
        - Contrats (total, location, vente)
        - Finances (revenus, dépenses, net)
        - Derniers contrats (5 récents)
    
    Exemple de réponse :
        {
            "properties": {
                "total": 10,
                "available": 7,
                "for_rent": 6,
                "for_sale": 4
            },
            "users": {
                "agents": 3,
                "clients": 15
            },
            "contracts": {
                "total": 8,
                "rent": 5,
                "sale": 3
            },
            "finances": {
                "total_revenue": 750000,
                "total_expenses": 120000,
                "net": 630000,
                "revenue_by_month": [...]
            },
            "recent_contracts": [...]
        }
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        # --- Biens ---
        total_properties      = Property.objects.count()
        available_properties  = Property.objects.filter(status='available').count()
        properties_for_rent   = Property.objects.filter(transaction_type='rent').count()
        properties_for_sale   = Property.objects.filter(transaction_type='sale').count()

        # --- Utilisateurs ---
        total_agents  = Person.objects.filter(role='agent').count()
        total_clients = Person.objects.filter(role='client').count()

        # --- Contrats ---
        total_contracts = Contract.objects.count()
        rent_contracts  = Contract.objects.filter(contract_type='rent').count()
        sale_contracts  = Contract.objects.filter(contract_type='sale').count()

        # --- Paiements / Revenus ---
        total_revenue = Paiement.objects.aggregate(
            total=Sum('amount')
        )['total'] or 0

        revenue_by_month = (
            Paiement.objects
            .values('payment_date__year', 'payment_date__month')
            .annotate(total=Sum('amount'))
            .order_by('payment_date__year', 'payment_date__month')
        )

        # --- Dépenses ---
        from properties.models import Expense
        total_expenses = Expense.objects.aggregate(
            total=Sum('amount')
        )['total'] or 0

        # --- Contrats récents (5 derniers) ---
        recent_contracts = Contract.objects.order_by('-created_at')[:5]
        recent_data = ContractSerializer(recent_contracts, many=True).data

        return Response({
            'properties': {
                'total':      total_properties,
                'available':  available_properties,
                'for_rent':   properties_for_rent,
                'for_sale':   properties_for_sale,
            },
            'users': {
                'agents':  total_agents,
                'clients': total_clients,
            },
            'contracts': {
                'total': total_contracts,
                'rent':  rent_contracts,
                'sale':  sale_contracts,
            },
            'finances': {
                'total_revenue':  total_revenue,
                'total_expenses': total_expenses,
                'net':            float(total_revenue) - float(total_expenses),
                'revenue_by_month': list(revenue_by_month),
            },
            'recent_contracts': recent_data,
        })
