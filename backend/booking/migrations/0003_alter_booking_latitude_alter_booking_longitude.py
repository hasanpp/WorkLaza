# Generated by Django 5.1.5 on 2025-02-18 04:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_remove_booking_booked_at_booking_address_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='latitude',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='booking',
            name='longitude',
            field=models.FloatField(),
        ),
    ]
