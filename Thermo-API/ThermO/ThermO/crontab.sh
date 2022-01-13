#!/bin/bash

# generic script to use with crontab for Django management commands
# usage script: crontab.sh /path/to/django/ command
# for example: crontab.sh /var/www/api/ThermO scheduler

# cd to Django dir
cd $1

# activate Python virtual envoirment
source ./venv/bin/activate
cd ./ThermO

# run Django mangement command
python3 manage.py $2