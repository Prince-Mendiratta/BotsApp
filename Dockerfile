FROM princemendiratta/botsapp:latest

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

RUN git init --initial-branch=main

RUN git remote add origin https://github.com/BotsAppOfficial/BotsApp.git

RUN git fetch origin main

RUN git reset --hard origin/main

RUN npm install

# RUN cp -r /root/Baileys/lib /BotsApp/node_modules/@adiwajshing/baileys/

CMD [ "npm", "start"]