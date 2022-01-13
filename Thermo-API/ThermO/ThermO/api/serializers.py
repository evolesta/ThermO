from dataclasses import fields
from rest_framework import serializers
from rest_framework.utils import field_mapping
from .models import *

class SensorsSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Sensor
        fields = '__all__'

class BoilersSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Boiler
        fields = '__all__'

class HeatpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heatpoint
        fields = '__all__'

class SingleDayScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleDaySchedule
        fields = ('weekday', 'start', 'temperature', 'id', 'sensor')

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['sensor'] = SensorsSerializer(instance.sensor).data
        return response 

class GroupedWeekScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupedWeekSchedule
        fields = ('group', 'start', 'temperature', 'id', 'sensor')

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['sensor'] = SensorsSerializer(instance.sensor).data
        return response 

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = '__all__'

class UserPincodeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserPincode
        fields = '__all__'

class ThermostatDataSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = ThermostatData
        fields = '__all__'