FROM node:21-alpine

WORKDIR /node-app

COPY . .

RUN ls -alh /node-app
RUN chmod +x /node-app/setup.sh

ENTRYPOINT ["/node-app/setup.sh"]
