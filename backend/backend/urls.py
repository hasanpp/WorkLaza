
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from user.views import GoogleLogin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('accounts/', include('allauth.urls')),
    path('worker/', include('worker.urls')),
    path('admin_view/', include('admin_panel.urls')),
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)