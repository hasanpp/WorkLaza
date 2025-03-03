from django.urls import path
from . import views

urlpatterns = [
    path("get_or_create_chat/<int:worker_id>/", views.get_or_create_chat, name="get_or_create_chat"),
    path("get_chat_messages/<int:chat_id>/", views.get_chat_messages, name="get_chat_messages"),
    path("get_chats/", views.get_chats, name="get_chats"),
    path("send_message/", views.send_message, name="send_message"),
]