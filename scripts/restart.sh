#!/bin/bash

ssh root@catcat.io "cd ~/catcat-bots && docker-compose down && docker-compose up --build -d"
