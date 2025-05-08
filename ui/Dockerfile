FROM node:22.14.0-alpine AS builder

ARG VITE_CHAIN_URL

ENV VITE_CHAIN_URL=$VITE_CHAIN_URL

RUN npm install -g pnpm

WORKDIR /ui

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /ui/dist/ /usr/share/nginx/html