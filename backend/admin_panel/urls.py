from django.urls import path
from .views import *

urlpatterns = [
    path('view_users/', view_users, name='view_users'),
    path('view_requests/', view_requests, name='view_requests'),
    path('view_workers/', view_workers, name='view_workers'),
    path('restrict_user/', restrict_user, name='restrict_user'),
    path('restrict_worker/', restrict_worker, name='restrict_worker'),
    path('edit_user/', edit_user, name='edit_user'),
    path('edit_worker/', edit_worker, name='edit_worker'),
    path('create_user/', create_user, name='create_user'),
    path('create_worker/', create_worker, name='create_worker'),
    path('process_worker_request/', process_worker_request, name='process_worker_request'),
]
