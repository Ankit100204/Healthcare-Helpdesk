FROM node:22-alpine

RUN apk add --no-cache tzdata

ENV TZ=Asia/Kolkata

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 5000

CMD ["npm","run","dev"]