#!/bin/bash

echo "startup.sh"
echo $NODE_ENV

mkdir -p \
    ./pg_data \
    ./pgadmin_data

npm i
pm2-runtime start pm2.json --web ${PM2_PORT}
