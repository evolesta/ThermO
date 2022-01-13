Project IoT - "ThermO" 
Smart Home Thermostat system

# Description:
A smart home thermostat system with multiple digital temperature sensors, which can be readed out remotely. 
Contains multiple Arduino systems with BMP280 sensor and a existing Honeywell thermostat for temp. measurement. 
A Raspberry pi as server which holds a REST API to interact with multiple systems.
And a Arduino with a OpenTherm adapter to interact with the boiler. 

# Installation
This smart home system needs a local network to work. For installation you'll need to familiar with Linux, Apache and networking.

## SENSOR(S)
You'll need to build at least one sensor which is readable trough a HTTP GET request in JSON format. You can build it with any hardware you want, but i have made a tutorial on how to build a sensor on a Arduino.
You can do it with any embedded system you want, as long as it's readable on your local network over HTTP. 
Check out the tutorial within the 'Arduino Sensor' folder on this repository. 

## SERVER (REST API)
The server is serving a RESP API service built with Django and Django REST framework on Python.
You can run this several ways, check out the Django deployment documentation how.
We recommend to serve the API with Apache and the WSGI module on a Raspberry PI with Ubuntu Server. Follow the instructions below how to.
Of course you are free to serve the Django application as you wish.

From this point we assume that you've installed Ubuntu (server) (or Debian) already and configured a static IP.
If you whish to reach the server over the internet, by using the Android or IOS apps for example, you should also port forward on your router (if you use NAT) and point a domainname to your external ISP IP.

### GET GIT REPO LOCALLY
Before installing, clone this repository somewhere on your server using:
```
git clone https://github.com/evolesta/ThermO.git
```
You can also download the repo as ZIP and upload it with FTP or SSH, etc.

1. First install Apache and mod WSGI. After installation you should see the default welcome page if you browse to the server IP.
```
sudo apt-get install apache2 libapache2-mod-wsgi-py3
```

2. Install a MySQL server (for example MariaDB). Then run the configuration wizard when installing is done:
```
sudo apt-get install mariadb-server
mysql_secure_installation
```

*I prefer to use Webmin to manage Apache and MariaDB. It's a lightweight web application to manage your server with a nice GUI. You could also use the terminal for the next steps, but using Webmin speeds up the installation. Check out https://www.webmin.com/deb.html*

3. Create a new database and user and set authentication:
- Goto servers > MariaDB Server
- Click **create a new database**
- Enter **thermo** at **Database name** and hit the **Create** button

- Goto **User Permissions**
- Click **create user**
- Enter **thermo** at **Username** and enter a (secure) password at **Password** and hit the **create** button

- Goto **Database permissions**
- Click **create new database permissions**
- Select the **thermo** database you've just created at **databases**
- Enter **thermo** at **username**
- Select all permissions in the list at **Permissions**
- Hit the **Create** button

4. Copy the Django app to it's serving location:
```
sudo mkdir /var/www/api
sudo cp -r ./ThermO-API/* /var/www/api
sudo chown <user> -R /var/www/api
sudo chown :www-data -R /var/www/api
```

5. Adjust settings.py file to your database info
Perform a `nano /var/www/api/ThermO/ThermO/settings.py` command to edit the settings.
Adjust the following block to your database and user:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'PORT': 3306,
        'HOST': 'localhost'
    }
```

And:
```
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'api.example.com']

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8100',
    'http://api.example.com'
]

STATIC_ROOT = '/var/www/api/ThermO/static/'
STATIC_URL = '/static/'
```

6. Create a Python virtual envoirment, activate it and install required packages
```
sudo apt-get install python3 python3-venv python3-dev
cd /var/www/api
python3 -m venv venv
source ./venv/bin/activate
python3 -m pip install -r requirements.txt
```

7. Run the database migrations to create the tables and load required data. This is also a test if Django can access the new database. Also create a first user (admin)
```
cd /var/www/api/ThermO
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py loaddata setup_db
```
If you run in any trouble migrating the database, please fix them first.
To check if Django will run correctly, you can also run `python3 manage.py runserver 0.0.0.0:8000` to check for any issues. This will start the development server. ***Please do not run this for production purposes!***

8. Configure a Apache virtual host to run Django (in Webmin)
You propably also want to use this server to run the front-end application as well. So that's why we're using virtual hosts to run Apache.

- Goto servers > Apache Webserver
- Click the **Create virtual host** tab
- Enter your FQDN in **Specific address** (like api.example.com). If you don't use a domain you could also run the API on port 8000 (please adjust Apache config to listen on that port + firewall). 
- Hit the **Create now** button

- Click on the global icon left on your new virtual host
- Click **edit directives**
- Clear the file and enter follow into it. Adjust the domain/IP and paths to your installation.

```
ServerName api.example.com

DocumentRoot /var/www/api/ThermO/ThermO

WSGIDaemonProcess api.example.com python-path=/var/www/api/ThermO python-home=/var/www/api/venv
WSGIProcessGroup api.example.com
WSGIScriptAlias / /var/www/api/ThermO/ThermO/wsgi.py process-group=api.example.com application-group=%{GLOBAL}
WSGIPassAuthorization On

<Directory "/var/www/api/ThermO/ThermO">

    <Files wsgi.py>
        Require all granted
    </Files>
</Directory>
```

- Hit the **save and close** button
- Restart the Apache server trough Webmin or the `sudo service apache2 restart` command

9. Check if you can reach the API. You should hit a webpage containing 'Django REST framework' and some routes.
If you hit a HTTP 500 error, check out the Apache error logs trough Webmin (System > System Logs) or `sudo tail -f /var/log/apache2/error.log` what's wrong.

To test out the API, you could use Postman to explore the routes. You need to be authenticated with a access token to retrieve a succesful response. Check out the API docs. 

10. Setup cronjobs
To frequently check the current temperature from the sensor, and check if the scheduler needs to set a new heatpoint, we'll need to set the crontab with new jobs to run each minute.
These back-end scripts run using Django custom commands from manage.py.
To ease things up, i wrote a small generic bash script to use with crontab.
Just use `crontab.sh /path/to/django command` which is available in the API root directory.

***Make sure the script has execute permissions:***
```
sudo chmod +x /var/www/api/crontab.sh
```

- Go to System > Schedule Cron Jobs
- Click **create a new scheduled cron job**
- Enter **root** at **execute cron job as**
- At **command**, enter **/var/www/api/crontab.sh /var/www/api scheduler**
- Enter a matching description for your needs
- Hit **Times and dates selected below .. ** and make sure **all** is selected at minutes, hours, days, months and weekdays
- Hit the **create** button
- Repeat this steps and enter **/var/www/api/crontab.sh /var/www/api checkTemperature** as command to execute

To test the commands, you can open a cron job and hit the **run now** button. The checkTemperature script will output data.

## Front-end webapp
You could use the Front-end GUI webapp to easy manage your server back-end, without making the calls yourself. 
The front-end app is written in Ionic with Angular. Ionic supports multi-platform deployment, so your also able to compile a Android or IOs app.
You'll have to compile them yourself, because you have to modify the settings.ts file first matching your API URL. After compilation you'll have the production files in the *www* folder. 

1. Modify settings.ts to match your API/
```
nano /your/repo/ThermO-Frontend/src/app/settings.ts
```

Modify the *APIURL* constant to match your API URL:
```
// global front-end settings
export const APIURL = 'http://api.example.com';
```

2. Install Node.js and Ionic CLI
```
sudo apt-get install npm
cd /your/repo/ThermO-Frontend
npm install -g @ionic/cli
npm install -g @angular/cli
```

3. Compile a production release
```
ionic build --prod
```

4. Copy production files to /var/www
```
sudo mkdir /var/www/frontend
sudo chown <user> -r /var/www/frontend
sudo chown :www-data -r /var/www/frontend
cp -r /your/repo/ThermO-Frontend/www/* /var/www/frontend
```

5. Create Apache Virtual Host
- Go to Servers > Apache Webserver
- Click tab **Create Virtual Host**
- Enter a FQDN at **Specific address** or leave at **any address** if you don't use a domain (back-end runs on a different port)
- Set **Document Root** to **/var/www/frontend**
- Hit the **create now** button

- Click the **global configuration** tab
- Hit the **edit configuration** button
- In the select **editing config file** select the virtual host file
- Adjust the vhost file like this:
```
<VirtualHost *:80>
    ServerName thermo.example.com

    DocumentRoot "/var/www/front-end/"

    <Directory "/var/www/front-end/">
        allow from all
        Options None
        Require all granted
    </Directory>
</VirtualHost>
```
- Hit the **save and close** button
- Restart the Apache server by Webmin or the `sudo service apache2 restart` command

6. Check if you can reach the webapp trough the webbrowser. If you face any errors, check for permissions or the Apache error log `sudo tail -f /var/log/apache2/error.log`