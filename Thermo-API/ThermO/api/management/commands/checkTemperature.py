from django.core.management.base import BaseCommand, CommandError
from api.models import *
import requests
from datetime import datetime 

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            'sensorId',
            type=int,
            help='Geef het ID op van de sensor'
        )

    def handle(self, *args, **options):
        sensor = Sensor.objects.get(pk=options['sensorId'])

        # get current sensor temperature
        try:
            response = requests.get('http://' + sensor.sensorAddress)
        except requests.exceptions.RequestException as e:
            raise CommandError(e)

        jsonData = response.json()
        print('Current sensor temperature: ' + jsonData['temperature'])

        # check if we are on the whole hour to submit the data to model
        currentTime = datetime.now()
        if currentTime.strftime('%M') == 00:
            # submit to database model
            TempDataObj = TemperatureData(sensor=sensor.id, temperature=jsonData['temperature'])
            TempDataObj.save()
            print('Temperature has been added to the database')
            
        # write current temp to model
        heatpointObj = Heatpoint.objects.get(pk=1)
        heatpointObj.temperature = jsonData['temperature']
        heatpointObj.save()

        # get active boiler
        settings = Setting.objects.get(pk=1)
        boilerController = Boiler.objects.get(pk=settings.activeBoiler)
        controllerURL = 'http://' + boilerController.boilerAddress

        temperature = float(jsonData['temperature']) # convert to float

        # check if the desired temp is below the heatpoint and if we're not already heating
        if temperature < heatpointObj.heatpoint and not heatpointObj.heating:
            # send start heating command to boiler controller
            try:
                requests.get(controllerURL + '/startHeating?temperature=64')
            except requests.exceptions.RequestException as e:
                raise CommandError(e)

            heatpointObj.heating = True
            heatpointObj.save()

        # check if the desired temperature is equal or higher then the heatpoint and were heating
        if temperature >= heatpointObj.heatpoint and heatpointObj.heating:
            # send stop heating signal to boiler controller
            try:
                requests.get(controllerURL + '/stopHeating')
            except requests.exceptions.RequestException as e:
                raise CommandError(e)
                
            heatpointObj.heating = False
            heatpointObj.save()