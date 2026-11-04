FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY service-worker.js /usr/share/nginx/html/service-worker.js
EXPOSE 80
