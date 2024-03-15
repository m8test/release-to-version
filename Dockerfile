FROM node:21-alpine

WORKDIR /node-app

COPY . .

ENTRYPOINT ["/node-app/setup.sh"]