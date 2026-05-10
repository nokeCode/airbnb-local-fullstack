from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Property, PropertyImage
from contracts.models import Expense
from .serializers import CategorySerializer, PropertySerializer, ExpenseSerializer, PropertyImageSerializer
from .permissions import IsAdmin, IsAdminOrOwner, IsAdminOrReadOnly
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied

class CategoryViewSet(viewsets.ModelViewSet):
    """
    Gestion des catégories de biens
    ---
    Endpoints :
        GET    /categories/          → Liste toutes les catégories
        POST   /categories/          → Créer une catégorie (admin)
        GET    /categories/{id}/     → Détail d'une catégorie
        PUT    /categories/{id}/     → Modifier une catégorie (admin)
        DELETE /categories/{id}/     → Supprimer une catégorie (admin)
    
    Corps pour création/modification :
        {"name": "Appartement"}
    """
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class PropertyViewSet(viewsets.ModelViewSet):
    """
    Gestion des biens immobiliers
    ---
    GET    /api/properties/              → Liste publique
    POST   /api/properties/              → Créer un bien (admin/owner)
    GET    /api/properties/my-properties/ → Ses propres biens
    POST   /api/properties/{id}/images/  → Ajouter des images
    """
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contract_type', 'status', 'category', 'city']
    search_fields = ['title', 'address', 'description']
    ordering_fields = ['price', 'surface']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminOrOwner()]

    def get_queryset(self):
        queryset = Property.objects.all().prefetch_related('images').select_related('category', 'owner_profile', 'agent')
        
        # Pour la liste publique, on montre 'available' et 'vacant' par défaut
        if self.action == 'list':
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            else:
                queryset = queryset.filter(status__in=['available', 'vacant'])
            
            ids = self.request.query_params.get('ids')
            if ids:
                id_list = [int(i.strip()) for i in ids.split(',') if i.strip()]
                queryset = queryset.filter(id__in=id_list)
                
        return queryset

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'profile'):
            serializer.save(owner_profile=self.request.user.profile)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], url_path='my-properties')
    def my_properties(self, request):
        """Récupérer les biens de l'utilisateur connecté"""
        if not hasattr(request.user, 'profile'):
            return Response({"error": "Profil non trouvé"}, status=404)
        
        queryset = Property.objects.filter(owner_profile=request.user.profile).prefetch_related('images').select_related('category')
        queryset = self.filter_queryset(queryset)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='images', parser_classes=[MultiPartParser, FormParser])
    def add_images(self, request, pk=None):
        """Ajouter des images à un bien (FormData avec clé 'images')"""
        property_obj = self.get_object()
        
        # Vérification des droits (seulement l'owner ou admin)
        if not request.user.is_superuser and property_obj.owner_profile != request.user.profile:
            return Response({"error": "Vous n'êtes pas le propriétaire de ce bien"}, status=403)
            
        images = request.FILES.getlist('images')
        if not images:
            return Response({"error": "Aucune image fournie"}, status=status.HTTP_400_BAD_REQUEST)
            
        created_images = []
        for img in images:
            image_obj = PropertyImage.objects.create(property=property_obj, image=img)
            created_images.append(PropertyImageSerializer(image_obj).data)
            
        return Response({"success": True, "images": created_images}, status=status.HTTP_201_CREATED)

class ExpenseViewSet(viewsets.ModelViewSet):
    """
    Gestion des dépenses liées à un bien
    ---
    Endpoints (imbriqués dans les biens) :
        GET    /properties/{property_id}/expenses/   → Liste des dépenses d'un bien
        POST   /properties/{property_id}/expenses/   → Ajouter une dépense (admin/agent)
        GET    /properties/{property_id}/expenses/{id}/ → Détail
        PUT    /properties/{property_id}/expenses/{id}/ → Modifier
        DELETE /properties/{property_id}/expenses/{id}/ → Supprimer
    
    Exemple de dépense :
        {
            "amount": 50000,
            "description": "Réparation plomberie",
            "start_date": "2026-03-01",
            "end_date": "2026-03-05",
            "receipt": (fichier PDF)
        }
    """
    serializer_class   = ExpenseSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        """Filtre les dépenses pour n'afficher que celles du contrat concerné"""
        return Expense.objects.filter(contract_id=self.kwargs['contract_pk'])

    def perform_create(self, serializer):
        """Associe automatiquement la dépense au contrat concerné"""
        serializer.save(contract_id=self.kwargs['contract_pk'])