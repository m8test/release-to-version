FROM node:21-alpine

WORKDIR /node-app

COPY . .

RUN npm install

CMD ["node","/node-app/src/index.js"]