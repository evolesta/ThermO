from django.core.management.base import BaseCommand, CommandError
from ThermO.api.models import *
import requests
from datetime import datetime

class Command(BaseCommand):
    help = 'Gets the latest temperature from the selected active sensor'

    def handle(self, *args, **options):
        heatpointObj = Heatpoint.objects.get(pk=1)
        sensor = Sensor.objects.get(pk=heatpointObj.activeSensor)

        # get current sensor temperature
        try:
            response = requests.get('http://' + sensor.sensorAddress)
        except requests.exceptions.RequestException as e:
            raise CommandError(e)

        jsonData = response.json()
        temperature = jsonData['temperature']

        print("The current inside temperature is " + str(temperature) + "°C")

        # check if we are on the whole hour to submit the data to model
        currentTime = datetime.now()
        print (currentTime.strftime('%M'))
        if currentTime.strftime('%M') == '00':
            # submit to database model
            TempDataObj = TemperatureData(sensor=sensor.id, temperature=jsonData['temperature'])
            TempDataObj.save()
            print('Temperature has been added to the database')
            
        # write current temp to model
        heatpointObj.temperature = jsonData['temperature']
        heatpointObj.save()