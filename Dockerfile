FROM node:16

WORKDIR /home/satyam/app

COPY package.json ./


RUN npm install

COPY ./src ./

COPY .env ./

EXPOSE 8080

CMD ["node", "index.js"]
