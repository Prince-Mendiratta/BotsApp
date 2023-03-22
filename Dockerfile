FROM node:18.15.0 as node

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

RUN yarn install

# RUN cp -r /root/Baileys/lib /BotsApp/node_modules/@adiwajshing/baileys/

CMD [ "npm", "start"]