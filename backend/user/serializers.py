from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator, MinLengthValidator, RegexValidator
import re

User = get_user_model()

def validate_phone(value):
    if len(value) < 10:
        raise ValidationError('Phone number must be at least 10 digits long.')
    return value

class SignUpSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[MinLengthValidator(5)])
    email = serializers.EmailField(validators=[EmailValidator()])
    phone = serializers.CharField(
        validators=[validate_phone, RegexValidator(r'^\+?1?\d{9,15}$', message="Enter a valid phone number.")]
    )
    first_name = serializers.CharField(min_length=4, max_length=30)
    last_name = serializers.CharField(min_length=2, max_length=30)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_phone(self, value):
        if not re.match(r'^\+?[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Phone number must be in international format (e.g., +123456789).")
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
