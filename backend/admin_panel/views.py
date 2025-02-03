from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes


User = get_user_model()

@api_view(['GET'])
def view_users(*args, **kwargs):
    Users = User.objects.all().exclude(is_superuser=True)
    serializer = UserSerializer(Users, many=True) 
    return Response({'message': 'success','Users':serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
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
        user.is_worker = is_worker
        user.save()
        return Response({"message": "User details updated successfully!","status":user.is_active})
    except User.DoesNotExist:
        return Response({"message": "User not found."}, status=404)
    
@api_view(['POST'])
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
        
        user = User.objects.create(username=username,email=email,phone=phone,first_name=first_name,last_name=last_name)
        user.set_password(password)
        user.save()
                
        return Response({"message": "User created successfully!"},status=201)
    except :
        return Response({"message":"Please rtecheck data"},status=401)