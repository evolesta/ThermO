# Generated by Django 3.2.8 on 2021-10-21 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rooms_temperaturedata'),
    ]

    operations = [
        migrations.CreateModel(
            name='Honeywell',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accessToken', models.CharField(max_length=60)),
                ('refreshToken', models.CharField(max_length=60)),
                ('apikey', models.CharField(max_length=60)),
                ('base64String', models.CharField(max_length=100)),
            ],
        ),
    ]
