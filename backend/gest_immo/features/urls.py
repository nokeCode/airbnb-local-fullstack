from django.urls import path
from . import views

urlpatterns = [  
    # Admin actions
    path('activate-agent/', views.ActivateAgentView.as_view(), name='activate-agent'),
    path('pending-agents/', views.PendingAgentsView.as_view(), name='pending-agents'),

    # Property creation with images
    path('properties/create/', views.CreatePropertyWithImagesView.as_view(), name='create-property'),

    # Notifications
    path('notifications/', views.NotificationsView.as_view(), name='notifications'),
    path('notifications/read-all/', views.MarkAllNotificationsReadView.as_view(), name='notifications-read-all'),
    path('notifications/<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='notification-read'),

    # Chat
    path('conversations/', views.ConversationsView.as_view(), name='conversations'),
    path('conversations/<int:conversation_id>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', views.ConversationMessagesView.as_view(), name='conversation-messages'),
    path('conversations/<int:conversation_id>/read/', views.MarkConversationReadView.as_view(), name='conversation-read'),
    path('unread-count/', views.UnreadCountView.as_view(), name='chat-unread-count'),
]