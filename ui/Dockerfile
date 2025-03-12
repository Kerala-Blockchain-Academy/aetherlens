FROM node:22.14.0-alpine

RUN npm install -g pnpm

WORKDIR /ui

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm run build