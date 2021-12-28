from django.core.management.base import BaseCommand, CommandError
from api.models import *
from datetime import datetime

class Command(BaseCommand):
    help = 'Checks the week schedule and change the heatpoint if neccesarry'

    def handle(self, *args, **options):
        settings = Setting.objects.get(pk=1)
        currentDateTime = datetime.now()

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
                     # check if the current schedule is in range with start & end
                    if schedule.start <= currentDateTime.time() <= schedule.end:
                        # check if heatpoint needs to be changed
                        heatpoint = Heatpoint.objects.get(pk=1)
                        if not heatpoint.heatpoint == schedule.temperature:
                            # set temp from schedule
                            heatpoint.heatpoint = schedule.temperature
                            heatpoint.save()
                            print('Heatpoint has been set to schedule range to ' + schedule.temperature)
                        break