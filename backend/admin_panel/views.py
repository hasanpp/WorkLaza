from rest_framework.decorators import api_view, permission_classes
from user.models import CustomUser as User
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,WalletSerializer
from rest_framework.permissions import IsAuthenticated
from worker.serializers import WorkerSerializer,JobSerializer
from booking.serializers import BookingSerializer
from worker.models import *
from .models import Wallet
from booking.models import Booking
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .utils import send_rejection_email


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_jobs(*args, **kwargs):
    jobs = Jobs.objects.all().order_by('-id').values()
    serializer = JobSerializer(jobs, many=True) 
    return Response({'message': 'success','Jobs':serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bookings(*args, **kwargs):
    try:
        bookings = Booking.objects.all()
        
        serialized_data = BookingSerializer(bookings, many=True).data
        
        return Response({"message":"OK success","Bookings":serialized_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_wallet(*args, **kwargs):
    try:
        wallet = Wallet.objects.all()
        balence = Wallet.objects.filter(status="success",type="credit").aggregate(Sum('amount'))
        serialized_data = WalletSerializer(wallet, many=True).data
        return Response({"message":"OK success","Wallet":serialized_data, "balence":(balence['amount__sum']/100)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


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
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"message": "JOB not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restrict_worker(request,*args, **kwargs):
    try:
        worker_id = request.data.get('id')
        worker = Worker.objects.get(id=worker_id)
        worker.is_active = not worker.is_active  
        worker.save()
        return Response({"message": "Worker status updated successfully!"},status=status.HTTP_200_OK)
    except Worker.DoesNotExist:
        return Response({"message": "Worker not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

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
        return Response({"message": "JOB details updated successfully!"},status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message": "JOB not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

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
        return Response({"message": "Worker details updated successfully!"},status=status.HTTP_200_OK)
    except Worker.DoesNotExist:
        return Response({"message": "Worker not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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
            return Response({"message":"A user with this phone number already exists."},status=status.HTTP_401_UNAUTHORIZED)
        
        if User.objects.filter(email=email).exists():
            return Response({"message":"A user with this Email id already exists."},status=status.HTTP_401_UNAUTHORIZED)
        
        if User.objects.filter(username=username).exists():
            return Response({"message":"A user with this Username already exists."},status=status.HTTP_401_UNAUTHORIZED)
        
        user = User.objects.create(username=username,email=email,phone=phone,first_name=first_name,last_name=last_name,is_authenticated=True)
        user.set_password(password)
        user.save()
                
        return Response({"message": "User created successfully!"},status=status.HTTP_201_CREATED)
    except KeyError :
        return Response({"message":"Please rtecheck data"},status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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
            return Response({"message":"A Worker with this user model already exists."},status=status.HTTP_401_UNAUTHORIZED)
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
        
        return Response({"message": "Worker created successfully!"},status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request,*args, **kwargs):
    try:
        title = request.data.get('title')
        description = request.data.get('description')
        
        
        if Jobs.objects.filter(title__iexact=title).exists():
            return Response({"message":"A JOB with this title already exists."},status=status.HTTP_401_UNAUTHORIZED)
        job = Jobs.objects.create(title = title, description=description )
        
        return Response({"message": "JOB created successfully!"},status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

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
            return Response({"message": "Worker status updated successfully!"},status=status.HTTP_200_OK)
        elif accept == 'false':
            user = User.objects.filter(worker_profile__id=worker_id).first()
            reason = request.data.get('reason')
            send_rejection_email(email=user.email, name=worker.full_name, reason=reason)
            user.is_worker = False
            user.save()
            worker.delete()
            return Response({"message": "Worker deleted successfully!"},status=status.HTTP_200_OK)
    except Worker.DoesNotExist:
        return Response({"message": "Worker not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_dash_board(request, *args, **kwargs):
    try:
        time_period = request.query_params.get('period', 'week')
        now = timezone.now()
        
        start_of_week = now - timedelta(days=now.weekday())
        start_of_last_week = start_of_week - timedelta(days=7)
        end_of_last_week = start_of_week - timedelta(seconds=1)
        
        new_users = User.objects.filter(date_joined__gte=start_of_week).count()
        new_users_last_week = User.objects.filter(date_joined__range=(start_of_last_week, end_of_last_week)).count()
        new_bookings = Booking.objects.filter(booking_date__gte=start_of_week).count()
        new_bookings_last_week = Booking.objects.filter(booking_date__range=(start_of_last_week, end_of_last_week)).count()
        new_workers = Worker.objects.filter(user__date_joined__gte=start_of_week).count()
        new_workers_last_week = Worker.objects.filter(user__date_joined__range=(start_of_last_week, end_of_last_week)).count()

        difference_new_users = new_users - new_users_last_week
        difference_new_bookings = new_bookings - new_bookings_last_week
        difference_new_workers = new_workers - new_workers_last_week
        
        booking_data = []
        
        if time_period == 'day':
            for i in range(6, -1, -1):
                date = now.date() - timedelta(days=i)
                count = Booking.objects.filter(booking_date=date).count()
                booking_data.append({ 'label': date.strftime('%a'), 'date': date.strftime('%Y-%m-%d'), 'count': count })
                
        elif time_period == 'month':
            current_month = now.month
            current_year = now.year
            for i in range(5, -1, -1):
                month = (current_month - i) % 12
                if month == 0:
                    month = 12
                year = current_year - ((current_month - month) // 12)
                month_start = timezone.datetime(year, month, 1, tzinfo=timezone.get_current_timezone()).date()
                if month == 12:
                    month_end = timezone.datetime(year + 1, 1, 1, tzinfo=timezone.get_current_timezone()).date() - timedelta(days=1)
                else:
                    month_end = timezone.datetime(year, month + 1, 1, tzinfo=timezone.get_current_timezone()).date() - timedelta(days=1)
                count = Booking.objects.filter(booking_date__range=(month_start, month_end)).count()
                booking_data.append({
                    'label': timezone.datetime(year, month, 1).strftime('%b'), 'date':timezone.datetime(year, month, 1).strftime('%Y-%m'), 'count':count })
                
        elif time_period == 'year':
            current_year = now.year
            for i in range(5, -1, -1):
                year = current_year - i
                year_start = timezone.datetime(year, 1, 1, tzinfo=timezone.get_current_timezone()).date()
                year_end = timezone.datetime(year, 12, 31, tzinfo=timezone.get_current_timezone()).date()
                
                count = Booking.objects.filter( booking_date__range=(year_start, year_end) ).count()
                booking_data.append({ 'label': str(year), 'date': str(year), 'count': count })
                
        else:
            for i in range(7):
                day = (start_of_week + timedelta(days=i)).date()
                count = Booking.objects.filter(booking_date=day).count()
                booking_data.append({ 'label': day.strftime('%a'), 'date': day.strftime('%Y-%m-%d'), 'count': count })
        
        
        return Response({'message': "Data feached successfully!", "new_users":new_users, "difference_new_users": difference_new_users, "new_bookings":new_bookings, "difference_new_bookings":difference_new_bookings, "new_workers":new_workers, "difference_new_workers":difference_new_workers, "booking_data": booking_data, "period": time_period}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)