FROM node:lts-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

COPY . .

COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

RUN npm install

EXPOSE 4200

CMD ["npm", "run", "start:docker"]