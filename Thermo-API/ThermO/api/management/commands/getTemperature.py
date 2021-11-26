from django.core.management.base import BaseCommand, CommandError
from api.models import Sensors, TemperatureData, Rooms, HoneywellSensors, Heatpoint, Boilers
from api.Honeywell import Honeywell
from api.schedule import Schedule
import requests

thermostatUrl = "https://api.honeywell.com/v2/devices/thermostats/"
temperatures = {} # init empty dictionary of all achieved temperatures

sensorsObj = Sensors.objects.all().filter(active=1) # get list of active Arduino sensors to achieve data from
honeywellSensorsObj = HoneywellSensors.objects.all().filter(active = 1)
heatpointObj = Heatpoint.objects.get(pk=1)
boilerObj = Boilers.objects.get(pk=1)

class Command(BaseCommand):
    def handle(self, *args, **options):

        # iterate trough list of Arduino sensors
        for sensor in sensorsObj:

            try:
                response = requests.get(sensor.sensorAddress) # make GET request
            except requests.exceptions.RequestException as e:
                    raise CommandError(e) # print error in case of a exception or error

            jsonData = response.json() # receive JSON data

            # set achieved temp. result to dictionary
            temperatures[jsonData['room:']] = float(jsonData['temperature'])

            print('Founded Arduino temperature: ' + jsonData['temperature'])

            # run only on new hour
            if Schedule.ifWholeHour():
                RoomsObj = Rooms.objects.get(sensorId=sensor.id) # get rooms record from db

                # add new temperature measure record to db
                TempDataObj = TemperatureData(room=RoomsObj.id,
                                                    temperature=jsonData['temperature'])
                TempDataObj.save()
                self.stdout.write(self.style.SUCCESS("Temperature added to database")) # print to terminal

                self.stdout.write(self.style.SUCCESS("Temperature for sensor " + jsonData['room:'] + ": " + jsonData['temperature'])) # print info to terminal

        # iterate trough list of Honeywell sensors
        for sensor in honeywellSensorsObj:
            # check if token is still valid to use
            if not Honeywell.isTokenValid():
                # refresh token
                Honeywell.refreshAccessToken()

            # get curent temperature from thermostat
            try:
                PARAMS = {"apikey": Honeywell.getApikey(), "locationId": sensor.locationId}
                HEADERS = {"Authorization": "Bearer " + Honeywell.getAccessToken()}
                response = requests.get(thermostatUrl + "/" + sensor.deviceId, params=PARAMS, headers=HEADERS)
            except requests.exceptions.RequestException as e:
                raise CommandError(e) 
            
            jsonData = response.json() # get JSON data

            # set achieved temp. result to dictionary
            temperatures[jsonData['name']] = float(jsonData['indoorTemperature'])

            print("Founded temperature Honeywell: " + str(jsonData['indoorTemperature']))

            # run only on new hour
            if Schedule.ifWholeHour():
                RoomsObj = Rooms.objects.get(sensorId=sensor.id) # get rooms record from db

                # add new temperature measure record to db
                TempDataObj = TemperatureData(room=RoomsObj.id,
                                                    temperature=jsonData['temperature'])
                TempDataObj.save()
                self.stdout.write(self.style.SUCCESS("Temperature added to database")) # print to terminal

        # get highest temperature from the dictionary
        highestTemp = max(temperatures.values())

        # save temp. in db
        heatpointObj.temperature = highestTemp
        heatpointObj.save()

        #control boiler to heat or not
        if heatpointObj.heatpoint > highestTemp and heatpointObj.heating == False:
            # start heating
            try:
                PARAMS = {"setpoint": 60}
                #requests.post(boilerObj.boilerAddress + '/startHeating', params=PARAMS)

            except requests.RequestException as e:
                raise CommandError(e)

            heatpointObj.heating = True
            heatpointObj.save()

            print('Heatpoint is higher then temperature, start heating. Request sent to boiler')

        if heatpointObj.heatpoint <= highestTemp and heatpointObj.heating == True:
            # stop heating
            try:
                PARAMS = {"setpoint": 0}
                #requests.post(boilerObj.boilerAddress + '/stopHeating', params=PARAMS)
                
            except requests.RequestException as e:
                raise CommandError(e)

            heatpointObj.heating = False
            heatpointObj.save()

            print('Heatpoint is lower then temperature, stop heating. Request sent to boiler')