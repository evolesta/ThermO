# Generated by Django 3.2.9 on 2021-11-12 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_schedule'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule',
            name='time',
        ),
        migrations.AddField(
            model_name='schedule',
            name='end',
            field=models.TimeField(default='00:00'),
        ),
        migrations.AddField(
            model_name='schedule',
            name='start',
            field=models.TimeField(default='00:00'),
        ),
    ]
