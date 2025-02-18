from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from worker.serializers import WorkerSerializer,JobSerializer
from worker.models import *
from .utils import send_rejection_email

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_jobs(*args, **kwargs):
    jobs = Jobs.objects.all().order_by('-id').values()
    serializer = JobSerializer(jobs, many=True) 
    return Response({'message': 'success','Jobs':serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_users(*args, **kwargs):
    Users = User.objects.all().exclude(is_superuser=True).order_by('-id').values()
    serializer = UserSerializer(Users, many=True) 
    return Response({'message': 'success','Users':serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_requests(*args, **kwargs):
    workers = Worker.objects.filter(is_verified=False)
    serializer = WorkerSerializer(workers, many=True) 
    return Response({'message': 'success','workers':serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_workers(*args, **kwargs):
    workers = Worker.objects.filter(is_verified=True)
    serializer = WorkerSerializer(workers, many=True) 
    return Response({'message': 'success','workers':serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restrict_user(request,*args, **kwargs):
    try:
        user_id = request.data.get('id')
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active  
        user.save()
        return Response({"message": "User status updated successfully!","status":user.is_active})
    except User.DoesNotExist:
        return Response({"message": "User not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restrict_job(request,*args, **kwargs):
    try:
        job_id = request.data.get('id')
        job = Jobs.objects.get(id=job_id)
        job.is_active = not job.is_active  
        job.save()
        return Response({"message": "JOB status updated successfully!","status":job.is_active})
    except User.DoesNotExist:
        return Response({"message": "JOB not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restrict_worker(request,*args, **kwargs):
    try:
        worker_id = request.data.get('id')
        worker = Worker.objects.get(id=worker_id)
        worker.is_active = not worker.is_active  
        worker.save()
        return Response({"message": "Worker status updated successfully!"},status=200)
    except:
        return Response({"message": "Worker not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_user(request,*args, **kwargs):
    try:
        user_id = request.data.get('id')
        user = User.objects.get(id=user_id)
        username = request.data.get('username')
        email = request.data.get('email')
        phone = request.data.get('phone')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        is_worker = request.data.get('is_worker')
        user.username = username
        user.email = email
        user.phone = phone
        user.first_name = first_name
        user.last_name = last_name
        user.is_worker = is_worker == "true" if True else False
        user.save()
        return Response({"message": "User details updated successfully!","status":user.is_active})
    except User.DoesNotExist:
        return Response({"message": "User not found."}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_job(request,*args, **kwargs):
    try:
        job_id = request.data.get('id')
        job = Jobs.objects.get(id=job_id)
        title = request.data.get('title')
        description = request.data.get('description')
        job.title = title
        job.description = description
        job.save()
        return Response({"message": "JOB details updated successfully!"},status=200)
    except User.DoesNotExist:
        return Response({"message": "JOB not found."}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_worker(request,*args, **kwargs):
    try:
        worker_id = request.data.get('id')
        job_id = request.data.get('job')
        worker = Worker.objects.get(id=worker_id)
        full_name = request.data.get('full_name')
        age = request.data.get('age')
        salary = request.data.get('salary')
        qualification = request.data.get('qualification')
        experience = request.data.get('experience')
        job = Jobs.objects.get(id=job_id)
        previous_company = request.data.get('previous_company')
        description = request.data.get('description')
        
        worker.full_name = full_name
        worker.age = age
        worker.salary = salary
        worker.qualification = qualification
        worker.experience = experience
        worker.job = job
        worker.previous_company = previous_company
        worker.description = description
        worker.save()
        return Response({"message": "Worker details updated successfully!"},status=200)
    except :
        return Response({"message": "Worker not found."}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request,*args, **kwargs):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        phone = request.data.get('phone')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        password = request.data.get('password')
        
        if User.objects.filter(phone=phone).exists():
            return Response({"message":"A user with this phone number already exists."},status=401)
        
        if User.objects.filter(email=email).exists():
            return Response({"message":"A user with this Email id already exists."},status=401)
        
        if User.objects.filter(username=username).exists():
            return Response({"message":"A user with this Username already exists."},status=401)
        
        user = User.objects.create(username=username,email=email,phone=phone,first_name=first_name,last_name=last_name,is_authenticated=True)
        user.set_password(password)
        user.save()
                
        return Response({"message": "User created successfully!"},status=201)
    except KeyError :
        return Response({"message":"Please rtecheck data"},status=401)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_worker(request,*args, **kwargs):
    try:
        user_id = request.data.get('user_id')
        print(request.data,user_id)
        job_id = request.data.get('job')
        user = User.objects.get(id=user_id)
        age = request.data.get('age')
        salary = request.data.get('salary')
        certificate = request.data.get('certificate')
        description = request.data.get('description')
        qualification = request.data.get('qualification')
        experience = request.data.get('experience')
        id_prof = request.data.get('id_prof')
        full_name = request.data.get('full_name')
        job = Jobs.objects.get(id=job_id)
        previous_company = request.data.get('previous_company')
        
        if Worker.objects.filter(user=user).exists():
            return Response({"message":"A Worker with this user model already exists."},status=401)
        user.is_worker = True
        user.save()
        worker = Worker.objects.create(
            age=age,
            salary=salary,
            certificate=certificate,
            description=description,
            qualification=qualification,
            experience=experience,
            id_prof=id_prof,
            full_name=full_name,
            is_verified=True,
            is_active=True,
            job=job,
            previous_company=previous_company,
            user=user
        )
        
        return Response({"message": "Worker created successfully!"},status=201)
    except :
        
        return Response({"message":"Please rtecheck data"},status=401)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request,*args, **kwargs):
    try:
        title = request.data.get('title')
        description = request.data.get('description')
        
        
        if Jobs.objects.filter(title__iexact=title).exists():
            return Response({"message":"A JOB with this title already exists."},status=401)
        job = Jobs.objects.create(title = title, description=description )
        
        return Response({"message": "JOB created successfully!"},status=201)
    except :
        
        return Response({"message":"Please rtecheck data"},status=401)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_worker_request(request,*args, **kwargs):
    try:
        worker_id = request.data.get('id')
        accept = request.data.get('accept')
        worker = Worker.objects.get(id=worker_id)
        if accept == 'true' :
            worker.is_verified = True 
            worker.save()
            return Response({"message": "Worker status updated successfully!"},status=200)
        elif accept == 'false':
            user = User.objects.filter(worker_profile__id=worker_id).first()
            reason = request.data.get('reason')
            send_rejection_email(email=user.email, name=worker.full_name, reason=reason)
            user.is_worker = False
            user.save()
            worker.delete()
            return Response({"message": "Worker deleted successfully!"},status=200)
    except Worker.DoesNotExist:
        return Response({"message": "Worker not found."}, status=404)
