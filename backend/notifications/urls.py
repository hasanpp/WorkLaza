from django.urls import path
from .views import ChatView

urlpatterns = [
    path("get_chats/", ChatView.as_view(), name="get_chats"),
    path("get_chats/<int:chat_id>/", ChatView.as_view(), name="get_chat_messages"),
]