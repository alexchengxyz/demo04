FROM node:10.15.3-alpine

# create alex_chen directory and use it ad the workgin directory
RUN mkdir -p /home/alex_chen/server
WORKDIR /home/alex_chen/server

COPY package.json /home/alex_chen/server
COPY package-lock.json /home/alex_chen/server

RUN npm install

COPY . /home/alex_chen/server

# 執行
CMD [ "npm", "run", "api-server" ]