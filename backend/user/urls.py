from django.urls import path
from .views import SignupView, SignInView, send_otp, verify_otp,get_emaiil_from_id,change_password,get_tokens,GoogleLogin

urlpatterns = [
    path('sendotp/', send_otp, name='send_otp'),
    path('verifyotp/', verify_otp, name='verify_otp'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('get_emaiil_from_id/', get_emaiil_from_id, name='get_emaiil_from_id'),
    path('change_password/', change_password, name='change_password'),
    path('get_tokens/', get_tokens, name='get_tokens'),
    path('google-login/', GoogleLogin.as_view(), name='google_login'),
]
