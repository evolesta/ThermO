from datetime import datetime
from django.db import models
from django.db.models.deletion import CASCADE
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Sensor(models.Model):
    name = models.CharField(max_length=60)
    sensorAddress = models.CharField(max_length=60)
    active = models.BooleanField(default=False)

# for communication with the boiler
class Boiler(models.Model):
    name = models.CharField(max_length=60)
    boilerAddress = models.CharField(max_length=60)

# setting desired heatpoint and highest measured temperature
class Heatpoint(models.Model):
    heatpoint = models.FloatField()
    temperature = models.FloatField()
    activeSensor = models.IntegerField(default=0)
    heating = models.BooleanField(default=False)

class TemperatureData(models.Model):
    dateTime = models.DateTimeField(auto_now=True)
    sensor = models.IntegerField()
    temperature = models.FloatField()

class ThermostatData(models.Model):
    datetime = models.DateTimeField(auto_now=True)
    temperature = models.FloatField(default=0)
    heatpoint = models.FloatField(default=0)
    action = models.CharField(max_length=100)

class Setting(models.Model):
    activeBoiler = models.IntegerField()
    defaultBoilerTemp = models.FloatField()
    defaultSensor = models.IntegerField(default=0)
    scheduleGrouped = models.BooleanField(default=True)
    heatpointThreshold = models.FloatField(default=0)

class SingleDaySchedule(models.Model):
    weekday = models.IntegerField()
    start = models.TimeField(default='00:00', auto_now=False)
    temperature = models.FloatField()
    sensor = models.IntegerField(default=0)
    sensor = models.ForeignKey(Sensor, on_delete=CASCADE, null=True, db_constraint=False, related_name="sensor_data_single")

class GroupedWeekSchedule(models.Model):
    group = models.CharField(max_length=20)
    start = models.TimeField(default='00:00', auto_now=False)
    temperature = models.FloatField()
    sensor = models.IntegerField(default=0)
    sensor = models.ForeignKey(Sensor, on_delete=CASCADE, null=True, db_constraint=False, related_name="sensor_data_group")

class UserPincode(models.Model):
    username = models.CharField(default='', max_length=10)
    pincode = models.CharField(default='', max_length=4)