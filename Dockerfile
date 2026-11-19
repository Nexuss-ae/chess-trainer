FROM node:22-alpine
WORKDIR /app
COPY package.json server.js index.html service-worker.js favicon.ico favicon.png favicon.svg ./
COPY vendor ./vendor
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
