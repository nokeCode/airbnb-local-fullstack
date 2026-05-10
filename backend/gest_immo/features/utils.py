from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def broadcast_new_message(conversation_id, message_data, participants_ids):
    """
    Broadcast a new message to all participants of a conversation via WebSockets.
    """
    channel_layer = get_channel_layer()
    
    for user_id in participants_ids:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {
                "type": "chat_message",
                "conversation_id": conversation_id,
                "message": message_data
            }
        )
