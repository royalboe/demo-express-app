FROM node:latest

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]