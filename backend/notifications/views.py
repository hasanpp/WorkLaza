from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import ChatRoom, Message
from worker.models import Worker
from rest_framework.response import Response
from .serializers import ChatSerializer, MessageSerializer
from user.serializers import UserSerializer
from user.models import CustomUser as User
from django.db.models import Q
from rest_framework import status
from django.conf import settings
import jwt


JWT_SECRET_KEY = settings.JWT_SECRET_KEY



@api_view(["GET"])
def get_or_create_chat(request, worker_id):
    worker = get_object_or_404(User, id=worker_id)
    user = request.user

    chat_room, created = ChatRoom.objects.get_or_create(
        user1=min(user, worker, key=lambda u: u.id),
        user2=max(user, worker, key=lambda u: u.id)
    )

    return JsonResponse({"chat_room_id": chat_room.id})

@api_view(["GET"])
def get_chat_messages(request, chat_id):
    chat = get_object_or_404(ChatRoom, id=chat_id)
    messages = chat.messages.all().order_by("timestamp")

    return JsonResponse({
        "messages": [
            {"sender": msg.sender.id, "text": msg.text, "timestamp": msg.timestamp.strftime("%H:%M"), "image": msg.image.url if msg.image else None, }
            for msg in messages
        ]
    })
    
@api_view(["POST"])
def get_chats(request):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_for_id = decoded['user_id']
    
    user_id = request.data.get('user_id')
    workerId = request.data.get('workerId')
    
    user1 = User.objects.get(id=user_id)
    worker = Worker.objects.filter(id=workerId).first()
    if not worker:
        user2 = User.objects.get(id=workerId)
    if worker: 
        user2 = worker.user
        
    if user1 == user2:
        return Response({"message": "You cannot create a chat with yourself."}, status=status.HTTP_409_CONFLICT)

    if user1.id > user2.id:
        user1, user2 = user2, user1  

    chat = ChatRoom.objects.filter(user1=user1, user2=user2).first()
    admin_user = User.objects.filter(is_superuser=True).first()
    if admin_user and not ChatRoom.objects.filter(user1=user1, user2=admin_user).exists():
        admin_chat = ChatRoom.objects.create(user1=user1, user2=admin_user)
    if not chat:
        chat = ChatRoom.objects.create(user1=user1,user2=user2)
    
    messages = chat.messages
    
    receiver = None
    
    all_chats = ChatRoom.objects.filter(Q(user1=user1) | Q(user2=user1)).distinct().order_by('-user1__is_superuser', '-user2__is_superuser')
    
    if user_for_id == user1.id:
        receiver = user2
    elif user_for_id == user2.id:
        receiver= user1
        
    receiver = UserSerializer(receiver).data
    
    return JsonResponse({"chat_id": chat.id, "receiver": receiver,"messages": MessageSerializer(messages, many=True).data, "chats": ChatSerializer(all_chats, many=True).data})

@api_view(["POST"])
def send_message(request):
    sender = request.user
    chat_id = request.data.get("chat_id")
    text = request.data.get("text")

    try:
        chat = ChatRoom.objects.get(id=chat_id)
        message = Message.objects.create(chat=chat, sender=sender, text=text)
        return Response({"message": MessageSerializer(message).data}, status=status.HTTP_201_CREATED)
    except ChatRoom.DoesNotExist:
        return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)