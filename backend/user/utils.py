from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime

def send_otp_email(user):
    print("lalalalallala    ")
    subject = "Your OTP Verification Code"
    message = f"""
    Hi {f'{user.first_name} {user.last_name}'},

    Your One-Time Password (OTP) for verification in WorkLaza is:

    🔑 {user.otp}

    Please enter this code to complete your verification process. This OTP is valid for 1 minute.

    If you did not request this OTP, please ignore this email.

    Best regards,  
    The Security Team  

    ——————————————  
    © {datetime.now().year} WorkLaza. All rights reserved.
    """
    recipient_list = [user.email]
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
