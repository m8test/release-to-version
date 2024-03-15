FROM node:21-alpine

WORKDIR /node-app

COPY . .

RUN chmod +x /node-app/setup.sh

ENTRYPOINT ["/node-app/setup.sh"]
