// init bmp280 sensor lib
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
Adafruit_BMP280 bmp; // object

// init tm1637 led display lib
#include <TM1637.h>
const int DIO = 2;
const int CLK = 3;
TM1637 tm1637(CLK, DIO); // object

// init ethernet shield
#include <Ethernet.h>
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xEE}; // mac addr shield
IPAddress ip(192, 168, 178, 8);
EthernetServer server(80);

String room = "Kantoor Erik";

void setup() {
  Serial.begin(9600);
  
  // init led display
  tm1637.init(); // init display
  tm1637.set(BRIGHT_TYPICAL); // brightness
  tm1637.display(3, '*'); // print degrees char on 4th digit static
  tm1637.point(1); // enable colon seperator for decimal

  // init bmp sensor
  bmp.begin();
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL);

  // init ethernet connection
  Ethernet.begin(mac, ip); // start ethernet conn.
  server.begin(); // start server
  Serial.print("HTTP server started at ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  float temp = bmp.readTemperature(); // get current temp. from sensor
  float pres = bmp.readPressure(); // get current pressure from sensor
  Serial.println(temp);

  // print temp to LED display
  tm1637.display(0, getTens(temp));
  tm1637.display(1, getDigit(temp));
  tm1637.display(2, getDecimalValue(temp));

  // serve temp. info to HTTP
  EthernetClient client = server.available(); // listen for inc. clients
  if (client) {
    Serial.println("new client");
    bool currentLineIsBlank = true; 
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);

        if (c == '\n' && currentLineIsBlank) {
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json");
          client.println("Connection: close");  // the connection will be closed after completion of the response
          client.println();

          // output temp. in JSON format
          String temperature = (String)temp;
          String pressure = (String)pres;
          String JSON = "{\"room\":\""+room+"\", \"temperature\":\""+temperature+"\", \"pressure\":\""+pressure+"\"}";
          client.println(JSON); // print JSON to client
          break;
        }

        if (c == '\n') {
          // you're starting a new line
          currentLineIsBlank = true;
        } else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      }
    }
  }
  
  delay(1000); // 1 sec delay before refresh
  client.stop();
  Serial.println("Client disconnected");
}


// return tens out of two digit int
int getTens(int number)
{
  return (number / 10) % 10;
}

// return last digit of int
int getDigit(int number)
{
  return number % 10;
}

// return 0 or 5 for decimal value
int getDecimalValue(float temp)
{
  // float temp = 23.33
  float decTemp = fmod(temp, 1); // only return remainder decimal values

  if (decTemp >= 0.0 && decTemp <= 0.4)
  {
    return 0;
  }

  if (decTemp >= 0.5 && decTemp <= 0.9)
  {
    return 5;
  }
}
