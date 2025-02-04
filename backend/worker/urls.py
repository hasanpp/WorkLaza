from django.urls import path
from .views import *

urlpatterns = [
    path('register/', worker_register, name='register'),
    path('worker_view/', worker_view, name='worker_view'),
]
