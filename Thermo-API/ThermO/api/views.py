from datetime import date
from typing import Set
from django.db.models import query
from django.shortcuts import get_object_or_404, render

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

class HoneywellSensorsViewSet(viewsets.ModelViewSet):
    queryset = HoneywellSensor.objects.all()
    serializer_class = HoneywellSensorsSerializer
    permission_classes = [IsAuthenticated]

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
            return Response({'status': 'OK'})
        else:
            return Response(serializer.errors)

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
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
            data.save()
            return Response({'status': 'OK'})
        else:
            return Response(serializer.errors)