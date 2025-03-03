from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Wallet

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class WalletSerializer(serializers.ModelSerializer):
    worker_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = Wallet
        fields = '__all__'
        
    def get_worker_profile(self, obj):
        worker = obj.worker
        
        if worker and worker.user:
            return { 'id': worker.id, 'full_name': worker.full_name, 'profile_picture': worker.user.profile_picture.url if worker.user.profile_picture else None }
        
        return None