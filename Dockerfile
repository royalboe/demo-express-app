FROM node:latest

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

VOLUME /app/node_modules

EXPOSE 3000

CMD ["npm", "start"]