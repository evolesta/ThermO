# Arduino Temperature sensor

To create a Arduino HTTP readable temperature sensor, like i did, you'll need to following hardware:

- Arduino Board (Uno)
- A USB cable to connect your PC to the board
- BMP280 sensor (Pimoroni, Adafruit, Bosch)
- Grove 4-digit display (optional) - for displaying the temp. on display
- Arduino Ethernet shield
- Jumperwires and a breadboard (or if you're going to solder, a board.. - that's up to you)

You also need to install Arduino IDE on your computer -> https://www.arduino.cc/en/software

## Wirering all together
1. Place the Ethernet shield on top of your Arduino (just push the pins in eachother)
2. Push the BMP280 sensor on your breadboard
3. Connect a (red) wire from the 5V pin to the + column on your breadboard
4. Connect a (black) wire from the GND pin on the BMP280 sensor to the - column on your breadboard
5. Connect a (red) wire from the 2-6V pin to the + column on your breadboard
6. Connect a (black) wire from the GND pin on the BMP280 sensor to the - column on your breadboard
7. Connect a (colored) wire from the SDA pin on the sensor to the SDA pin on your board
8. Connect a (colored) wire from the SCL pin on the sensor to the SCL pin on your board

*Optional: if you whish to see the current temperature on a 7-segment LED display*
I used the Grove 7-segement display. It only requires 4 wires, and has a easy to use library! But you can use any display you want.
Please note that you have to adjust the code if you use a another display.
You don't need to buy the Grove shield or connectors, you can also push male jumpwires into the default grove wire.

1. Connect a (red) wire from the red wire on the Grove connector to the + column on the breadboard
2. Connect a (black) wire from the black wire on the Grove connector to the - column on the breadboard
3. Connect a (colored) wire from the white wire on the Grove connector to the (digital) 2th pin on the board
4. Connect a (colored) wire from the yellow wire on the Grove connector to the (digital) 3th pin on the board
5. Push the other side of the Grove connector into the connector on the display board

**There are some pictures which visuals the wiring to the board in the repo**

## The project source code
1. Connect the USB wire into your computer and Arduino board.
2. Open the folder project with .ino file in the Arduino IDE software. 
3. Select the correct board at Tools > Port > *select your board*
4. Go to Tools > Manage Libraries
5. Install the Adafruit BMP280 library
6. Optional: install the Grove 4-Digit display library

8. Adjust the code to your settings (IP, MAC, room string etc.)
9. Push the code to your board by pressing the 'upload' button (arrow to right)
