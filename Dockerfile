FROM node:16.16.0-alpine3.16

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY src ./src
COPY db ./db
COPY knexfile.js index.js app.js ./

EXPOSE 5555

CMD [ "npm", "run", "start-dev" ]