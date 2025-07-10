FROM node:22

RUN apt-get update && apt-get install -y netcat-traditional

WORKDIR /app

COPY package*.json ./

COPY . .

COPY wait-for .
RUN chmod +x ./wait-for

RUN npm install -g npm
RUN npm install

EXPOSE 4200

CMD ["npm", "start"]