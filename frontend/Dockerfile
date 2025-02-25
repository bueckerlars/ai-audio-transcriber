# Stufe 1: Build-Umgebung
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stufe 2: Produktionsumgebung mit Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Nginx-Konfiguration anpassen
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]