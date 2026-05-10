from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from .swagger import schema_view
from features import views as feature_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Documentation Swagger et Redoc
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),

    # Token refresh (utile pour renouveler le token)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Tes APIs
    path('api/auth/', include('users.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/', include('contracts.urls')),
    path('api/features/', include('features.urls')),
    
    # Redirection/Compatibilité pour les conversations si nécessaire, 
    # mais features.urls s'en occupe déjà via api/features/
    path('api/conversations/', feature_views.ConversationsView.as_view(), name='api-conversations'),
    path('api/conversations/<int:conversation_id>/', feature_views.ConversationDetailView.as_view(), name='api-conversation-detail'),
    path('api/conversations/<int:conversation_id>/messages/', feature_views.ConversationMessagesView.as_view(), name='api-conversation-messages'),
    path('api/conversations/<int:conversation_id>/read/', feature_views.MarkConversationReadView.as_view(), name='api-conversation-read'),
    path('api/owner/conversations/', feature_views.OwnerConversationListView.as_view(), name='api-owner-conversations'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)