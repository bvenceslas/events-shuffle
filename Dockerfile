FROM node:18

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

COPY .env ./

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start:prod"]