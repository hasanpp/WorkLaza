# Generated by Django 5.1.5 on 2025-02-04 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_customuser_otp_customuser_otp_expiration'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='google_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='profile_picture_g',
            field=models.URLField(blank=True, null=True),
        ),
    ]
