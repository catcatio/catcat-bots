#!/bin/bash

ssh root@catcat.io "cd ~/catcat-bots && docker-compose exec -T catcat-bots pm2 logs"
