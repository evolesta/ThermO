from django.db import models

# Create your models here.
class Sensor(models.Model):
    name = models.CharField(max_length=60)
    sensorAddress = models.CharField(max_length=60)
    active = models.BooleanField(default=False)

class HoneywellSensor(models.Model):
    name = models.CharField(max_length=60)
    locationId = models.CharField(max_length=60)
    deviceId = models.CharField(max_length=60)
    active = models.BooleanField(default=False)

# for communication with the boiler
class Boiler(models.Model):
    name = models.CharField(max_length=60)
    boilerAddress = models.CharField(max_length=60)

# setting desired heatpoint and highest measured temperature
class Heatpoint(models.Model):
    heatpoint = models.FloatField()
    temperature = models.FloatField()
    heating = models.BooleanField(default=False)

class TemperatureData(models.Model):
    dateTime = models.DateTimeField(auto_now=True)
    sensor = models.IntegerField()
    temperature = models.FloatField()

class Honeywell(models.Model):
    accessToken = models.CharField(max_length=60)
    refreshToken = models.CharField(max_length=60)
    apikey = models.CharField(max_length=60)
    base64String = models.CharField(max_length=100)
    refreshed_at = models.DateTimeField(auto_now=True)

class Setting(models.Model):
    activeBoiler = models.IntegerField()
    defaultBoilerTemp = models.FloatField()
    defaultSensor = models.IntegerField(default=0)
    scheduleGrouped = models.BooleanField(default=True)

class SingleDaySchedule(models.Model):
    weekday = models.IntegerField()
    start = models.TimeField(default='00:00', auto_now=False)
    end = models.TimeField(default='00:00', auto_now=False)
    temperature = models.FloatField()
    sensor = models.IntegerField(default=0)

class GroupedWeekSchedule(models.Model):
    group = models.CharField(max_length=20)
    start = models.TimeField(default='00:00', auto_now=False)
    end = models.TimeField(default='00:00', auto_now=False)
    temperature = models.FloatField()
    sensor = models.IntegerField(default=0)