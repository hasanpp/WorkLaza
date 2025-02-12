from django.urls import path
from .views import *

urlpatterns = [
    path('register/', worker_register, name='register'),
    path('worker_view/', worker_view, name='worker_view'),
    path('view_jobs/', view_jobs, name='view_jobs'),
    path('view_details/', view_details, name='view_details'),
    path('edit_details/', edit_details, name='edit_details'),
    
    path('view_slot/', view_slot, name='view_slot'),
    path('delete_slot/', delete_slot, name='delete_slot'),
    path('ban_slot/', ban_slot, name='ban_slot'),
    path('add_slot/', add_slot, name='add_slot'),
]
