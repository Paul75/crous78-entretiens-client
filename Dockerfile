FROM node:lts-alpine

RUN apk add --no-cache bash

WORKDIR /app/client

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

EXPOSE 4200 49153


CMD ["npm", "run", "start:docker"]