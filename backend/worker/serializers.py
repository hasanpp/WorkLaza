from rest_framework import serializers
from .models import Worker

class WorkerSerializer(serializers.ModelSerializer):
    age = serializers.CharField(max_length=2)
    salary = serializers.CharField(max_length=4)
    experience = serializers.CharField(max_length=2)
    certificate = serializers.ImageField(required=False)
    id_prof = serializers.ImageField(required=True)

    class Meta:
        model = Worker
        fields = '__all__'

    def validate_age(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Age must be a number.")
        age = int(value)
        if age < 18 or age > 100:
            raise serializers.ValidationError("Age must be between 18 and 100.")
        return value

    def validate_salary(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Salary must be a number.")
        salary = int(value)
        if salary <= 0:
            raise serializers.ValidationError("Salary must be a positive number.")
        return value

    def validate_experience(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Experience must be a number.")
        experience = int(value)
        if experience < 0:
            raise serializers.ValidationError("Experience cannot be negative.")
        return value

    def validate_certificate(self, value):
        if value:
            file_type = value.name.split('.')[-1].lower()
            if file_type not in ['jpg', 'jpeg', 'png']:
                raise serializers.ValidationError(f"File Can't be {file_type} file must be an image (jpg, jpeg, png).")
        return value

    def validate_id_prof(self, value):
        if value:
            file_type = value.name.split('.')[-1].lower()
            if file_type not in ['jpg', 'jpeg', 'png']:
                raise serializers.ValidationError("ID file must be an image (jpg, jpeg, png).")
        return value

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Full name cannot be empty.")
        return value

    def validate_job(self, value):
        if not value.strip():
            raise serializers.ValidationError("Job title cannot be empty.")
        return value

    def validate_previous_company(self, value):
        if value is not None and value.strip() == '':
            raise serializers.ValidationError("Previous company name cannot be empty if provided.")
        return value
