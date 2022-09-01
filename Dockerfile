FROM node:18-alpine

# Create app directory
RUN mkdir -p /usr/src/socket/app
WORKDIR /usr/src/socket/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "webserver.js" ]
