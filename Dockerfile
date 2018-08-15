FROM node:8.9
WORKDIR /app
CMD yarn start
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
