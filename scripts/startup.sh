#!/bin/bash

npm i
npm run build:once
pm2-runtime start pm2.json --web ${PM2_PORT}