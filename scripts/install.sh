#!/bin/bash

# match this dir with your local git repository root dir
REPODIR=/home/erik/ThermO
# the desired dir where Django will be served from
DJANGODIR=/var/www/api
# the desired dir where your front-end will be served from
IONICDIR=/var/www/front-end

echo "== ThermO server install script =="
echo "This script will install your ThermO server and REST API"

read -p "Did you modified the variables of this script to the right directories? [y/n]" yn
case $yn in
    [Nn]*) exit;;
    [Yy]*) ;;
    *) echo "Please enter yes [y] or no [n]"
esac

echo "Installing required dependencies..."
apt-get -y install apache2 libapache2-mod-wsgi-py python3 python3-dev python3-venv mariadb-server

echo "Configure MariaDB (MySQL) server to your needs..."
echo "Hint: there is no root password set, just hit enter"
mysql_secure_installation

echo "Create a new database and user and add permissions to it..."
read -p "What root password did you set?" rootpassword
DBPASSWORD = openssl rand -hex 10 
mysql --user=root --password=$rootpassword

#MySQL commands
CREATE DATABASE thermo;
CREATE USER `thermo`@`localhost` INDENTIFIED WITH mysql_native_password BY $DBPASSWORD;
GRANT ALL PRIVILEGES ON thermo.* TO `thermo`@`localhost`;
FLUSH PRIVILEGES;
exit
echo "A MySQL database and user with the name 'thermo' are created. Please note this password: ${DBPASSWORD}"
read -p "== Hit enter to continue =="

echo "Setting up Django..."
mkdir ${DJANGODIR}
cp -r ${REPODIR}/Thermo-API/ThermO/* ${DJANGODIR}
chown $USER -R ${DJANGODIR}
chown :www-data -R ${DJANGODIR}

echo "Setting up Django's settings.py"
mv {$DJANGODIR}/ThermO/ThermO/settings.py.example {$DJANGODIR}/ThermO/ThermO/settings.py
KEY = openssl rand -hex 20
sed -i 's/yourkey/${KEY}' {$DJANGODIR}/ThermO/ThermO/settings.py

echo "Please adjust your ${DJANGODIR}/ThermO/ThermO/settings.py to your needs. See the documentation for details."
read -p "== Hit enter to continue =="

echo "Create a Python venv and install required packages..."
cd ${DJANGODIR}
python3 -m venv venv
source ./venv/bin/activate
python3 -m pip install -r requirements.txt

echo "Run database setup..."
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py loaddata setup_db

