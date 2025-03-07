from django.db import models
from datetime import datetime
from user.models import CustomUser as User

class Jobs(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField()
    id = models.AutoField(primary_key=True)
    is_active = models.BooleanField(default=True,null=False,blank=False)
    
    def __str__(self):
        return self.title

class Worker(models.Model):
    full_name = models.CharField(max_length=100, blank=False, null=False)
    age = models.CharField(max_length=2, blank=False, null=False)
    experience = models.CharField(max_length=2, blank=False, null=False)
    previous_company = models.CharField(max_length=16, blank=True, null=True)
    salary = models.CharField(max_length=4, blank=False, null=False)
    certificate = models.ImageField(upload_to='certificates/', blank=True, null=True)
    description = models.TextField()
    qualification = models.TextField()
    id = models.AutoField(primary_key=True)
    id_prof = models.ImageField(upload_to='id_profes/', blank=True, null=True)
    is_verified = models.BooleanField(default=False,null=False,blank=False)
    is_active = models.BooleanField(default=True,null=False,blank=False)
    job = models.ForeignKey(Jobs, on_delete=models.DO_NOTHING,related_name='worker',blank=False, null=False)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField( blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='worker_profile')
    total_fee = models.FloatField(default=0.0, null=False, blank=False)
    payed_fee = models.FloatField(default=0.0, null=False, blank=False)
    pending_fee = models.FloatField(default=0.0, null=False, blank=False)
    
    def __str__(self):
        return self.full_name

class WorkerAvailability(models.Model):
    
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name="availabilities")
    day_of_week = models.CharField(choices=[ ('Monday', 'Monday'),  ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'), ('Sunday', 'Sunday')], max_length=10)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True,blank=False,null=False)
    id = models.AutoField(primary_key=True)
    
    
    class Meta:
        unique_together = ('worker', 'day_of_week', 'start_time')

    def __str__(self):
        return f"{self.worker.full_name} - {self.day_of_week} {self.start_time} - {self.end_time}"
    
    def get_time_difference(self):
        
        start_datetime = datetime.combine(datetime.today(), self.start_time)
        end_datetime = datetime.combine(datetime.today(), self.end_time)

        time_diff = end_datetime - start_datetime
        hours = time_diff.total_seconds() // 3600
        return int(hours)

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    