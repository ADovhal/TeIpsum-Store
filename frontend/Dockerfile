FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build 

FROM nginx:alpine
ARG NGINX_CONFIG=nginx.stage.conf

COPY --from=build /app/build /usr/share/nginx/html
COPY ./${NGINX_CONFIG} /etc/nginx/conf.d/default.conf
