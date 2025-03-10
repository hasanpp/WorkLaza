from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = os.getenv('SECRET_KEY')

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

DEBUG = False

ALLOWED_HOSTS = ["*"]


INSTALLED_APPS = [
    'daphne',  
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'worker',
    'user',
    'admin_panel',
    'booking',
    'notifications',
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'rest_framework_simplejwt',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'dj_rest_auth.registration',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'corsheaders',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

CORS_ALLOWED_ORIGINS = [ "http://localhost:5173" ]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

ASGI_APPLICATION = 'backend.asgi.application'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASES_NAME'),  
        'USER': os.getenv('DATABASES_USER'),  
        'PASSWORD': os.getenv('DATABASES_PASSWORD'),  
        # 'HOST': os.getenv('DATABASE_HOST', 'localhost'),
        # 'HOST': os.getenv('DATABASE_HOST'), 
        'HOST': 'db', 
        'PORT': os.getenv('DATABASES_PORT'),
    }
}


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer", 
        # "CONFIG": {
        #     "hosts": [("127.0.0.1", 6379)],
        # },
    },
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'OAUTH_PKCE_ENABLED': True, 
        "APP": {
            "client_id": os.getenv('GOOGLE_AUTH_CLIENT_ID'),
            "secret": os.getenv('GOOGLE_AUTH_CLIENT_SECRET'),
        }
    }
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTH_USER_MODEL = 'user.CustomUser'


MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


MEDIA_URL = '/media/'


SITE_ID = 1


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com' 
EMAIL_PORT = 587  
EMAIL_USE_TLS = True  
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')


SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')
SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI = f"http://localhost:8000/user/auth/google/callback/"
SOCIALACCOUNT_LOGIN_ON_GET = True


REST_USE_JWT = True 
SOCIALACCOUNT_QUERY_EMAIL = True
ACCOUNT_EMAIL_REQUIRED = True

SIMPLE_JWT = {
    "SIGNING_KEY": JWT_SECRET_KEY, 
    "ALGORITHM": "HS256",
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

SITE_ID = 2

CSRF_TRUSTED_ORIGINS = ["https://api.stripe.com","http://127.0.0.1:8000", "http://localhost","https://www.worklaza.site"]

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")


STRIPE_WEBHOOK_SECRET = "whsec_43cd9b54529033412ba82e1be9e8046c87ad71627899945623ae0aa88c870324" 



# production based settigns

# from pathlib import Path
# from datetime import timedelta
# from dotenv import load_dotenv
# import os


# load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent.parent


# SECRET_KEY = os.getenv('SECRET_KEY')

# JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# DEBUG = False

# ALLOWED_HOSTS = ["*"]


# INSTALLED_APPS = [
#     'daphne',
#     'channels',
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'storages',
#     'worker',
#     'user',
#     'admin_panel',
#     'booking',
#     'notifications',
#     'rest_framework',
#     'rest_framework.authtoken',
#     'dj_rest_auth',
#     'rest_framework_simplejwt',
#     'django.contrib.sites',
#     'allauth',
#     'allauth.account',
#     'dj_rest_auth.registration',
#     'allauth.socialaccount',
#     'allauth.socialaccount.providers.google',
#     'corsheaders',
# ]


# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',
#     'corsheaders.middleware.CorsMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
#     'allauth.account.middleware.AccountMiddleware',
# ]

# CORS_ALLOWED_ORIGINS = [ "http://localhost:5173" ]

# CORS_ALLOW_CREDENTIALS = True
# CORS_ALLOW_ALL_ORIGINS = True

# ROOT_URLCONF = 'backend.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'backend.wsgi.application'

# ASGI_APPLICATION = 'backend.asgi.application'


# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
#     "DEFAULT_PERMISSION_CLASSES": [
#         "rest_framework.permissions.IsAuthenticated",
#     ],
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('DATABASES_NAME'),
#         'USER': os.getenv('DATABASES_USER'),
#         'PASSWORD': os.getenv('DATABASES_PASSWORD'),
#         # 'HOST': os.getenv('DATABASE_HOST', 'localhost'),
#         # 'HOST': os.getenv('DATABASE_HOST'),
#         'HOST': 'db',
#         'PORT': os.getenv('DATABASES_PORT'),
#     }
# }


# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels.layers.InMemoryChannelLayer",
#         # "CONFIG": {
#         #     "hosts": [("127.0.0.1", 6379)],
#         # },
#     },
# }

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]

# AUTHENTICATION_BACKENDS = (
#     'django.contrib.auth.backends.ModelBackend',
#     'allauth.account.auth_backends.AuthenticationBackend',
# )

# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'SCOPE': ['profile', 'email'],
#         'AUTH_PARAMS': {'access_type': 'online'},
#         'OAUTH_PKCE_ENABLED': True,
#         "APP": {
#             "client_id": os.getenv('GOOGLE_AUTH_CLIENT_ID'),
#             "secret": os.getenv('GOOGLE_AUTH_CLIENT_SECRET'),
#         }
#     }
# }

# LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'

# USE_I18N = True

# USE_TZ = True


# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# AUTH_USER_MODEL = 'user.CustomUser'


# # ---- STATIC FILES (Whitenoise) ----
# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, "/staticfiles")


# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
# AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
# AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
# AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')
# AWS_S3_CUSTOM_DOMAIN = os.getenv('AWS_S3_CUSTOM_DOMAIN')

# # Django-storages settings for S3


# STORAGES = {
#     "default": {
#         "BACKEND": "storages.backends.s3.S3Storage",
#     },
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }


# #DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

# MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/media/"


# SITE_ID = 1


# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
# DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')


# SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
# SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')
# SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI = f"http://localhost:8000/user/auth/google/callback/"
# SOCIALACCOUNT_LOGIN_ON_GET = True


# REST_USE_JWT = True
# SOCIALACCOUNT_QUERY_EMAIL = True
# ACCOUNT_EMAIL_REQUIRED = True

# SIMPLE_JWT = {
#     "SIGNING_KEY": JWT_SECRET_KEY,
#     "ALGORITHM": "HS256",
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
# }

# SITE_ID = 2


# CSRF_TRUSTED_ORIGINS = ["https://api.stripe.com","http://127.0.0.1:8000", "http://localhost"]

# STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
# STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")


# STRIPE_WEBHOOK_SECRET = "whsec_43cd9b54529033412ba82e1be9e8046c87ad71627899945623ae0aa88c870324"

