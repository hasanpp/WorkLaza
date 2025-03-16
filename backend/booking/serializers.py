from rest_framework import serializers
from .models import Booking, Review
from user.models import CustomUser as User
from worker.models import Worker, Jobs, WorkerAvailability as Slot

    
class ReviewSerializer(serializers.ModelSerializer):
    worker_profile = serializers.SerializerMethodField()
    user_profile = serializers.SerializerMethodField()
    booking_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = '__all__'
        
        
    def get_booking_details(self,obj):
        booking = obj.booking
        if booking :
            return {'id': booking.id, 'title':booking.title, 'details':booking.details}    
        return None 
    
    def get_worker_profile(self, obj):
        worker = obj.worker
        
        if worker and worker.user:
            return { 'id': worker.id, 'full_name': worker.full_name, 'profile_picture': worker.user.profile_picture.url if worker.user.profile_picture else None }
        
        return None
    
    def get_user_profile(self, obj):
        user = obj.user
        
        if user :
            return { 'id': user.id, 'first_name': user.first_name, 'last_name':user.last_name, 'username': user.username,'profile_picture': user.profile_picture.url if user.profile_picture else None }
        
        return None
    
    
class BookingSerializer(serializers.ModelSerializer):
    worker_profile = serializers.SerializerMethodField()
    user_profile = serializers.SerializerMethodField()
    job_details = serializers.SerializerMethodField()
    slot_details = serializers.SerializerMethodField()
    review_details = serializers.SerializerMethodField()
    
    
    class Meta:
        model = Booking
        fields = '__all__' 
        
    def get_worker_profile(self, obj):
        worker = obj.worker
        
        if worker and worker.user:
            return {
                'id': worker.id, "user_id":worker.user.id,'full_name': worker.full_name, 'latitude':worker.latitude, 'longitude':worker.longitude, 'profile_picture': worker.user.profile_picture.url if worker.user.profile_picture else None
            }
        
        return None
    
    def get_user_profile(self, obj):
        user = obj.user
        
        if user :
            return {
                'id': user.id, 'username': user.username
            }
        
        return None
    
    def get_job_details(self, obj):
        job = obj.job
        if job :
            return {
                'id': job.id, 'job': job.title
            }
        
        return None
    
    def get_slot_details(self, obj):
        slot = obj.slot
        if slot :
            return {
                'id': slot.id, 'day_of_week': slot.day_of_week, 'end_time':slot.end_time, 'start_time':slot.start_time
            }
        
        return None
    
    def get_review_details(self, obj):
        
        if obj.review:
            review = obj.review.first()
            if review:  
                return {
                    'id': review.id, 'rating': str(review.rating), 'title': review.title, 'description': review.description,
                }
        return None