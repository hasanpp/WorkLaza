from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from .models import Worker,Jobs, WorkerAvailability as Slots
from .serializers import WorkerSerializer,JobSerializer, SlotSerializer
from booking.models import Booking, Review
from booking.serializers import BookingSerializer
from user.models import CustomUser as User
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated , AllowAny
from datetime import datetime
from admin_panel.models import Wallet
from admin_panel.serializers import WalletSerializer
from django.views.decorators.csrf import csrf_exempt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
from datetime import timedelta
import jwt
import stripe


stripe.api_key = settings.STRIPE_SECRET_KEY


JWT_SECRET_KEY = settings.JWT_SECRET_KEY
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def worker_register(request, *args, **kwargs):
    username = request.data.get('username')
    job_id = request.data.get('job')
    user = User.objects.get(username=username)
    job = Jobs.objects.get(id=job_id)
    if user.is_worker:
        return Response({'message':'Aldready reagisterd; request may under verification.'}, status=status.HTTP_200_OK)
    mutable_data = request.data
    mutable_data['user'] = user.id
    mutable_data['job'] = job.id
    serializer = WorkerSerializer(data=mutable_data)
    if serializer.is_valid():
        serializer.save(user=user)
        user.is_worker = True
        user.save()
        return Response({'message':'Worker registered successfully; request is under verification.'}, status=status.HTTP_201_CREATED)
    return Response({'messages':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def worker_view(request,*args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        if user.is_worker :
            gps = False
            try:
                worker = Worker.objects.get(user=user)
                if not worker.is_verified:
                    return Response({'messages':'The worker profile is not varified yet','is_verified':worker.is_verified},status=status.HTTP_401_UNAUTHORIZED)
                if not worker.is_active:
                    return Response({'messages':'Admin is blocked you profile','is_active':worker.is_active},status=status.HTTP_401_UNAUTHORIZED)
                if(not worker.latitude, not worker.longitude):
                    worker.latitude = request.data.get('latitude')
                    worker.longitude = request.data.get('longitude')
                    worker.save()
                return Response({'messages':'Loged In as a worker','full_name':worker.full_name,'gps':gps },status=status.HTTP_200_OK)
            except:
                return Response({'messages':'The user des not have a worker profile'},status=status.HTTP_401_UNAUTHORIZED)
        elif not user.is_worker :
            return Response({'messages':"You don't have access to this page"},status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'messages':str(e)},status=status.HTTP_401_UNAUTHORIZED)
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_jobs(*args, **kwargs):
    jobs = Jobs.objects.filter(is_active=True)
    serializer = JobSerializer(jobs, many=True) 
    return Response({'message': 'success','Jobs':serializer.data}, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_details(request,*args, **kwargs):
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        job_title = worker.job.title
        seriloised_data = WorkerSerializer(worker).data
        seriloised_data.update({'job':job_title})
        reviews_count = Review.objects.filter(worker=worker).count()
        today_date = datetime.today().date()
        new_bookings =  Booking.objects.filter(worker=worker, booking_date=today_date).count()
        today_tasks_count = Booking.objects.filter(worker=worker, booked_date=today_date).exclude(status='completed').count()
        
        time_period = request.query_params.get('period', 'week')
        now = timezone.now()
        
        start_of_week = now - timedelta(days=now.weekday())
        start_of_last_week = start_of_week - timedelta(days=7)
        end_of_last_week = start_of_week - timedelta(seconds=1)
        
        
        booking_data = []
        
        if time_period == 'day':
            for i in range(6, -1, -1):
                date = now.date() - timedelta(days=i)
                count = Booking.objects.filter(booking_date=date, worker=worker).count()
                booking_data.append({ 'label': date.strftime('%a'), 'date': date.strftime('%Y-%m-%d'), 'count': count })
                
        elif time_period == 'month':
            current_month = now.month
            current_year = now.year
            for i in range(5, -1, -1):
                month = (current_month - i) % 12
                if month == 0:
                    month = 12
                year = current_year - ((current_month - month) // 12)
                month_start = timezone.datetime(year, month, 1, tzinfo=timezone.get_current_timezone()).date()
                if month == 12:
                    month_end = timezone.datetime(year + 1, 1, 1, tzinfo=timezone.get_current_timezone()).date() - timedelta(days=1)
                else:
                    month_end = timezone.datetime(year, month + 1, 1, tzinfo=timezone.get_current_timezone()).date() - timedelta(days=1)
                count = Booking.objects.filter(booking_date__range=(month_start, month_end), worker=worker).count()
                booking_data.append({
                    'label': timezone.datetime(year, month, 1).strftime('%b'), 'date':timezone.datetime(year, month, 1).strftime('%Y-%m'), 'count':count })
                
        elif time_period == 'year':
            current_year = now.year
            for i in range(5, -1, -1):
                year = current_year - i
                year_start = timezone.datetime(year, 1, 1, tzinfo=timezone.get_current_timezone()).date()
                year_end = timezone.datetime(year, 12, 31, tzinfo=timezone.get_current_timezone()).date()
                
                count = Booking.objects.filter( booking_date__range=(year_start, year_end), worker=worker).count()
                booking_data.append({ 'label': str(year), 'date': str(year), 'count': count })
                
        else:
            for i in range(7):
                day = (start_of_week + timedelta(days=i)).date()
                count = Booking.objects.filter(booking_date=day, worker=worker).count()
                booking_data.append({ 'label': day.strftime('%a'), 'date': day.strftime('%Y-%m-%d'), 'count': count })
        
        
        return Response({'messages':"Data featch successfully",'worker':seriloised_data, 'reviews_count': reviews_count, 'new_bookings': new_bookings, 'today_tasks_count': today_tasks_count, "booking_data": booking_data, "period": time_period},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'messages':str(e)},status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POSt'])
@permission_classes([IsAuthenticated])
def edit_details(request,*args, **kwargs):
    try:
        worker_id =  request.data.get('id')
        full_name =  request.data.get('full_name')
        age =  request.data.get('age')
        salary =  request.data.get('salary')
        experience =  request.data.get('experience')
        longitude =  request.data.get('longitude')
        latitude =  request.data.get('latitude')
        previous_company =  request.data.get('previous_company')
        description =  request.data.get('description')
        qualification =  request.data.get('qualification')
        
        if full_name.strip() == "" or qualification.strip() == "" or salary.strip() == "" :
            return Response({'message':"Full name, salary and education can't be empty"},status=status.HTTP_401_UNAUTHORIZED)
        
        if ( not age.isnumeric() ) or ( not salary.isnumeric() ) or ( not experience.isnumeric() ) :
            return Response({'message':"Age, salary and experience should be in number"},status=status.HTTP_401_UNAUTHORIZED)
        
        worker = Worker.objects.get(id=worker_id)
        
        worker.full_name = full_name
        worker.age = age
        worker.salary = salary
        worker.experience = experience
        worker.longitude = longitude
        worker.latitude = latitude
        worker.previous_company = previous_company
        worker.description = description
        worker.qualification = qualification
        worker.save()
        return Response({'message':"Data Updated successfully" },status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':str(e)},status=status.HTTP_401_UNAUTHORIZED)
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_slot(request,*args, **kwargs) :
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        
        slots = Slots.objects.filter( worker=worker )
        slotSerializer = SlotSerializer(slots, many=True).data
        
        return Response({'message':"Slots get successfully",'slots':slotSerializer },status=status.HTTP_200_OK) 
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bookings(request,*args, **kwargs) :
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        
        bookings = Booking.objects.filter(worker=worker).exclude(status="canceled").order_by('-id')
        serializer = BookingSerializer(bookings, many=True)
        
        return Response({'message':"Bookings featch successfully",'Bookings':serializer.data },status=status.HTTP_200_OK) 
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_slot(request,*args, **kwargs) :
    token = request.headers['Authorization'][7:]
    decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
    user_id = decoded['user_id']
    
    try:
        user = User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        
        day_of_week = request.data.get('week')
        start_time = request.data.get('from')
        end_time =  request.data.get('to')
        
        slot = Slots.objects.create(worker=worker,day_of_week=day_of_week,start_time=start_time,end_time=end_time,is_active=True)
        
        return Response({'message':"Slot created successfully"},status=status.HTTP_200_OK) 
    
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ban_slot(request,*args, **kwargs) :
    slot_id = request.data.get('id')
    try:
        slot = Slots.objects.get(id=slot_id)
        slot.is_active = not slot.is_active
        slot.save()
        
        return Response({'message':"Slot status updated successfully"},status=status.HTTP_200_OK) 
    
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_slot(request,*args, **kwargs) : 
    slot_id = request.data.get('id')
    try:
        slot = Slots.objects.get(id=slot_id)
        slot.delete()
        
        return Response({'message':"Slot status updated successfully"},status=status.HTTP_200_OK) 
    
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_booking_status(request, booking_id) : 
    try:
        booking_status = request.data.get('status')
        booking =  Booking.objects.get(id=booking_id)
        booking.status = booking_status
        if booking.status == "accepted":
            booking.worker.total_fee += 50
            booking.worker.pending_fee += 50
            booking.worker.save()
        booking.save()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
             f"user_{booking.user.id}",
             {
                "type":"send_notification",
                "message":{
                    "title":"Booking Update",
                    "body": f"Your booking '{booking.title}' has been updated to '{booking_status}'.",
                    "status": booking_status,
                }
             }
        )
        return Response({'message':"Booking status updated successfully"},status=status.HTTP_200_OK) 
    
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_view(request,*args, **kwargs):
    try :
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
        user_id = decoded['user_id']
        user =  User.objects.get(id=user_id)
        worker = Worker.objects.get(user=user)
        wallets = Wallet.objects.filter(worker=worker)
        serialized_data = WorkerSerializer(worker).data
        p_seriolized_data =  WalletSerializer(wallets, many=True).data
        return Response({'message':"Data fetched successfully",'worker':serialized_data,"wallet_rows":p_seriolized_data},status=status.HTTP_200_OK) 
    except Exception as e: 
        return Response({'message':str(e)},status=status.HTTP_409_CONFLICT) 
    
    
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_stripe_checkout_session(request, *args, **kwargs):
    try:
        token = request.headers['Authorization'][7:]
        decoded = jwt.decode(token,JWT_SECRET_KEY,algorithms=['HS256'])
        user_id = decoded['user_id']
        user =  User.objects.get(id=user_id)
        
        worker = Worker.objects.get(user=user)
        
        if worker.pending_fee <= 0: return Response({"message": "No pending payments"}, status=status.HTTP_400_BAD_REQUEST)

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": { "name": "Platform Fee", }, "unit_amount": int(worker.pending_fee * 100), 
                    }, "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"http://localhost:5173/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url="http://localhost:5173/payment-failed",
            customer_email=request.user.email,
        )

        return Response({"checkout_url": checkout_session.url}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@csrf_exempt    
@api_view(["POST"])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET


    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({"error": "Invalid signature"}, status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        email = session["customer_email"]
        worker = Worker.objects.get(user__email=email)
        worker.payed_fee += worker.pending_fee
        worker.pending_fee = 0
        worker.save()

        Wallet.objects.create( user=worker.user, worker=worker, amount=session["amount_total"], pyment_id=session["id"], status="success", type="credit", )
    return JsonResponse({"status": "success"}, status=200)


# set PATH=%PATH%;C:\stripe-cli\
# stripe listen --forward-to http://127.0.0.1:8000/worker/stripe-webhook/


