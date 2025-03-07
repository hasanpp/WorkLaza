from django.contrib import admin
from .models import CustomUser as User
from .models import Saved_Workers

# Register your models here.

admin.site.register(User)
admin.site.register(Saved_Workers)