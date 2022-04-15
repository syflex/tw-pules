#!/bin/bash

# log starting message
echo "#################################################"
echo "#  Starting the PULSE services for development  #"
echo "#################################################"

echo
echo

if [[ -z $1 ]]; then
  echo "Starting in the foreground..."
elif [[ $1 == "-d" ]]; then
  echo "Starting in the background..."
else
  echo "Invalid argument provided. Got: $1"
  echo "Only '-d' allowed."
  echo "Exiting..."
  exit 1
fi

echo
echo

# start app
docker-compose -f docker-compose.dev.yml up $1 --build
