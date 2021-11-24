from datetime import datetime

class Schedule():

    #function to check if the current execution time is on the whole hour (ex. 12.00)
    # RETURNS boolean 
    def ifWholeHour():
        currDateTime = datetime.now() # get curr. date time
        currDateTime = currDateTime.strftime("%M") # get curr. minutes

        if currDateTime == "00":
            return True
        else:
            return False