# Generated by Django 5.1.5 on 2025-02-07 11:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0007_remove_worker_is_active_remove_worker_job'),
    ]

    operations = [
        migrations.AddField(
            model_name='worker',
            name='job',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='worker', to='worker.jobs'),
        ),
    ]
