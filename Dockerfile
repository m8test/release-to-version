FROM node:21-alpine

WORKDIR /node-app

COPY . .

RUN npm install
RUN npm run build

CMD ["node","/node-app/dist/main.js"]