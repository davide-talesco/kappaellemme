# specify the node base image with your desired version node:<version>
FROM node:9-alpine

WORKDIR /home/app

COPY . /home/app

RUN npm install

ENTRYPOINT ["node"]

CMD ["index.js"]

