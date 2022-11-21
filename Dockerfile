FROM princemendiratta/botsapp:latest

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

RUN git init --initial-branch=multi-device

RUN git remote add origin https://github.com/Prince-Mendiratta/BotsApp.git

RUN git fetch origin multi-device

RUN git reset --hard origin/multi-device

RUN yarn

# RUN cp -r /root/Baileys/lib /BotsApp/node_modules/@adiwajshing/baileys/

CMD [ "npm", "start"]