FROM node:18.16.0-alpine

WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN npm install -g pnpm@8.5.0
RUN pnpm i
COPY . .
RUN pnpm run build
EXPOSE 2310
CMD [ "pnpm", "run", "start:prod" ]
