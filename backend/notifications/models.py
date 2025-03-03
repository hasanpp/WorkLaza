from django.db import models

from django.contrib.auth import get_user_model
User = get_user_model()

class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_user1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_user2")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.user1} and {self.user2}"

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender} at {self.timestamp}"
