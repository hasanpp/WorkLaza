from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Worker
from .serializers import WorkerSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view


User = get_user_model()

@api_view(['POST'])
def worker_register(request, *args, **kwargs):
    username = request.data.get('username')
    user = User.objects.get(username=username)
        
    mutable_data = request.data
    mutable_data['user'] = user.id
    serializer = WorkerSerializer(data=mutable_data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response({'message':'Worker registered successfully; request is under verification.'}, status=status.HTTP_201_CREATED)
    return Response({'messages':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
