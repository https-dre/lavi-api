#!/bin/bash

echo "Starting Laví Back-End in production mode"
echo "Preparing environment"

bash ci/setup.sh

echo "Start with docker setup"
docker-compose down
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --force-recreate --build -d
