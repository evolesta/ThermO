from django.core.management.base import BaseCommand, CommandError
from ThermO.api.models import *
from datetime import datetime

class Command(BaseCommand):
    help = 'Checks the week schedule and change the heatpoint if neccesarry'

    def handle(self, *args, **options):
        settings = Setting.objects.get(pk=1)
        currentDateTime = datetime.now()

        if settings.scheduleEnabled:

            if settings.scheduleGrouped:
                # grouped week schedule           
                # if weekday mon-fri
                if currentDateTime.isoweekday() <= 5:
                    schedules = GroupedWeekSchedule.objects.filter(group='weekday')
                    self.scheduler(schedules)

                # if weekday is sat-sun
                if currentDateTime.isoweekday() > 5 and currentDateTime.isoweekday() <= 7:
                    schedules = GroupedWeekSchedule.objects.filter(group='weekend')
                    self.scheduler(schedules)
            else:
                # single day schedules
                schedules = SingleDaySchedule.objects.filter(weekday=currentDateTime.isoweekday())
                self.scheduler(schedules)

    def scheduler(self, schedules):
        currentDateTime = datetime.now()

        for schedule in schedules:
                     # check if the current schedule time is in line with the current time
                    if schedule.start == currentDateTime.time():
                        print('Schedule of ' + str(schedule.start) + ' is active')
                        
                        # check if heatpoint needs to be changed
                        heatpoint = Heatpoint.objects.get(pk=1)
                        if not heatpoint.heatpoint == schedule.temperature:
                            # set temp from schedule
                            heatpoint.heatpoint = schedule.temperature
                            heatpoint.activeSensor = schedule.sensor
                            heatpoint.save()
                            print('Heatpoint has been set to ' + str(schedule.temperature))
                        break