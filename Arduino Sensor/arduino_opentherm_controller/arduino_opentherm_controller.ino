#include <SPI.h>
#include <Ethernet.h>
#include <aREST.h>
#include <avr/wdt.h>
#include <OpenTherm.h>

// setup Ethernet shield
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xFF}; // mac addr shield
IPAddress ip(192, 168, 178, 10);
EthernetServer server(80);

// Create aREST instance
aREST rest = aREST();

// OpenTherm adapter init
const int inPin = 2;
const int outPin = 3;
OpenTherm ot(inPin, outPin);
void ICACHE_RAM_ATTR handleInterrupt() {
    ot.handleInterrupt();
}

float boilerTemperature; // global boiler heat temp var

void setup() {
  Serial.begin(9600);

  // init Ethernet Shield webserver
  Ethernet.begin(mac, ip); // start Ethernet connectie
  server.begin();
  Serial.print("HTTP server started at ");
  Serial.println(Ethernet.localIP());

  // Start watchdog
  wdt_enable(WDTO_4S);

  // init aREST API
  rest.variable("getBoilerTemp", &boilerTemperature); // get current boiler temp -> http://controller/getBoilerTemp
  rest.function("startHeating", startHeating); // set boiler to start heating -> http://controller/startHeating?temp=60
  rest.function("stopHeating", stopHeating); // set boiler to stop heating -> http://controller/stopHeating

  // init OpenTherm adapter
  ot.begin(handleInterrupt);
}

void loop() {
  // RUN aREST API service
  EthernetClient client = server.available();
  rest.handle(client);
  wdt_reset();

  // make sure OpenTherm communication is according to OpenTherm protocol
  boilerTemperature = ot.getBoilerTemperature();
}

void startHeating(String command) {
  // to do - make call to boiler to start heating
}

void stopHeating() {
  // to do - make call to boiler to stop heating
}
