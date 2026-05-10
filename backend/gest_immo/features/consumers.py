import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import Conversation, ChatMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close(code=4401)
            return

        # Join a group unique to the user
        self.user_group_name = f"user_{self.user.id}"
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()
        
        # Broadcast presence: online
        await self.broadcast_presence("online")

    async def disconnect(self, close_code):
        if hasattr(self, "user_group_name"):
            # Broadcast presence: offline
            await self.broadcast_presence("offline")
            
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get("type")

            if message_type == "presence":
                await self.broadcast_presence(data.get("status", "online"))
            
            elif message_type == "read_receipt":
                await self.handle_read_receipt(data)
                
        except Exception as e:
            await self.send(text_data=json.dumps({
                "type": "error",
                "error": str(e)
            }))

    async def broadcast_presence(self, status):
        # Notify other users about this user's presence
        # In a real app, you'd only notify participants of active conversations
        pass

    async def handle_read_receipt(self, data):
        conversation_id = data.get("conversation_id")
        if not conversation_id:
            return

        # Logic to mark as read in DB if not already done by API
        await self.mark_messages_as_read(conversation_id)

        # Notify other participants
        participants = await self.get_conversation_participants(conversation_id)
        for participant_id in participants:
            if participant_id != self.user.id:
                await self.channel_layer.group_send(
                    f"user_{participant_id}",
                    {
                        "type": "chat_read_receipt",
                        "conversation_id": conversation_id,
                        "user_id": self.user.id
                    }
                )

    @database_sync_to_async
    def get_conversation_participants(self, conversation_id):
        try:
            conv = Conversation.objects.get(id=conversation_id)
            if self.user in conv.participants.all():
                return list(conv.participants.values_list('id', flat=True))
        except Conversation.DoesNotExist:
            pass
        return []

    @database_sync_to_async
    def mark_messages_as_read(self, conversation_id):
        ChatMessage.objects.filter(
            conversation_id=conversation_id,
            receiver=self.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())

    # Handler for messages sent to the user group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "type": "new_message",
            "conversation_id": event["conversation_id"],
            "message": event["message"]
        }))

    async def chat_read_receipt(self, event):
        await self.send(text_data=json.dumps({
            "type": "read_receipt",
            "conversation_id": event["conversation_id"],
            "user_id": event["user_id"]
        }))

    async def chat_presence(self, event):
        await self.send(text_data=json.dumps({
            "type": "presence",
            "user_id": event["user_id"],
            "status": event["status"]
        }))
