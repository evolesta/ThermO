#!/bin/bash

# global vars paths
REPODIR=/home/erik/ThermO
DJANGODIR=/var/www/api
IONICDIR=/var/www/front-end

echo "== ThermO server update script =="
echo "Updates the ThermO Django API and compiles the Ionic Front-end to destination"

read -p "Before we proceed, did you update the local repo with git pull? [y/n]" yn
case $yn in 
    [Nn]*) exit;;
    [Yy]*) ;;
    *) echo "Please enter yes or no";;
esac

read -p "Please supply the full API url (ex. https://application.com/api):" apiurl

# ThermO update script
# Stop Apache and clear out Ionic dir
echo "Stopping Apache and clear Ionic folder..."
service apache2 stop
rm -r -f ${IONICDIR}/*

# Copy overwrite Django files
echo "Overwrite Django project folder files..."
cp -r ${REPODIR}/Thermo-API/ThermO/* ${DJANGODIR}/ThermO

# Migrating the Django database if necessary
echo "Checking if Django needs some new database migrations..."
cd ${DJANGODIR}
source ./venv/bin/activate
cd ./ThermO
python3 manage.py makemigrations
python3 manage.py migrate

# Compile Ionic prod release
echo "Apply the correct API url in environment file before compiling..."
sed -i 's/http://localhost:8000/' + ${apiurl} ${REPODIR}/ThermO-Frontend/src/app/environments/environment.prod.ts

echo "Compiling new Ionic production release..."
echo "This can take a few minutes..."
cd ${REPODIR}/ThermO-Frontend/
ionic build --prod

echo "Copy new Ionic production release to www dir..."
cp -r ${REPODIR}/ThermO-Frontend/www/* ${IONICDIR}/

echo "Starting Apache again..."
service apache2 start

echo "Django and Ionic should be running again with the latest ThermO version. Please check out in your webbrowser."
echo "Thank you for using ThermO!"