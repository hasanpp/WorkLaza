import json
from django.contrib.auth import get_user_model
User = get_user_model()
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom,Message
from asgiref.sync import sync_to_async



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

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender_id  = data["sender"]
        sender = await sync_to_async(User.objects.get)(id=sender_id)
        chat = await sync_to_async(ChatRoom.objects.get)(id=self.room_name)
        
        new_message = await sync_to_async(Message.objects.create)( chat_room=chat, sender=sender, text=message )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': new_message.text,
                'sender': sender.id,
                'timestamp': str(new_message.timestamp)
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "sender": event["sender"], "timestamp": event["timestamp"]}))
