FROM node:21-alpine

WORKDIR /node-app

COPY . .

RUN npm install
RUN export PATH="${PATH}:/node-app/setup.sh"
RUN echo "$PATH"

CMD ["node","/node-app/src/index.js"]
