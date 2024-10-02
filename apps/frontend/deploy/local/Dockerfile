FROM node:20.15.1-slim

WORKDIR /usr/apps/frontend

COPY package*.json .
RUN npm ci

COPY . .

CMD ["npm", "run", "start"]