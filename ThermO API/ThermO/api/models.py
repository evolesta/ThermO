from django.db import models

# Create your models here.
class Sensors(models.Model):
    name = models.CharField(max_length=60)
    sensorAddress = models.CharField(max_length=60)
    active = models.BooleanField(default=False)

class HoneywellSensors(models.Model):
    name = models.CharField(max_length=60)
    locationId = models.CharField(max_length=60)
    deviceId = models.CharField(max_length=60)
    active = models.BooleanField(default=False)

# for communication with the boiler
class Boilers(models.Model):
    name = models.CharField(max_length=60)
    boilerAddress = models.CharField(max_length=60)

# setting desired heatpoint and highest measured temperature
class Heatpoint(models.Model):
    heatpoint = models.FloatField()
    temperature = models.FloatField()
    heating = models.BooleanField(default=False)

# rooms where sensors are stored
class Rooms(models.Model):
    name = models.CharField(max_length=60)
    sensorId = models.IntegerField()

class TemperatureData(models.Model):
    dateTime = models.DateTimeField(auto_now=True)
    room = models.IntegerField()
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

class Schedule(models.Model):
    weekday = models.IntegerField()
    start = models.TimeField(default='00:00')
    end = models.TimeField(default='00:00')
    temperature = models.FloatField()