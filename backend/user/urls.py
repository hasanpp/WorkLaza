from django.urls import path
from .views import *

urlpatterns = [
    path('home_view/', HomeView.as_view(), name='home_view'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('google-login/', GoogleLogin.as_view(), name='google_login'),
    path('otp_view/', OtpView.as_view(), name='otp_view'),
    path('password_view/', PasswordView.as_view(), name='password_view'),
    path('featch_user_data/', FeatchUserView.as_view(), name='featch_user_data'),
    path('profile_view/', ProfileView.as_view(), name='profile_view'),
    path('workers_view/', WorkersView.as_view(), name='workers_view'),
    path('workers_view/<int:worker_id>', WorkersView.as_view(), name='workers_view'),
    path('saved_workers_view/', SavedWorkersView.as_view(), name='saved_workers_view'),
    path('saved_workers_view/<int:worker_id>', SavedWorkersView.as_view(), name='saved_workers_view'),
    path('bookings_view/', BookingsView.as_view(), name='bookings_view'),
    path('bookings_view/<int:booking_id>', BookingsView.as_view(), name='bookings_view'),
]
