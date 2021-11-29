from rest_framework import serializers
from rest_framework.utils import field_mapping
from .models import *

class SensorsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sensor
        fields = ('name', 'sensorAddress', 'active')

class BoilersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Boiler
        fields = ('name', 'boilerAddress')

class HoneywellSensorsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = HoneywellSensor
        fields = ('name', 'locationId', 'deviceId', 'active')

class HeatpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heatpoint
        fields = ('heatpoint', 'temperature')

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('weekday', 'time', 'temperature')

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ('activeBoiler', 'defaultBoilerTemp')