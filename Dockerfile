FROM node:18.15.0 as node

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

#RUN corepack enable

#RUN corepack prepare yarn@stable --activate

RUN npm install


# RUN cp -r /root/Baileys/lib /BotsApp/node_modules/@adiwajshing/baileys/

CMD [ "npm", "start"]
