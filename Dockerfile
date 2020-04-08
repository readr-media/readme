FROM node:10-alpine

ENV NODE_SOURCE /usr/src
WORKDIR $NODE_SOURCE

RUN apk update \
  && apk add vips fftw build-base python --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/community/ --repository https://dl-3.alpinelinux.org/alpine/edge/main

ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 80
CMD ["yarn", "start"]
