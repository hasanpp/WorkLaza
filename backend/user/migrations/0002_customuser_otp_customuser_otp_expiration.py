# Generated by Django 5.1.5 on 2025-01-23 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='otp_expiration',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
