# Generated by Django 5.1.5 on 2025-02-07 11:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0006_jobs'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='worker',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='worker',
            name='job',
        ),
    ]
