FROM node:10-alpine

ENV NODE_SOURCE /usr/src
WORKDIR $NODE_SOURCE

RUN apk update \
  && apk add vips vips-dev fftw build-base python musl --update-cache --repository https://alpine.global.ssl.fastly.net/alpine/edge/community/ --repository https://alpine.global.ssl.fastly.net/alpine/edge/main/

ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 80
CMD ["yarn", "start"]
