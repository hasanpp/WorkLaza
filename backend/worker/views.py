from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Worker,Jobs, WorkerAvailability as Slots
from .serializers import WorkerSerializer,JobSerializer, SlotSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
import jwt

User = get_user_model()

JWT_SECRET_KEY = settings.JWT_SECRET_KEY
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def worker_register(request, *args, **kwargs):
    username = request.data.get('username')
    job_id = request.data.get('job')
    user = User.objects.get(username=username)
    job = Jobs.objects.get(id=job_id)
    if user.is_worker:
        return Response({'message':'Aldready reagisterd; request may under verification.'}, status=status.HTTP_200_OK)
    mutable_data = request.data
    mutable_data['user'] = user.id
    mutable_data['job'] = job.id
    serializer = WorkerSerializer(data=mutable_data)
    if serializer.is_valid():
        serializer.save(user=user)
        user.is_worker = True
        user.save()
        return Response({'message':'Worker registered successfully; request is under verification.'}, status=status.HTTP_201_CREATED)
    return Response({'messages':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def worker_view(request,*args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        if user.is_worker :
            gps = False
            try:
                worker = Worker.objects.get(user=user)
                if not worker.is_verified:
                    return Response({'messages':'The worker profile is not varified yet','is_verified':worker.is_verified},status=status.HTTP_401_UNAUTHORIZED)
                if not worker.is_active:
                    return Response({'messages':'Admin is blocked you profile','is_active':worker.is_active},status=status.HTTP_401_UNAUTHORIZED)
                if(not worker.latitude, not worker.longitude):
                    worker.latitude = request.data.get('latitude')
                    worker.longitude = request.data.get('longitude')
                    worker.save()
                return Response({'messages':'Loged In as a worker','full_name':worker.full_name,'gps':gps },status=status.HTTP_200_OK)
            except:
                return Response({'messages':'The user des not have a worker profile'},status=status.HTTP_401_UNAUTHORIZED)
        elif not user.is_worker :
            return Response({'messages':"You don't have access to this page"},status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'messages':"You don't have access to this page"},status=status.HTTP_401_UNAUTHORIZED)
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_jobs(*args, **kwargs):
    jobs = Jobs.objects.filter(is_active=True)
    serializer = JobSerializer(jobs, many=True) 
    return Response({'message': 'success','Jobs':serializer.data}, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_details(request,*args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        job_title = worker.job.title
        seriloised_data = WorkerSerializer(worker).data
        seriloised_data.update({'job':job_title})
        return Response({'messages':"Data featch successfully",'worker':seriloised_data },status=status.HTTP_200_OK)
    except:
        return Response({'messages':"An error occurd"},status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POSt'])
@permission_classes([IsAuthenticated])
def edit_details(request,*args, **kwargs):
    try:
        worker_id =  request.data.get('id')
        full_name =  request.data.get('full_name')
        age =  request.data.get('age')
        salary =  request.data.get('salary')
        experience =  request.data.get('experience')
        longitude =  request.data.get('longitude')
        latitude =  request.data.get('latitude')
        previous_company =  request.data.get('previous_company')
        description =  request.data.get('description')
        qualification =  request.data.get('qualification')
        
        if full_name.strip() == "" or qualification.strip() == "" or salary.strip() == "" :
            return Response({'message':"Full name, salary and education can't be empty"},status=status.HTTP_401_UNAUTHORIZED)
        
        if ( not age.isnumeric() ) or ( not salary.isnumeric() ) or ( not experience.isnumeric() ) :
            return Response({'message':"Age, salary and experience should be in number"},status=status.HTTP_401_UNAUTHORIZED)
        
        worker = Worker.objects.get(id=worker_id)
        
        worker.full_name = full_name
        worker.age = age
        worker.salary = salary
        worker.experience = experience
        worker.longitude = longitude
        worker.latitude = latitude
        worker.previous_company = previous_company
        worker.description = description
        worker.qualification = qualification
        worker.save()
        return Response({'message':"Data Updated successfully" },status=status.HTTP_200_OK)
    except:
        return Response({'message':"An error occurd"},status=status.HTTP_401_UNAUTHORIZED)
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_slot(request,*args, **kwargs) :
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        
        slots = Slots.objects.filter( worker=worker )
        slotSerializer = SlotSerializer(slots, many=True).data
        
        return Response({'message':"Slots get successfully",'slots':slotSerializer },status=status.HTTP_200_OK) 
    except: 
        return Response({'message':"Slots not found"},status=status.HTTP_409_CONFLICT) 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_slot(request,*args, **kwargs) :
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        
        day_of_week = request.data.get('week')
        start_time = request.data.get('from')
        end_time =  request.data.get('to')
        
        slot = Slots.objects.create(worker=worker,day_of_week=day_of_week,start_time=start_time,end_time=end_time,is_active=True)
        
        return Response({'message':"Slot created successfully"},status=status.HTTP_200_OK) 
    
    except: 
        return Response({'message':"Slots can't add now the time have some mistakes"},status=status.HTTP_409_CONFLICT) 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ban_slot(request,*args, **kwargs) :
    slot_id = request.data.get('id')
    try:
        slot = Slots.objects.get(id=slot_id)
        slot.is_active = not slot.is_active
        slot.save()
        
        return Response({'message':"Slot status updated successfully"},status=status.HTTP_200_OK) 
    
    except: 
        return Response({'message':"Slots status can't change now"},status=status.HTTP_409_CONFLICT) 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_slot(request,*args, **kwargs) : 
    slot_id = request.data.get('id')
    try:
        slot = Slots.objects.get(id=slot_id)
        slot.delete()
        
        return Response({'message':"Slot status updated successfully"},status=status.HTTP_200_OK) 
    
    except: 
        return Response({'message':"Slots can't delete now"},status=status.HTTP_409_CONFLICT) 
    