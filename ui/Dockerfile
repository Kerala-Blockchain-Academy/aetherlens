FROM node:22.14.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /ui

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /ui/dist/ /usr/share/nginx/html