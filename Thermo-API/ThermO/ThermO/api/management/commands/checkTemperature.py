from django.core.management.base import BaseCommand, CommandError
from ThermO.api.models import *
import requests
from datetime import datetime 

class Command(BaseCommand):
    def handle(self, *args, **options):
        
        # get active boiler and controller URL
        heatpointObj = Heatpoint.objects.get(pk=1)
        settings = Setting.objects.get(pk=1)
        boilerController = Boiler.objects.get(pk=settings.activeBoiler)
        controllerURL = 'http://' + boilerController.boilerAddress

        temperature = float(heatpointObj.temperature) # convert to float
        heatpoint = heatpointObj.heatpoint
        threshold = settings.heatpointThreshold
        heating = heatpointObj.heating

        print("It's " + str(temperature) + "°C inside and the heatpoint has been set to " + str(heatpoint) + "°C")
        print("Check for action...")

        # checking if we need to stop heating
        if temperature > heatpoint and heating:
            # we've reached the optimal temperature, stop heating
            print('Desired temperature has been reached, stop heating...')

            try:
                requests.get(controllerURL + '/stopHeating')

                print("Command sent to boiler controller")
                thermostatData = ThermostatData(
                    temperature = temperature,
                    heatpoint = heatpoint,
                    action = 'Succesfully sent stop command to boiler controller'
                )
                thermostatData.save()

            except requests.exceptions.RequestException as e:
                print("Failed to send command to boiler controller, please check connection:")
                thermostatData = ThermostatData(
                    temperature = temperature,
                    heatpoint = heatpoint,
                    action = 'Failed to send stop command to boiler controller.'
                )
                thermostatData.save()
                raise CommandError(e)

            heatpointObj.heating = False
            heatpointObj.save()
            exit()
        
        # checking if we need to fire up the boiler for a short period bc the difference is low
        if heatpoint - temperature >= threshold and not heating:
            # lets heat the boiler for 5 minutes
            print('The current temperature is below the heatpoint threshold, start heating...')

            try:
                requests.get(controllerURL + '/startHeating?temperature=60')
                print("Command sent to boiler")
                thermostatData = ThermostatData(
                    temperature = temperature,
                    heatpoint = heatpoint,
                    action = 'Succesfully sent start command to boiler controller'
                )
                thermostatData.save()

            except requests.exceptions.RequestException as e:
                print("Failed to send command to boiler controller, please check connection:")
                thermostatData = ThermostatData(
                    temperature = temperature,
                    heatpoint = heatpoint,
                    action = 'Failed to send start command to boiler controller.'
                )
                thermostatData.save()
                raise CommandError(e)

            heatpointObj.heating = True
            heatpointObj.save()
            exit()

        if heating:
            print("No action needed: Boiler is already heating the environment")
        else:
            print("No action needed: The inside temperature is above the threshold")