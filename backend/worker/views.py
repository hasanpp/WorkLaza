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
    if user.is_worker:
        return Response({'message':'Aldready reagisterd; request may under verification.'}, status=status.HTTP_200_OK)
    mutable_data = request.data
    mutable_data['user'] = user.id
    serializer = WorkerSerializer(data=mutable_data)
    if serializer.is_valid():
        serializer.save(user=user)
        user.is_worker = True
        user.save()
        return Response({'message':'Worker registered successfully; request is under verification.'}, status=status.HTTP_201_CREATED)
    return Response({'messages':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['Post'])
def worker_view(request,*args, **kwargs):
    username = request.data.get('username')
    try:
        user = User.objects.get(username=username)
        if user.is_worker :
            try:
                worker = Worker.objects.get(user=user)
                if not worker.is_verified:
                    return Response({'messages':'The worker profile is not varified yet','is_verified':worker.is_verified},status=status.HTTP_401_UNAUTHORIZED)
                if not worker.is_active:
                    return Response({'messages':'Admin is blocked you profile','is_active':worker.is_active},status=status.HTTP_401_UNAUTHORIZED)
                return Response({'messages':'Loged in as a worker','full_name':worker.full_name, },status=status.HTTP_200_OK)
            except:
                return Response({'messages':'The user des not have a worker profile'},status=status.HTTP_401_UNAUTHORIZED)
        elif not user.is_worker :
            return Response({'messages':'This user is not a worker'},status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'messages':'The user des not exists'},status=status.HTTP_401_UNAUTHORIZED)
    