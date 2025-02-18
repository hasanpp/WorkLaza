from django.db import models
from django.contrib.auth import get_user_model
from worker.models import Worker,Jobs, WorkerAvailability as Slot
User = get_user_model()


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING,related_name='bookings')
    worker = models.ForeignKey(Worker,on_delete=models.DO_NOTHING, related_name='bookings')
    job = models.ForeignKey(Jobs, on_delete=models.DO_NOTHING, related_name='bookings')
    slot = models.ForeignKey(Slot, on_delete=models.DO_NOTHING, related_name='booking')
    duration = models.CharField( max_length=50)
    any_previous_issues = models.TextField()
    damaged_parts = models.TextField()
    details = models.TextField()
    booked_date = models.DateField(auto_now=False, auto_now_add=False, blank=True, null=True)
    booking_date = models.DateField(auto_now=False, auto_now_add=False, blank=True, null=True)
    booking_time = models.TimeField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    longitude = models.FloatField(blank=False, null=False)
    latitude = models.FloatField( blank=False, null=False)
    photo = models.ImageField(upload_to='booking_photos/', null=True, blank=True)
    
    STATUS_CHOICES = [
        ('created', 'Booking Created'),
        ('accepted', 'Labor Accepted'),
        ('rejected', 'Rejected'),
        ('pending', 'Work Pending'),
        ('completed', 'Completed'),
        ('visited', 'Place Visited'),
        ('liked', 'User Like'),
    ]
    status = models.CharField( max_length=10, choices=STATUS_CHOICES, default='created' )

    