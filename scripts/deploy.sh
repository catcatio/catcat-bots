#!/bin/bash

ssh root@catcat.io "mkdir -p ~/catcat-bots"

rsync -Praz --delete \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=lib \
    --exclude=pg_data \
    --exclude=pgadmin_data \
    ../ root@catcat.io:~/catcat-bots
