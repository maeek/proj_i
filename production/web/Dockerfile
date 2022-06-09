FROM node:16-alpine as builder

ADD ./production/web /app

WORKDIR /app

RUN npm ci && npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./production/web/nginx.conf /etc/nginx/nginx.conf