from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now, timedelta



class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True)
    is_worker = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    google_id = models.CharField(max_length=255, blank=True, null=True)
    profile_picture_g = models.URLField(blank=True, null=True)
    google_login = models.BooleanField(default=False,blank=False,null=False)
    
    def __str__(self):
        return f"{self.username}"
    
    def generate_otp(self):
        import random
        self.otp = str(random.randint(1000, 9999))
        self.otp_expiration = now() + timedelta(minutes=1)
        self.save()
        
    def verify_otp(self, otp):
        if self.otp == otp and self.otp_expiration > now():
            self.is_authenticated = True
            self.otp = None
            self.save()
            return True
        return False