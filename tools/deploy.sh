ssh root@catcat.io "mkdir -p ~/catcat-bots"
rsync -Praz --exclude=node_modules --exclude=.git ../ root@catcat.io:~/catcat-bots