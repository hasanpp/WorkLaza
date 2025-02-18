from django.shortcuts import render
from django.db import models
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
from .serializers import BookingSerializer

        