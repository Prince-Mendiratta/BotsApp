FROM node:18.15.0 as node

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

RUN corepack enable

# RUN yarn set version stable

RUN yarn install

# RUN cp -r /root/Baileys/lib /BotsApp/node_modules/@adiwajshing/baileys/

CMD [ "npm", "start"]