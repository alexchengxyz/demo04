FROM nginx:1.15.9-alpine

# copy nginx 'config file' and 'public file' to container
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /public /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]