#!/bin/bash

ENV_FILE=.env

services=("api" "realtime" "worker")

echo "Copy .env for each service"

for item in "${services[@]}"; do
    cp -f "$ENV_FILE" "$item/.env.production"
    echo "- env file: $item/.env.production"
done
    