FROM princemendiratta/botsapp:latest

WORKDIR /

COPY . /BotsApp

WORKDIR /BotsApp

RUN npm install

RUN git init --initial-branch=main

RUN git remote add origin https://github.com/BotsAppOfficial/BotsApp.git

RUN git fetch origin main

RUN git reset --hard origin/main

CMD [ "npm", "start"]