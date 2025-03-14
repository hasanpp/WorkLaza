import json
from django.contrib.auth import get_user_model
User = get_user_model()
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom,Message
from asgiref.sync import sync_to_async, async_to_sync
from channels.layers import get_channel_layer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f"user_{self.user_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.send(text_data=json.dumps({
            "message": data["message"]
        }))

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["message"]))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        image_data = data.get("image")
        sender_id  = data["sender"]
        sender = await sync_to_async(User.objects.get)(id=sender_id)
        chat = await sync_to_async(ChatRoom.objects.get)(id=self.room_name)
        
        new_message = await sync_to_async(Message.objects.create)( chat_room=chat, sender=sender, text=message )
        
        if image_data:
            from django.core.files.base import ContentFile
            import base64
            format, imgstr = image_data.split(";base64,")
            ext = format.split("/")[-1]
            image_name = f"chat_{new_message.id}.{ext}"
            
            await sync_to_async(new_message.image.save, thread_sensitive=True)( image_name, ContentFile(base64.b64decode(imgstr)), save=True )    
        
        user1, user2 = await sync_to_async(lambda: (chat.user1, chat.user2))()
        resiver = user2 if user1 == sender else user1

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': new_message.text,
                'sender': sender.id,
                'timestamp': str(new_message.timestamp),
                "image": new_message.image.url if new_message.image else None,
            }
        )
        
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
             f"user_{resiver.id}",
             {
                "type":"send_notification",
                "message":{
                    "title":"New message",
                    "body": f"Your have a new message from '{sender.username}'."
                }
             }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "sender": event["sender"], "timestamp": event["timestamp"], "image": event["image"]}))
