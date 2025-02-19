from .serializers import SignUpSerializer,UserSerializer,ProfilePictureSerializer
from worker.serializers import WorkerSerializer, WorkersSerializer
from .utils import send_otp_email
from .models import Saved_Workers
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from dj_rest_auth.registration.views import SocialLoginView
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.db.models import F
from django.conf import settings
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from  worker.models import *
from datetime import datetime,timedelta
from  booking.models import Booking
from booking.serializers import BookingSerializer
from math import sin, cos, sqrt, atan2, radians
import jwt
import requests
import hmac
import hashlib
import base64


User = get_user_model()
JWT_SECRET_KEY = settings.JWT_SECRET_KEY

def encrypt_deterministic(text):
    key = settings.SECRET_KEY.encode()
    hashed = hmac.new(key, text.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(hashed).decode()

@api_view(['POST'])
@permission_classes([AllowAny])
def get_emaiil_from_id(request,  *args, **kwargs):
    identifire = request.data.get('identifire')
    try:
        user = User.objects.filter(username=identifire).first() or \
               User.objects.filter(email=identifire).first() or \
               User.objects.filter(phone=identifire).first()
        return Response({'message': 'success','email':user.email}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'No user exists with this identifire'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def change_password(request,  *args, **kwargs):
    email = request.data.get('email')
    password = request.data.get('password')
    if not password.strip():
        return Response({'message': "Password can't be completely empty"}, status=status.HTTP_401_UNAUTHORIZED)
        
    try:
        user = User.objects.filter(email=email).first()
        user.set_password(password)
        user.save()
        
        return Response({'message': 'Password changed successfully', "username":user.username}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'No user exists with this identifire'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request,  *args, **kwargs):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        user.generate_otp()
        send_otp_email(user)
        return Response({'message': 'OTP sent successfully!'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'No user exists with this email'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request,  *args, **kwargs):
    email = request.data.get('email')
    otp = request.data.get('otp')
    print(email,otp)
    try:
        user = User.objects.get(email=email)
        print(user.username, otp)
        if user.verify_otp(otp):
            return Response({'message': 'OTP verified successfully!',"username":user.username}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'message': 'No user exists with this email'}, status=status.HTTP_400_BAD_REQUEST)
    

class SignupView(APIView):
    permission_classes=[AllowAny]
    def post(self, request, *args, **kwargs):
        required_fields = ['username', 'password', 'email', 'phone', 'first_name', 'last_name']
        
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = SignUpSerializer(data=request.data)    
            
        if serializer.is_valid():
            user = serializer.save()
            user.generate_otp() 
            send_otp_email(user)
            return Response({'message': 'User created successfully! Please verify your email.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SignInView(APIView):
    permission_classes = [AllowAny]
    
    def get_user_by_identifier(self, identifier):
        user = User.objects.filter(username=identifier).first() or \
               User.objects.filter(email=identifier).first() or \
               User.objects.filter(phone=identifier).first()
        return user
    
    def authenticate_user(self, user, password, request):
        
        if not user.is_active:
            return Response({'message': 'This user is blocked by the admin'},status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_authenticated:
            send_otp_email(user)
            return Response({'message': 'User is not authenticated Please verify email with otp','email_varify':True}, status=status.HTTP_401_UNAUTHORIZED)
        
        authenticated_user = authenticate(username=user.username, password=password)
        
        if authenticated_user:
            
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            return Response({'message': 'Sign-in successful!', "username":user.username},status=status.HTTP_200_OK)
        return Response({'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        identifier = data.get('identifire')
        password = data.get('password')
        
        if not identifier or not password:
            return Response({'message': 'Identifier and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = self.get_user_by_identifier(identifier)
        
        if not user:
            
            return Response({'message': 'No user exists with this identifier'}, status=status.HTTP_401_UNAUTHORIZED)
            
        return self.authenticate_user(user, password, request)
    

    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def view_profile(request, *args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response({'user':serializer.data}, status=status.HTTP_200_OK)
    except:
        return Response({ 'message' :"The user not found"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def edit_details(request, *args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        username = request.data.get('username')
        phone = request.data.get('phone')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        if user.username != username:
            if User.objects.filter(username=username).exists():
                return Response({ 'message' :"Username already exists!"}, status=status.HTTP_409_CONFLICT)
            unvalid = ["!","@","#","$","%","^","&","*","(",")","`"," ","?","/","|","\\",'"',"{","}","[","]","-","=","+","~"]
            for element in unvalid:
                if element in username:
                    return Response({ 'message' :f"{element} can't be allowed in username"}, status=status.HTTP_409_CONFLICT)
            if len(username) == 0:
                return Response({ 'message' :"Username can't be empty"}, status=status.HTTP_409_CONFLICT)
            user.username = username
        if user.phone != phone:
            if phone.isdigit() and 10 <= len(phone) <= 15:
                user.phone = phone
            else:
                return Response({ 'message' :"Phone number unvalid "}, status=status.HTTP_409_CONFLICT)
        if user.first_name != first_name:
            if first_name.strip() == "":
                return Response({ 'message' :"First name can't be completly empty"}, status=status.HTTP_409_CONFLICT)
            user.first_name = first_name
        if user.last_name != last_name:
            user.last_name = last_name
        user.save()
        return Response({'message':'The user details updated successfully'}, status=status.HTTP_200_OK)
    except:
        return Response({ 'message' :"The user not found"}, status=status.HTTP_401_UNAUTHORIZED)


class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    permission_classes=[AllowAny]
    provider_id = "google"
    profile_url = "https://www.googleapis.com/oauth2/v3/userinfo" 

    def _fetch_user_info(self, token):
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(self.profile_url, headers=headers)
        print(f"Google API Response: {response.status_code} - {response.text}")
        
        response.raise_for_status()
        return response.json()


class GoogleLogin(SocialLoginView): 
    permission_classes=[AllowAny]
    adapter_class = CustomGoogleOAuth2Adapter
    callback_url = "http://localhost:5173/"
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"message": "Missing access_token"}, status=status.HTTP_400_BAD_REQUEST)
        decoded = jwt.decode(access_token, options={"verify_signature":False})
        email = decoded['email']
        username = decoded['name'].replace(" ", "")
        profile_picture_g = decoded['picture']
        first_name = decoded['given_name']
        last_name = decoded['family_name']
        
        if User.objects.filter(email=email).exists():
            if User.objects.get(email=email).google_login == True:
                user = User.objects.get(email=email)
                password = encrypt_deterministic(user.username)
                user.set_password(password)
                user.save()
                return Response({"message": "Google login successfull","username":user.username,"password":password}, status=status.HTTP_200_OK)
            return Response({"message": "Your email id is exatly mathing with one account please sign in with email"}, status=status.HTTP_409_CONFLICT)
        elif User.objects.filter(username=username).exists():
            return Response({"message": "Your Google user name is exatly mathing with one account please sign in with username"}, status=status.HTTP_409_CONFLICT)
            
        else :
            user = User.objects.create(username=username,email=email,profile_picture_g=profile_picture_g,phone=None,is_worker=False,is_authenticated=True,first_name=first_name,last_name=last_name,google_login=True,is_active=True)
            password = encrypt_deterministic(user.username)
            user.set_password(password)
            user.save()
            return Response({"message": "Google login successfull","username":user.username,"password":password}, status=status.HTTP_200_OK)
        


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request, *args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    user = User.objects.get(id=user_id)
        
    serializer = ProfilePictureSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile picture updated successfully", "profile_picture": user.profile_picture.url}, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def token_data(request, *args, **kwargs):
    token = request.data.get('token')
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    user = User.objects.get(id=user_id)
    
    if user.is_superuser:
        role = 'admin'
    elif user.is_worker:
        role = 'worker'
    else :
        role = 'user'
    
    return Response({"username":user.username,"first_name":user.first_name,"last_name":user.last_name,"role":role}, status=status.HTTP_200_OK)


def haversine(lat1, lon1, lat2, lon2):
    R = 6371  
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    return R * c

@api_view(['POST'])
@permission_classes([AllowAny])
def view_workers(request, *args, **kwargs):
    try:
        user_latitude = request.data.get('latitude')
        user_longitude = request.data.get('longitude')
        
        if not user_latitude or not user_longitude:
            return Response({"message": "Latitude and Longitude are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_latitude == 0 or user_latitude == 0 :
            workers = Worker.objects.filter(is_active=True, latitude__isnull=False, longitude__isnull=False).select_related('job', 'user').prefetch_related('availabilities')
            serialized_data = WorkersSerializer(workers, many=True).data
            return Response({"message": "Latitude and Longitude are not submited"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_latitude, user_longitude = float(user_latitude), float(user_longitude)
        workers = Worker.objects.filter(is_active=True, latitude__isnull=False, longitude__isnull=False).select_related('job', 'user').prefetch_related('availabilities')
        
        
        worker_list = []
        
        for worker in workers:
            distance = haversine(user_latitude, user_longitude, worker.latitude, worker.longitude)
            worker_list.append({ "worker": worker, "distance": distance })
            
        worker_list = sorted(worker_list, key=lambda x: x["distance"])
        sorted_workers = [item["worker"] for item in worker_list]
        serialized_data = WorkersSerializer(sorted_workers, many=True).data
        
        # serialized_data = WorkersSerializer(workers, many=True).data
        
        return Response({"message":"OK success","Workers":serialized_data}, status=status.HTTP_200_OK)
    except :
        return Response({"message":"No workers awailable in your area"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def view_worker(request, *args, **kwargs):
    
    try:
        worker_id = request.data.get('id')
        worker = Worker.objects.filter(id=worker_id).select_related('job', 'user').prefetch_related('availabilities').first()
        
        serialized_data = WorkersSerializer(worker ).data
        return Response({"message":"got the worker data","worker":serialized_data}, status=status.HTTP_200_OK)
    except: 
        return Response({"message":"There are No workers with this id"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_worker(request, *args, **kwargs):
    try:
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
        user_id = decoded['user_id']
        user = User.objects.get(id=user_id)
        worker_id = request.data.get('worker_id')
        worker  = Worker.objects.get(id=worker_id)
        
        if Saved_Workers.objects.filter(user=user,worker=worker).exists() :
            return Response({"message":"Worker already in saved"}, status=status.HTTP_200_OK)
        save_worker = Saved_Workers.objects.create(user=user,worker=worker)
        return Response({"message":"Worker saved"}, status=status.HTTP_200_OK)
    except Exception as e: 
        return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_saved_worker(request, *args, **kwargs):
    try:
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
        user_id = decoded['user_id']
        user = User.objects.get(id=user_id)
        worker_id = request.data.get('worker_id')
        worker  = Worker.objects.get(id=worker_id)
        
        if not Saved_Workers.objects.filter(user=user,worker=worker).exists() :
            return Response({"message":"This worker is not in your saved list"}, status=status.HTTP_400_OK)
        save_worker = Saved_Workers.objects.filter(user=user,worker=worker).first().delete()
        return Response({"message":"Worker removed from saved"}, status=status.HTTP_200_OK)
    except Exception as e: 
        return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_saved_worker(request, *args, **kwargs):
    try:
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
        user_id = decoded['user_id']
        user = User.objects.get(id=user_id)
        saved_workers = Saved_Workers.objects.filter(user=user)
        if not saved_workers.exists():
            return Response({"message": "You have not saved any workers yet."}, status=status.HTTP_200_OK)
        
        
        workers = [saved_worker.worker for saved_worker in saved_workers]
        
        serialized_data = WorkersSerializer(workers, many=True).data
        return Response({ "workers": serialized_data}, status=status.HTTP_200_OK)
    except Exception as e: 
        return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_worker (request, *args, **kwargs):
        required_fields = [ 'latitude', 'longitude', 'selectedDay', 'selectedSlot', 'issueDescription', 'address' ,'duration']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response( {'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST )
        try:
            token = request.headers['Authorization'][7:]
            decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            user_id = decoded['user_id']
            
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            address = request.data.get('address')
            bookedDate = request.data.get('bookedDate')
            bookedTime = request.data.get('bookedTime')
            selectedDay = request.data.get('selectedDay').split(" ")[1]
            slot_id = request.data.get('selectedSlot')
            worker_id = request.data.get('worker')
            previousIssues = request.data.get('previousIssues')
            damagedParts = request.data.get('damagedParts')
            issueDescription = request.data.get('issueDescription')
            duration = int(request.data.get('duration'))
            total = int(request.data.get('total'))
            
            try:
                selectedDay = datetime.strptime(selectedDay, '%m/%d/%Y').date()
            except ValueError:
                return Response({"error": "Invalid date format for 'selectedDay', use MM/DD/YYYY."}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(id=user_id)
            worker = Worker.objects.get(id=worker_id)
            slot = WorkerAvailability.objects.get(id=slot_id)
            
            if Booking.objects.filter(slot=slot, booked_date=selectedDay).exists:
                
                previus_boookings = Booking.objects.filter(slot=slot, booked_date=selectedDay)
                total_duration = 0
                
                for p in previus_boookings:
                    total_duration += int(p.duration)
                    
                slot_duration = slot.get_time_difference()    
                
                if slot_duration - total_duration < duration:
                        return Response({"message": "The slot don't have vackend space for your duration"}, status=status.HTTP_400_BAD_REQUEST)
            
            booking = Booking.objects.create(
            user=user,
            worker=worker,
            job=worker.job,
            slot=slot,
            latitude=latitude,
            longitude=longitude,
            address=address,
            booked_date=selectedDay,
            booking_time=bookedTime,
            booking_date=bookedDate,
            any_previous_issues=previousIssues,
            damaged_parts=damagedParts,
            details=issueDescription,
            duration=str(duration),
            status='created',
            total=total,
            )
            
            image = request.data.get('photo')
            
            if image:
                booking.photo = image
                booking.save()
            
            return Response({"message": "Booking successful, worker will contact you."}, status=status.HTTP_200_OK)
        
        except Worker.DoesNotExist:
            return Response({"error": "Worker not found."}, status=status.HTTP_404_NOT_FOUND)
        except WorkerAvailability.DoesNotExist:
            return Response({"error": "Selected slot is unavailable."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bookings(request, *args, **kwargs):
    try:
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = decoded['user_id']
        user = User.objects.get(id=user_id)
        bookings = Booking.objects.filter(user=user)
        
        serialized_data = BookingSerializer(bookings, many=True).data
        
        return Response({"message":"OK success","Bookings":serialized_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_booking(request, booking_id, *args, **kwargs):
    try:
        booking = Booking.objects.get(id=booking_id)
        serialized_data = BookingSerializer(booking).data
        return Response({"message": "OK success", "Booking": serialized_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id, *args, **kwargs):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.status = "canceled"
        booking.save()
        return Response({"message": "Booking canceled"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
