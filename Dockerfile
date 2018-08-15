FROM alpine:edge
ENV NODE_ENV develop
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN apk --no-cache add git bash
RUN apk add --update nodejs nodejs-npm && npm install -g npm

RUN mkdir -p /usr/app \
    && npm i -g nodemon

WORKDIR /usr/app
VOLUME ["/usr/app"]
