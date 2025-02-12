from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime

def send_rejection_email(email, name, reason):
    subject = "Your Request Has Been Rejected"
    
    message = f"""
    Hello {name},

    We regret to inform you that your request for worker registration has been rejected for the following reason:

    ✖ {reason}

    If you have any questions or need further clarification, please feel free to reach out to us.

    Best regards,  
    The Admin Team  

    ——————————————  
    © {datetime.now().year} Work Laza. All rights reserved.
    """
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
