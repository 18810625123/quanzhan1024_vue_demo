FROM node:14.19.1

RUN  apt-get update \
     && apt-get install -y curl \
     && apt-get install -y nginx \
     && apt-get install -y lsof \
     && apt-get install -y yarn \
     && apt-get install -y python \
     && apt-get install -y vim

WORKDIR /home/app
COPY package.json /home/app/
RUN npm install

COPY . /home/app/

EXPOSE 4200
CMD ["npm","run","dev"]

