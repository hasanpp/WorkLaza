from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(user):
    subject = "Your OTP Verification Code"
    message = f"Your OTP code is {user.otp}. It is valid for 5 minutes."
    recipient_list = [user.email]
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
