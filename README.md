Project IoT - "ThermO" 
Smart home Thermostat system

Description:
A smart home thermostat system with multiple digital temperature sensors, which can be readed out remotely. 
Contains multiple Arduino systems with BMP280 sensor and a existing Honeywell thermostat for temp. measurement. 
A Raspberry pi as server which holds a REST API to interact with multiple systems.
And a Arduino with a OpenTherm adapter to interact with the boiler. 

Installation
This IoT system requires a local network to work. 
Make sure you have some free local IP addresses available for the server, sensors and boiler controller.
Your server is running a API and a front-end application with gui. 

== BACK-END ==
The REST API which is the main hart of the thermostat system is running on Django REST framework (Python) with MySQL.
Best practice is to run the server on a Raspberry PI or simular, but a regular Linux, Mac of Windows PC/laptop will work too.
You'll need:

- Apache webserver (with WSGI module)
- MySQL server (MariaDB)
- Git client or FTP server
- Terminal access (ex. SSH)

== FRONT-END == 
- Apache webserver
