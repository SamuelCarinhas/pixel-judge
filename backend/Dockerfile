FROM node:18
LABEL authors="Samuel Carinhas"
LABEL MAINTAINER="Samuel Carinhas <samuelsantos.c.2001@gmail.com>"
LABEL VERSION="0.1.0"

WORKDIR /app

RUN apt-get update -y
RUN apt-get install curl -y

COPY package*.json ./

RUN npm install -g npm --silent
RUN npm install --silent

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

VOLUME /app

# Healthcheck
HEALTHCHECK --interval=10s --timeout=30s --start-period=5s --retries=3 \
  CMD curl http://localhost:3000/ || exit 1

ENTRYPOINT ["/bin/sh", "-c" , "npm run build && npm start"]