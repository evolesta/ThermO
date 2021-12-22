#include <SPI.h>
#include <Ethernet.h>
#include <aREST.h>
#include <avr/wdt.h>

// setup Ethernet shield
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xFF}; // mac addr shield
IPAddress ip(192, 168, 178, 10);
EthernetServer server(80);

// Create aREST instance
aREST rest = aREST();

void setup() {
  Serial.begin(9600);

  Ethernet.begin(mac, ip); // start Ethernet connectie
  server.begin();
  Serial.print("HTTP server started at ");
  Serial.println(Ethernet.localIP());

  // Start watchdog
  wdt_enable(WDTO_4S);

  rest.function("startHeating", startHeating);
  rest.function("stopHeating", stopHeating);
}

void loop() {
  // put your main code here, to run repeatedly:
  EthernetClient client = server.available();
  rest.handle(client);
  wdt_reset();
}

void startHeating(float temperature) {
  Serial.println(temperature);
}

void stopHeating(float temperature) {
  Serial.println(temperature);
}
