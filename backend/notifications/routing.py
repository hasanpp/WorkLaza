from django.urls import path, re_path
from .consumers import NotificationConsumer,ChatConsumer 
websocket_urlpatterns = [
    path("ws/notifications/<int:user_id>/", NotificationConsumer.as_asgi()),
    re_path(r"ws/chat/(?P<chat_id>\d+)/$", ChatConsumer.as_asgi()),
]
