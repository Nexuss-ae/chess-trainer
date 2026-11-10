FROM node:22-alpine
WORKDIR /app
COPY package.json server.js index.html service-worker.js coach-avatars.png mommy-sample.mp3 ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
