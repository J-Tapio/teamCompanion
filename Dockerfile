FROM node:17-alpine3.12

ENV NODE_ENV=production
ENV PORT=80

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install --only=production

COPY src ./src
COPY db ./db
COPY knexfile.js index.js app.js exercisesToEquipment.js ./

EXPOSE 80

CMD node ./index.js