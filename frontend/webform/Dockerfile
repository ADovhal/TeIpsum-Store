FROM node:23-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# FROM nginx:alpine
# ARG NGINX_CONFIG=nginx.stage.conf

# COPY --from=build /app/build /usr/share/nginx/html
# COPY ./${NGINX_CONFIG} /etc/nginx/conf.d/default.conf
