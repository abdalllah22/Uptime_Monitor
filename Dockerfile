FROM node:9-slim

WORKDIR /app

ADD package.json /app

RUN npm install 

ADD . /app

CMD npm run dev