# Generated by Django 5.1.5 on 2025-03-11 13:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('admin_panel', '0001_initial'),
        ('worker', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='wallet',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='wallet',
            name='worker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='worker.worker'),
        ),
    ]
