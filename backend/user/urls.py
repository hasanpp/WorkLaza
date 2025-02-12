from django.urls import path
from .views import *

urlpatterns = [
    path('sendotp/', send_otp, name='send_otp'),
    path('verifyotp/', verify_otp, name='verify_otp'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('view_profile/', view_profile, name='view_profile'),
    path('edit_details/', edit_details, name='edit_details'),
    path('view_workers/', view_workers, name='view_workers'),
    path('upload_profile_picture/', upload_profile_picture, name='upload_profile_picture'),
    path('get_emaiil_from_id/', get_emaiil_from_id, name='get_emaiil_from_id'),
    path('change_password/', change_password, name='change_password'),
    path('token_data/', token_data, name='token_data'),
    path('google-login/', GoogleLogin.as_view(), name='google_login'),
]
