from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import ChatRoom, Message
from worker.models import Worker
from rest_framework.response import Response
from .serializers import ChatSerializer, MessageSerializer
from user.serializers import UserSerializer
from rest_framework.views import APIView
from user.models import CustomUser as User
from django.db.models import Q
from rest_framework import status
from django.conf import settings
import jwt


JWT_SECRET_KEY = settings.JWT_SECRET_KEY

class ChatView(APIView):
    def post(self, request):
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
        user_for_id = decoded['user_id']

        user_id = request.data.get('user_id')
        workerId = request.data.get('workerId')

        user1 = User.objects.get(id=user_id)
        worker = Worker.objects.filter(id=workerId).first()
        if not worker:
            user2 = User.objects.filter(id=workerId).first()
        if worker: 
            user2 = worker.user

        if user1 == user2:
            return Response({"message": "You cannot create a chat with yourself."}, status=status.HTTP_409_CONFLICT)


        chat = ChatRoom.objects.filter(Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)).first()
        if not chat and user2:
            chat = ChatRoom.objects.create(user1=user1,user2=user2)

        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user and not ChatRoom.objects.filter(Q(user1=user1, user2=admin_user) | Q(user1=admin_user, user2=user1)).exists() and user1.is_superuser == False :  
            admin_chat = ChatRoom.objects.create(user1=user1, user2=admin_user)


        all_chats = ChatRoom.objects.filter(Q(user1=user1)|Q(user2=user1)).distinct().order_by('-user1__is_superuser', '-user2__is_superuser')

        if not chat:
            chat = all_chats.first()
            print(chat)

        messages = chat.messages

        receiver = None

        for chat_room in all_chats:
            print(chat_room)
        if user_for_id == user1.id:
            receiver = user2
        elif user_for_id == user2.id:
            receiver= user1

        receiver = UserSerializer(receiver).data

        return JsonResponse({"chat_id": chat.id, "receiver": receiver,"messages": MessageSerializer(messages, many=True).data, "chats": ChatSerializer(all_chats, many=True).data})

    def get(self, request, chat_id):
        chat = get_object_or_404(ChatRoom, id=chat_id)
        messages = chat.messages.all().order_by("timestamp")

        return JsonResponse({
            "messages": [
                {"sender": msg.sender.id, "text": msg.text, "timestamp": msg.timestamp.strftime("%H:%M"), "image": msg.image.url if msg.image else None, }
                for msg in messages
            ]
        })
