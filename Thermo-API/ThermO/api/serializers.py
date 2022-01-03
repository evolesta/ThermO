from rest_framework import serializers
from rest_framework.utils import field_mapping
from .models import *

class SensorsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sensor
        fields = ('name', 'sensorAddress', 'active', 'id')

class BoilersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Boiler
        fields = ('name', 'boilerAddress', 'id')

class HoneywellSensorsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = HoneywellSensor
        fields = ('name', 'locationId', 'deviceId', 'active', 'id')

class HeatpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heatpoint
        fields = ('heatpoint', 'temperature', 'heating', 'activeSensor')

class SingleDayScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleDaySchedule
        fields = ('weekday', 'start', 'temperature', 'id', 'sensor')

class GroupedWeekScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupedWeekSchedule
        fields = ('group', 'start', 'temperature', 'id', 'sensor')    

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ('activeBoiler', 'defaultBoilerTemp', 'scheduleGrouped', 'defaultSensor')