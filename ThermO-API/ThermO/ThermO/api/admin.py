from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Sensor)
admin.site.register(Boiler)
admin.site.register(Heatpoint)
admin.site.register(UserPincode)
admin.site.register(Setting)
admin.site.register(ThermostatData)
admin.site.register(TemperatureData)
admin.site.register(SingleDaySchedule)
admin.site.register(GroupedWeekSchedule)