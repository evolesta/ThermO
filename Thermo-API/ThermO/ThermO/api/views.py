from datetime import date
from typing import Set
from django.db.models import query
from django.shortcuts import get_object_or_404, render
from django.core import management

from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .serializers import *
from .models import *

# Create your views here.
class SensorsViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all().order_by('name')
    serializer_class = SensorsSerializer
    permission_classes = [IsAuthenticated]

class BoilersViewSet(viewsets.ModelViewSet):
    queryset = Boiler.objects.all().order_by('name')
    serializer_class = BoilersSerializer
    permission_classes = [IsAuthenticated]


class UserPincodeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPincodeSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username')
        return UserPincode.objects.filter(username=username)


class HeatpointViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, pk=1):
        queryset = Heatpoint.objects.all()
        data = get_object_or_404(queryset, pk=1)
        serializer = HeatpointSerializer(data)
        return Response(serializer.data)

    def update(self, request, pk=1):
        data = Heatpoint.objects.get(pk=1)
        serializer = HeatpointSerializer(data=request.data)

        if serializer.is_valid():
            data.heatpoint = serializer.validated_data['heatpoint']
            data.temperature = serializer.validated_data['temperature']
            data.save()
            management.call_command('checkTemperature')
            return Response({'status': 'OK'})
        else:
            return Response(serializer.errors)

class SingleDaySchedule(viewsets.ModelViewSet):
    queryset = SingleDaySchedule.objects.order_by('start').all()
    serializer_class = SingleDayScheduleSerializer
    permission_classes = [IsAuthenticated]

class GroupedWeekSchedule(viewsets.ModelViewSet):
    queryset = GroupedWeekSchedule.objects.order_by('start').all()
    serializer_class = GroupedWeekScheduleSerializer
    permission_classes = [IsAuthenticated]

class SettingViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, pk=1):
        queryset = Setting.objects.all()
        data = get_object_or_404(queryset, pk=1)
        serializer = SettingSerializer(data)
        return Response(serializer.data)

    def update(self, request, pk=1):
        data = Setting.objects.get(pk=1)
        serializer = SettingSerializer(data=request.data)

        if serializer.is_valid():
            data.activeBoiler = serializer.validated_data['activeBoiler']
            data.defaultBoilerTemp = serializer.validated_data['defaultBoilerTemp']
            data.scheduleGrouped = serializer.validated_data['scheduleGrouped']
            data.scheduleEnabled = serializer.validated_data['scheduleEnabled']
            data.heatpointThreshold = serializer.validated_data['heatpointThreshold']
            data.save()
            return Response({'status': 'OK'})
        else:
            return Response(serializer.errors)

class ThermostatDataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ThermostatData.objects.all()
    serializer_class = ThermostatDataSerializer