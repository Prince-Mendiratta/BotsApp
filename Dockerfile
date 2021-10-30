FROM princemendiratta/botsapp:latest

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

RUN npm install

CMD [ "npm", "start"]