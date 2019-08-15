FROM node:10-alpine

ENV NODE_SOURCE /usr/src
WORKDIR $NODE_SOURCE

ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 80
CMD ["yarn", "start"]
