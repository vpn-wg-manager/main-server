FROM node:18.16.0-alpine

WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN npm install -g pnpm@8.5.0
COPY . .
RUN pnpm run build
EXPOSE 2310
CMD [ "npm", "run", "start:prod" ]
