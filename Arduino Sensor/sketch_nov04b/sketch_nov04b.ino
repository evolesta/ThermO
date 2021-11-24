#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
Adafruit_BMP280 bmp; // object

void setup() {
  // put your setup code here, to run once:
  bmp.begin();
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL);

  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  float temp = bmp.readTemperature();
  float pres = bmp.readPressure();

  Serial.println(temp);
  Serial.println(pres);
  delay(1000);
}
