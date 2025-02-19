from rest_framework import serializers
from .models import Booking
from django.contrib.auth import get_user_model
from worker.models import Worker

User = get_user_model()

class BookingSerializer(serializers.ModelSerializer):
    worker_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = '__all__' 
        
    def get_worker_profile(self, obj):
        worker = obj.worker
        
        if worker and worker.user:
            return {
                'id': worker.id, 'full_name': worker.full_name, 'profile_picture': worker.user.profile_picture.url if worker.user.profile_picture else None
            }
        
        return None