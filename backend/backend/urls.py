
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('chat/', include('notifications.urls')),
    path('accounts/', include('allauth.urls')),
    path('worker/', include('worker.urls')),
    path('admin_view/', include('admin_panel.urls')),
    path('booking/', include('booking.urls')),
    path('token/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include("rest_framework.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)