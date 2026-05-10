import random
from django.core.cache import cache
import string
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from users.models import CustomUser
from .serializers import CreatePropertySerializer
from .serializers import (
    ClientProfileSerializer,
    AgentProfileSerializer
)
from .models import Notification, ChatMessage, Conversation
from django.db.models import Q
from .serializers import ChatMessageSerializer, ConversationSerializer
from properties.models import Property
from .utils import broadcast_new_message


class ActivateAgentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.profile.role != 'admin':
            return Response(
                {"error": "Seul un administrateur peut activer un agent"},
                status=status.HTTP_403_FORBIDDEN
            )

        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(id=user_id, is_active=False)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Agent non trouvé ou déjà activé"},
                status=status.HTTP_404_NOT_FOUND
            )

        user.is_active = True
        user.save()

        send_mail(
            'Votre compte agent est activé',
            f'Bonjour {user.first_name} {user.last_name},\n\n'
            f'Votre compte agent a été activé.\n\n'
            f'Vous pouvez maintenant vous connecter.',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response({
            "message": "Compte agent activé avec succès",
            "user_id": user.id,
            "email": user.email
        }, status=status.HTTP_200_OK)


class PendingAgentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.profile.role != 'admin':
            return Response(
                {"error": "Accès réservé aux administrateurs"},
                status=status.HTTP_403_FORBIDDEN
            )

        pending_agents = CustomUser.objects.filter(
            is_active=False,
            profile__isnull=True
        ).values('id', 'email', 'first_name', 'last_name', 'date_joined')

        return Response(list(pending_agents))


class CreatePropertyWithImagesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("FICHIERS:", request.FILES)
        print("DATA:", request.data)
        
        # Vérifier que l'utilisateur est admin ou agent
        if request.user.profile.role not in ['admin', 'agent']:
            return Response(
                {"error": "Seul un administrateur ou un agent peut créer un bien"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # NE PAS FAIRE .copy() ici
        data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'owner_name': request.data.get('owner_name'),
            'owner_phone': request.data.get('owner_phone'),
            'address': request.data.get('address'),
            'postal_code': request.data.get('postal_code'),
            'city': request.data.get('city'),
            'country': request.data.get('country'),
            'latitude': request.data.get('latitude'),
            'longitude': request.data.get('longitude'),
            'surface': request.data.get('surface'),
            'bedrooms': request.data.get('bedrooms'),
            'bathrooms': request.data.get('bathrooms'),
            'equipements': request.data.get('equipements'),
            'price': request.data.get('price'),
            'contract_type': request.data.get('contract_type'),
            'status': request.data.get('status'),
            'category': request.data.get('category'),
            'images': request.FILES.getlist('images[]'),  # ← Important
        }
        
        # Ajouter l'agent automatiquement
        if request.user.profile.role == 'agent':
            data['agent'] = request.user.profile.id
        
        serializer = CreatePropertySerializer(data=data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        property = serializer.save()
        
        return Response({
            "message": "Bien créé avec succès",
            "property_id": property.id,
            "title": property.title,
            "images_count": property.images.count()
        }, status=status.HTTP_201_CREATED)

# ============================================================
# NOTIFICATIONS
# ============================================================

class NotificationsView(APIView):
    """
    Gérer les notifications de l'utilisateur connecté
    ---
    GET    /api/features/notifications/        → Liste des notifications non lues
    GET    /api/features/notifications/?all=true → Liste toutes les notifications
    POST   /api/features/notifications/        → Marquer une notification comme lue
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        show_all = request.query_params.get('all', 'false').lower() == 'true'
        
        if show_all:
            notifications = Notification.objects.filter(user=request.user)
        else:
            notifications = Notification.objects.filter(user=request.user, is_read=False)
        
        data = []
        for notif in notifications:
            data.append({
                'id': notif.id,
                'type': notif.type,
                'title': notif.title,
                'message': notif.message,
                'data': notif.data,
                'is_read': notif.is_read,
                'created_at': notif.created_at.isoformat()
            })
        
        return Response({
            'count': len(data),
            'unread_count': Notification.objects.filter(user=request.user, is_read=False).count(),
            'results': data
        })

    def post(self, request):
        """Marquer une notification comme lue"""
        notification_id = request.data.get('notification_id')
        
        try:
            notif = Notification.objects.get(id=notification_id, user=request.user)
            notif.is_read = True
            notif.save()
            return Response({'message': 'Notification marquée comme lue'})
        except Notification.DoesNotExist:
            return Response({'error': 'Notification non trouvée'}, status=404)


class MarkAllNotificationsReadView(APIView):
    """Marquer toutes les notifications comme lues"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': f'{count} notification(s) marquée(s) comme lue(s)'})

class MarkNotificationReadView(APIView):
    """
    Marquer une notification comme lue
    ---
    POST /api/features/notifications/{id}/read/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({
                "message": "Notification marquée comme lue",
                "notification_id": notification.id
            })
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification non trouvée"},
                status=status.HTTP_404_NOT_FOUND
            )


from django.core.paginator import Paginator


class ConversationListView(APIView):
    """Liste des conversations de l'utilisateur"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(
            participants=request.user
        ).order_by('-updated_at')
        
        serializer = ConversationSerializer(
            conversations, 
            many=True, 
            context={'request': request}
        )
        return Response({"conversations": serializer.data})


class ConversationDetailView(APIView):
    """Détail d'une conversation"""
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation non trouvée"}, status=404)

        if request.user not in conversation.participants.all():
            return Response({"error": "Accès non autorisé"}, status=403)

        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response({"conversation": serializer.data})


class ConversationsView(APIView):
    """Liste et création de conversations via /conversations/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return ConversationListView().get(request)

    def post(self, request):
        return ConversationCreateView().post(request)


class ConversationCreateView(APIView):
    """Créer une nouvelle conversation"""
    permission_classes = [IsAuthenticated]

    def _resolve_receiver_for_property(self, property_obj):
        # 1. Priorité à l'agent s'il existe
        if property_obj.agent and property_obj.agent.user:
            return property_obj.agent.user

        # 2. Sinon le propriétaire (CustomUser lié via owner_profile)
        if property_obj.owner_profile and property_obj.owner_profile.user:
            return property_obj.owner_profile.user

        return None

    def post(self, request):
        property_id = request.data.get('property_id')
        initial_message = request.data.get('initial_message')

        if not property_id:
            return Response(
                {"error": "property_id requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"error": "Bien introuvable"},
                status=status.HTTP_404_NOT_FOUND
            )

        receiver = self._resolve_receiver_for_property(property_obj)
        if not receiver:
            return Response(
                {"error": "Propriétaire ou agent du bien introuvable"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if receiver == request.user:
            return Response(
                {"error": "Vous ne pouvez pas démarrer une conversation avec vous-même"},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=receiver
        ).filter(property=property_obj).first()

        if existing:
            return Response({"id": existing.id, "created": False})

        conversation = Conversation.objects.create(
            property=property_obj
        )
        conversation.participants.add(request.user, receiver)

        if initial_message:
            ChatMessage.objects.create(
                conversation=conversation,
                sender=request.user,
                receiver=receiver,
                content=initial_message
            )
            conversation.last_message = initial_message
            conversation.save()

        return Response({"id": conversation.id, "created": True}, status=status.HTTP_201_CREATED)


class ConversationMessagesView(APIView):
    """Récupérer et envoyer des messages d'une conversation"""
    permission_classes = [IsAuthenticated]

    def _get_conversation(self, conversation_id, user):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return None, Response(
                {"error": "Conversation non trouvée"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user not in conversation.participants.all():
            return None, Response(
                {"error": "Accès non autorisé"},
                status=status.HTTP_403_FORBIDDEN
            )

        return conversation, None

    def get(self, request, conversation_id):
        conversation, error_response = self._get_conversation(conversation_id, request.user)
        if error_response:
            return error_response

        messages_qs = ChatMessage.objects.filter(
            conversation=conversation
        ).order_by('-created_at')

        page_number = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 50)
        
        paginator = Paginator(messages_qs, page_size)
        page_obj = paginator.get_page(page_number)

        # Marquer comme lu lors de la lecture
        ChatMessage.objects.filter(
            conversation=conversation,
            receiver=request.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())

        serializer = ChatMessageSerializer(page_obj, many=True)
        return Response({
            "conversation": ConversationSerializer(conversation, context={'request': request}).data,
            "messages": serializer.data,
            "has_more": page_obj.has_next(),
            "next_page": page_obj.next_page_number() if page_obj.has_next() else None
        })

    def post(self, request, conversation_id):
        content = request.data.get('content')

        if not content:
            return Response(
                {"error": "Contenu du message requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        conversation, error_response = self._get_conversation(conversation_id, request.user)
        if error_response:
            return error_response

        receiver = conversation.participants.exclude(id=request.user.id).first()
        if not receiver:
            return Response(
                {"error": "Destinataire non trouvé"},
                status=status.HTTP_400_BAD_REQUEST
            )

        message = ChatMessage.objects.create(
            conversation=conversation,
            sender=request.user,
            receiver=receiver,
            content=content
        )
        
        conversation.last_message = content
        conversation.save()

        serializer = ChatMessageSerializer(message)
        
        # Broadcast via WebSockets
        participants_ids = list(conversation.participants.values_list('id', flat=True))
        broadcast_new_message(conversation.id, serializer.data, participants_ids)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MarkConversationReadView(APIView):
    """Marquer tous les messages d'une conversation comme lus (sauf ceux de l'utilisateur actuel)"""
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation non trouvée"}, status=404)

        if request.user not in conversation.participants.all():
            return Response({"error": "Accès non autorisé"}, status=403)

        marked_count = ChatMessage.objects.filter(
            conversation=conversation,
            receiver=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"marked_as_read": marked_count})


class UnreadCountView(APIView):
    """Nombre de messages non lus"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = ChatMessage.objects.filter(
            receiver=request.user,
            is_read=False
        ).count()
        return Response({"unread_count": count})


class OwnerConversationListView(APIView):
    """Liste des conversations accessibles aux propriétaires"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'owner':
            return Response(
                {"error": "Accès réservé aux propriétaires"},
                status=status.HTTP_403_FORBIDDEN
            )

        conversations = Conversation.objects.filter(
            participants=request.user
        ).order_by('-updated_at')

        serializer = ConversationSerializer(
            conversations,
            many=True,
            context={'request': request}
        )
        return Response({"conversations": serializer.data})
