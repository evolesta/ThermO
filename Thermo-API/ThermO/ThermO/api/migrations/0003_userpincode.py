# Generated by Django 4.0 on 2022-01-15 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_setting_openweathermapapikey_setting_weatherdata'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPincode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(default='', max_length=10)),
                ('pincode', models.IntegerField(default=0)),
            ],
        ),
    ]