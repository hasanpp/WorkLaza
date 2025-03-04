from rest_framework import serializers
from .models import ChatRoom,Message

class ChatSerializer(serializers.ModelSerializer):
    user1_profile = serializers.SerializerMethodField() 
    user2_profile = serializers.SerializerMethodField() 

    class Meta:
        model = ChatRoom
        fields = '__all__'
        
    def get_user1_profile(self, obj):
            user1 = obj.user1
            if user1 :
                return { 'id': user1.id, 'first_name': user1.first_name, 'last_name':user1.last_name, 'username': user1.username,'profile_picture': user1.profile_picture.url if user1.profile_picture else None }
            
            return None
    def get_user2_profile(self, obj):
            user2 = obj.user2
            if user2 :
                return { 'id': user2.id, 'first_name': user2.first_name, 'last_name':user2.last_name, 'username': user2.username,'profile_picture': user2.profile_picture.url if user2.profile_picture else None }
            
            return None

class MessageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Message
        fields = '__all__'

