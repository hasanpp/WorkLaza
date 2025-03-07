import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.layers import get_channel_layer


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from notifications.routing import websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": get_asgi_application(),   
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)), 
})

channel_layer = get_channel_layer()