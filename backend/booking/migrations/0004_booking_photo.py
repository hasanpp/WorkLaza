# Generated by Django 5.1.5 on 2025-02-18 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0003_alter_booking_latitude_alter_booking_longitude'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='booking/'),
        ),
    ]
