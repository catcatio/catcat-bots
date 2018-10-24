FROM keymetrics/pm2:8-alpine

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV NPM_CONFIG_LOGLEVEL warn

RUN apk add --no-cache \
    git \
    build-base \
    g++ \
    python \
    curl

# Install PM2
RUN npm i -g ts-node typescript tsconfig-paths \
    && pm2 install typescript \
    && pm2 install pm2-logrotate \
    && pm2 set pm2-logrotate:max_size 10M \
    && pm2 set pm2-logrotate:compress true \
    && pm2 set pm2-logrotate:rotateInterval '0 0 * * * *'

RUN mkdir -p /usr/app

WORKDIR /usr/app

VOLUME ["/usr/app"]

# ENTRYPOINT ["pm2-runtime", "start", "pm2.json"]