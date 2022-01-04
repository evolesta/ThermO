# Generated by Django 3.2.9 on 2022-01-04 10:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20220103_1442'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='groupedweekschedule',
            options={'ordering': ['start']},
        ),
        migrations.AlterModelOptions(
            name='singledayschedule',
            options={'ordering': ['start']},
        ),
        migrations.AlterField(
            model_name='groupedweekschedule',
            name='sensor',
            field=models.ForeignKey(db_constraint=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sensor_data_group', to='api.sensor'),
        ),
        migrations.AlterField(
            model_name='singledayschedule',
            name='sensor',
            field=models.ForeignKey(db_constraint=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sensor_data_single', to='api.sensor'),
        ),
    ]