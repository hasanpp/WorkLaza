# Generated by Django 5.1.5 on 2025-02-27 11:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wallet',
            name='pyment_id',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='wallet',
            name='type',
            field=models.CharField(choices=[('credit', 'Amount Credit'), ('debit', 'Amount Debit')], default='credit', max_length=10),
        ),
    ]
