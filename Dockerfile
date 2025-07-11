FROM node:22

RUN apt-get update && apt-get install -y netcat-traditional

WORKDIR /app

COPY package*.json ./

COPY . .

COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

RUN npm install

EXPOSE 4200

CMD ["npm", "start"]