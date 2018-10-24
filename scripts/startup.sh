#!/bin/bash

echo "startup.sh"
echo $NODE_ENV
npm i
# npm run build:once
pm2-runtime start pm2.json --web ${PM2_PORT}
# pm2 start ts-node src/index.ts