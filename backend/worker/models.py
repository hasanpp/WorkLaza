from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


# Create your models here.
class Worker(models.Model):
    age = models.CharField(max_length=2, blank=False, null=False)
    salary = models.CharField(max_length=4, blank=False, null=False)
    certificate = models.ImageField(upload_to='certificates/', blank=True, null=True)
    description = models.TextField()
    qualification = models.TextField()
    experience = models.CharField(max_length=2, blank=False, null=False)
    id = models.AutoField(primary_key=True)
    id_prof = models.ImageField(upload_to='id_profes/', blank=False, null=False)
    full_name = models.CharField(max_length=100, blank=False, null=False)
    is_verified = models.BooleanField(default=False,null=False,blank=False)
    job = models.CharField(max_length=16, blank=False, null=False)
    previous_company = models.CharField(max_length=16, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='worker_profile')
    
    def __str__(self):
        return self.full_name

