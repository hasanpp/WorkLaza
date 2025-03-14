from celery import shared_task
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from .models import CustomUser
from datetime import datetime


@shared_task
def send_otp_email(user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        subject = "Your OTP Verification Code"
        message = f"""
        Hi {user.first_name} {user.last_name},

        Your One-Time Password (OTP) for WorkLaza verification is:

        🔑 {user.otp}

        Please enter this code to complete your verification process. This OTP is valid for 5 minutes.

        If you did not request this OTP, please ignore this email.

        Best regards,  
        The WorkLaza Security Team  

        ——————————————  
        © {datetime.now().year} WorkLaza. All rights reserved.
        """
        print("Email from", settings.DEFAULT_FROM_EMAIL)
        
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        print("AFTER")
        
        try:
            email.send()
            print("AFTER SEND")
        except Exception as e:
            print("EMAIL EXCEPTION : ", str(e))
            return None
            
        # send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
        return "OTP sent successfully!"
    except CustomUser.DoesNotExist:
        return "User not found!"
