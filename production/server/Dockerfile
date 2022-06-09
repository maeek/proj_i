FROM node:15-alpine
RUN npm install -g npm@8.12.1
RUN mkdir -p /var/www/server
WORKDIR /var/www/server
ADD . /var/www/server
RUN npm install
CMD npm run start:dev
