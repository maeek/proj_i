FROM node:16-alpine

RUN mkdir -p /var/www/server

WORKDIR /var/www/server

ADD . /var/www/server

RUN npm ci

CMD npm run start:dev
