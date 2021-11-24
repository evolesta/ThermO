from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Sensors)
admin.site.register(Boilers)
admin.site.register(Heatpoint)
admin.site.register(Honeywell)
admin.site.register(HoneywellSensors)
admin.site.register(Rooms)
admin.site.register(Setting)
admin.site.register(TemperatureData)
admin.site.register(Schedule)