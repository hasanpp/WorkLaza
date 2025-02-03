from django.urls import path
from .views import *

urlpatterns = [
    path('view_users/', view_users, name='view_users'),
    path('restrict_user/', restrict_user, name='restrict_user'),
    path('edit_user/', edit_user, name='edit_user'),
    path('create_user/', create_user, name='create_user'),
]
