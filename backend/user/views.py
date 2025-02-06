from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import SignUpSerializer,UserSerializer,ProfilePictureSerializer
from .utils import send_otp_email
from django.http import JsonResponse
from django.conf import settings
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.shortcuts import render
import jwt
import requests



User = get_user_model()

class TokenView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')

        if not access_token:
            return JsonResponse({"error": "Access token missing"}, status=400)

        try:
            decoded = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded['user_id']  
            user = User.objects.get(id=user_id)
            refresh_token = self.create_refresh_token(user)

            response = JsonResponse({"message": "Access token validated"})
            response.set_cookie(
                'refresh_token', 
                refresh_token, 
                httponly=True, 
                secure=True, 
                max_age=60*60  
            )
            return response
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

    def create_refresh_token(self, user):
        payload = {"user_id": user.id, "is_admin":user.is_superuser, "is_worker": user.is_worker, "type": "refresh"}
        refresh_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return refresh_token

@api_view(['POST'])
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
def change_password(request,  *args, **kwargs):
    email = request.data.get('email')
    password = request.data.get('password')
    if not password.strip():
        return Response({'message': "Password can't be completely empty"}, status=status.HTTP_401_UNAUTHORIZED)
        
    try:
        user = User.objects.filter(email=email).first()
        user.set_password(password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'No user exists with this identifire'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def send_otp(request,  *args, **kwargs):
    permission_classes=[AllowAny]
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        user.generate_otp()
        send_otp_email(user)
        return Response({'message': 'OTP sent successfully!',}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'No user exists with this email'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def verify_otp(request,  *args, **kwargs):
    permission_classes=[AllowAny]
    email = request.data.get('email')
    otp = request.data.get('otp')
    try:
        user = User.objects.get(email=email)
        if user.verify_otp(otp):
            refresh = RefreshToken.for_user(user)
            refresh.payload['is_admin'] = user.is_superuser
            refresh.payload['is_worker'] = user.is_worker
            access_token = str(refresh.access_token)
            request.session['refresh_token'] = str(refresh)
            request.session['access_token'] = access_token
            return Response({'message': 'OTP verified successfully!','first_name':user.first_name, 'last_name':user.last_name, 'Username':user.username, 'refresh': str(refresh), 'is_admin':user.is_superuser, 'is_worker':user.is_worker, 'access': access_token}, status=status.HTTP_200_OK)
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
    
    def get_user_by_identifier(self, identifier):
        user = User.objects.filter(username=identifier).first() or \
               User.objects.filter(email=identifier).first() or \
               User.objects.filter(phone=identifier).first()
        return user
    
    def authenticate_user(self, user, password, request):
        
        if not user.is_authenticated:
            send_otp_email(user)
            return Response({'message': 'User is not authenticated Please verify email with otp','email_varify':True}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active:
            return Response({'message': 'This user is blocked by the admin'},status=status.HTTP_401_UNAUTHORIZED)
        
        authenticated_user = authenticate(username=user.username, password=password)
        
        if authenticated_user:
            refresh = RefreshToken.for_user(authenticated_user)
            refresh.payload['is_admin'] = user.is_superuser
            refresh.payload['is_worker'] = user.is_worker
            access_token = str(refresh.access_token)
            request.session['refresh_token'] = str(refresh)
            request.session['access_token'] = access_token
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            return Response({'message': 'Sign-in successful!', 'first_name':user.first_name, 'last_name':user.last_name, 'Username':user.username, 'refresh': str(refresh), 'is_admin':user.is_superuser, 'is_worker':user.is_worker, 'access': access_token},status=status.HTTP_200_OK)
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
def get_tokens(request):
    access_token = request.session.get('access_token')
    refresh_token = request.session.get('refresh_token')
    if not access_token:
        return Response({'message': 'User not Loged in'}, status=401)
     
    return Response({ 'access_token' :access_token, 'refresh_token':refresh_token}, status=status.HTTP_200_OK)

    
    
@api_view(['POST'])
def view_profile(request, *args, **kwargs):
    username = request.data.get('username')
    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response({'user':serializer.data}, status=status.HTTP_200_OK)
    except:
        return Response({ 'message' :"The user not found"}, status=status.HTTP_401_UNAUTHORIZED)


class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    provider_id = "google"
    profile_url = "https://www.googleapis.com/oauth2/v3/userinfo" 

    def _fetch_user_info(self, token):
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(self.profile_url, headers=headers)
        print(f"Google API Response: {response.status_code} - {response.text}")
        
        response.raise_for_status()
        return response.json()


class GoogleLogin(SocialLoginView): 
    
    adapter_class = CustomGoogleOAuth2Adapter
    callback_url = "http://localhost:5173/"
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"message": "Missing access_token"}, status=status.HTTP_400_BAD_REQUEST)
        decoded = jwt.decode(access_token, options={"verify_signature":False})
        email = decoded['email']
        username = decoded['name']
        profile_pic_g = decoded['picture']
        first_name = decoded['given_name']
        last_name = decoded['family_name']
        
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.profile_picture_g = profile_pic_g
            user.save()
            return Response({"message": "Google login successfull", 'is_admin':False, 'is_worker':user.is_worker,'username':username,'access_token':str(access_token),'refresh':str(access_token),'first_name':user.first_name,'last_name':user.last_name}, status=status.HTTP_200_OK)
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            user.profile_picture_g = profile_pic_g
            user.save()
            return Response({"message": "Google login successfull",'is_admin':False, 'is_worker':user.is_worker,'username':user.username,'access_token':str(access_token),'refresh':str(access_token),'first_name':user.first_name,'last_name':user.last_name}, status=status.HTTP_200_OK)
        try:
            user = User.objects.create(username=username,email=email,profile_picture_g=profile_pic_g,phone=None,is_worker=False,is_authenticated=True,first_name=first_name,last_name=last_name)
            return Response({"message": "Google login successfull",'is_admin':False, 'is_worker':user.is_worker,'username':user.username,'access_token':str(access_token),'refresh':str(access_token),'first_name':user.first_name,'last_name':user.last_name}, status=status.HTTP_201_CREATED)
        except:
            return Response({"message": "Google login failed"}, status=status.HTTP_400_BAD_REQUEST)
        


@api_view(['POST'])
@permission_classes([AllowAny])
def upload_profile_picture(request, *args, **kwargs):
    
    username = request.data.get('username') 
    user = User.objects.get(username=username)
        
    serializer = ProfilePictureSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile picture updated successfully", "profile_picture": user.profile_picture.url}, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)