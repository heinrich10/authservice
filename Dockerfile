# Stage 0 - Build
FROM node:10.15.1 as builder

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run lint && npm test

# Stage 1 - Run
FROM node:10.15.1
WORKDIR /usr/src/app
COPY . .
RUN npm install --production

EXPOSE 6010

CMD ["node", "index.js"]
