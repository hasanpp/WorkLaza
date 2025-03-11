from django.urls import path
from .views import *

urlpatterns = [
    path('view_dash_board/', DashView.as_view(), name='view_dash_board'),
    path('job_view/', JobView.as_view(), name='job_view'),
    path('users_view/', UsersView.as_view(), name='users_view'),
    path('view_wallet/', WalletView.as_view(), name='view_wallet'),
    path('view_bookings/', BookingsView.as_view(), name='view_bookings'),
    path('requests_view/', RequestsView.as_view(), name='requests_view'),
    path('workers_view/', WorkersView.as_view(), name='requests_view'),
]
