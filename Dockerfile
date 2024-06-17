FROM node:22.3-bookworm-slim

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

VOLUME /app/node_modules

EXPOSE 3000

CMD ["npm", "start"]