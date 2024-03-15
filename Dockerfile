FROM node:21-alpine
ARG PROJECT_DIR=/node-app
WORKDIR $PROJECT_DIR

COPY . .

RUN chmod +x $PROJECT_DIR/setup.sh

ENTRYPOINT ["$PROJECT_DIR/setup.sh", "$PROJECT_DIR"]
