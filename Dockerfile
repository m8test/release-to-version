FROM node:21-alpine

WORKDIR /node-app

COPY . .

RUN npm install

CMD ["node","src/main.js"]