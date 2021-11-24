from api.models import Honeywell
from datetime import date, datetime
import requests

# API urls of Honeywell
refreshTokenUrl = "https://api.honeywell.com/oauth2/token"

# achieve API tokens and keys from DB
honeywellObj = Honeywell.objects.get(pk=1)

class Honeywell():
    # generate a new temporary access token with a refresh token from the db
    def refreshAccessToken():

        try:
            # make POST call to Honeywell API
            HEADERS = {"Authorization": "Basic " + honeywellObj.base64String}
            DATA = {"grant_type": "refresh_token", "refresh_token": honeywellObj.refreshToken}
            response = requests.post(refreshTokenUrl, headers=HEADERS, data=DATA)
        except requests.exceptions.RequestException as e:
            print(e) # print error in case of exception

        jsonData = response.json() # achieve JSON data from API response

        # save new tokens to database
        honeywellObj.accessToken = jsonData['access_token']
        honeywellObj.refreshToken = jsonData['refresh_token']
        honeywellObj.save()

        print("Access token has been succesfully refreshed and is valid for " + jsonData['expires_in'] + " seconds")

    def isTokenValid():

        issuedDate = honeywellObj.refreshed_at # get from database
        issuedDate = datetime.strptime(str(issuedDate), '%Y-%m-%d %H:%M:%S.%f') #convert to datetime object
        currentDatetime = datetime.now() # get current datetime
        difference = currentDatetime - issuedDate # calc the difference

        if difference.total_seconds() > 1799:
            # refresh a new token
            return False
        else:
            return True

    def getAccessToken():
        # return the token from database
        return honeywellObj.accessToken
    
    def getApikey():
        return honeywellObj.apikey