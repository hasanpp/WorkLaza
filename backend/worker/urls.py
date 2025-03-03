from django.urls import path
from .views import *

urlpatterns = [
    path('register/', worker_register, name='register'),
    path('worker_view/', worker_view, name='worker_view'),
    path('view_jobs/', view_jobs, name='view_jobs'),
    path('view_details/', view_details, name='view_details'),
    path('view_bookings/', view_bookings, name='view_bookings'),
    path('edit_details/', edit_details, name='edit_details'),
    path('change_booking_status/<int:booking_id>', change_booking_status, name='change_booking_status'),
    path('view_slot/', view_slot, name='view_slot'),
    path('delete_slot/', delete_slot, name='delete_slot'),
    path('ban_slot/', ban_slot, name='ban_slot'),
    path('add_slot/', add_slot, name='add_slot'),
    path('payment_view/', payment_view, name='payment_view'),
    path("create-checkout-session/", create_stripe_checkout_session, name="create-checkout-session"),
    path("stripe-webhook/", stripe_webhook, name="stripe-webhook"),
]
