<p align="center">
  <img src="images/BotsApp_Logo.png" height="400px"/>
</p>


# 💠[BotsApp](https://mybotsapp.com/)💠
> Your Personal Assisstant, on WhatsApp!
---
![GitHub top language](https://img.shields.io/github/languages/top/Prince-Mendiratta/BotsApp) [![GitHub release](https://img.shields.io/github/release/Prince-Mendiratta/BotsApp.svg)](https://github.com/bkimminich/juice-shop/releases/latest)
 ![GitHub contributors](https://img.shields.io/github/contributors/Prince-Mendiratta/BotsApp) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/Prince-Mendiratta/BotsApp) ![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/Prince-Mendiratta/BotsApp) ![GitHub Repo stars](https://img.shields.io/github/stars/Prince-Mendiratta/BotsApp?style=social) ![GitHub repo size](https://img.shields.io/github/repo-size/Prince-Mendiratta/BotsApp)
 

![Docker Pulls](https://img.shields.io/docker/pulls/princemendiratta/botsapp?style=flat-square&label=Docker+Pulls) ![Docker Image Size](https://img.shields.io/docker/image-size/princemendiratta/botsapp?style=flat-square&label=Docker+Image+Size)

BotsApp is an optimized and easy-to-use WhatsApp UserBot written in Node.js.

Utilize your personal chat assistant/group manager to make the most out of WhatsApp.   



## Documentation

[Documentation Link](https://mybotsapp.com/documentation)


## Tutorial

Here's a tutorial to set up BotsApp on your own account in *less than 3 minutes.* For now, the Multi Device Bot can only be used locally, the tutorial for which is attached below.

[![How to deploy](https://img.shields.io/badge/How%20To-Deploy-red.svg?logo=Youtube)](https://www.youtube.com/watch?v=tGrjEZ3roY0&ab_channel=BotsApp)

[![Multi Device](https://img.shields.io/badge/Host%20Multi%20Device%20bot%20on-Windows-red.svg?logo=Youtube)](https://youtu.be/NZy4sZqncjg&ab_channel=BotsApp)


## Deployment

<b>Only local deployment is working for now!</b>

### Easiest Way

You can deploy BotsApp in minimal time without any prior knowledge using this method.

1. Head over to BotsApp's [Official website](https://mybotsapp.com/) and create an account on heroku using your email ID.
2. Once logged in, click on the "Deploy BotsApp" button in the sidebar.
3. Scan the QR code shown using your WhatsApp account (3 dots on top right corner -> Linked devices -> LINK A DEVICE). Click on the 'Continue'      button once done.
4. Once the bot is linked to your account, you will come across a form which can be used to manage settings/permissions of BotsApp. If required,    change the form fields. Then, click on the submit button.
5. Wait for 1-3 minutes for the bot to start. This is a one time process. Try using the '.alive' command in any of your chats to verify whether    your bot has been deployed succesfully.

Voila! You have deployed your bot in 5 easy steps. Once the bot has started successfully, you'll see a integration message on your whatsapp account.

### Manually on Heroku

<b>Deployment to heroku using the button is not working for now!</b>

You can deploy the bot the heroku yourself using the button below!

[![Deploy To Heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2FPrince-Mendiratta%2FBotsApp%2Ftree%2Fmain&template=https%3A%2F%2Fgithub.com%2FPrince-Mendiratta%2FBotsApp%2Ftree%2Fmainhttps://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2FPrince-Mendiratta%2FBotsApp%2Ftree%2Fmain&template=https%3A%2F%2Fgithub.com%2FPrince-Mendiratta%2FBotsApp%2Ftree%2Fmain)

### Using Docker locally

To follow this method, you will need to have docker installed on your machine and have some experience using docker.

To host the bot on your own device using docker, follow the following steps on your terminal / command prompt -

```bash
wget -O BotsApp.tar.gz https://github.com/Prince-Mendiratta/BotsApp/archive/refs/tags/v2.0.0-beta.tar.gz
tar -xvzf BotsApp.tar.gz
cd BotsApp-2.0.0-beta
docker build -t botsapp .
docker run --rm --name botsapp botsapp
```

This will create a container running BotsApp. You'll have to scan the QR at least once.

### The GNU/Linux Legacy Way

To use this method, you will need ffmpeg, nodejs, npm installed on your device.

To run the bot on your device manually, you can use the following commands -

```bash
git clone https://github.com/Prince-Mendiratta/BotsApp.git
cd BotsApp
yarn
npm start
```

## Scan QR Code again
If you're having issues when running locally it is recommended to scan the code again. To get the QR code again, follow these commands -
```
rm -rf BotsApp.db session.data.json
npm start
```

## Support and Discussion groups

Feel free to post your queries or concerns on any of the discussion forums mentioned below:

[![Join WhatsApp Group](https://img.shields.io/badge/Join-WhatsApp%20Group-bl.svg?logo=WhatsApp)](https://chat.whatsapp.com/GPEHkFlspzOKpSBTsYx7Wt)

[![Join Telegram Group](https://img.shields.io/badge/Join-Telegram%20Group-blue.svg?logo=Telegram)](https://t.me/BotsAppChat)

[![Join Telegram Channel](https://img.shields.io/badge/Join-Telegram%20Channel-red.svg?logo=Telegram)](https://t.me/Prince-Mendiratta)



## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Prince-Mendiratta"><img src="https://avatars.githubusercontent.com/u/54077356?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Prince Mendiratta</b></sub></a><br /><sub><i>Project Lead Developer</i></sub></td>
    <td align="center"><a href="https://github.com/Prashant-singla"><img src="https://avatars.githubusercontent.com/u/83973641?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Prashant Singla</b></sub></a><br /><sub><i>Core Developer</i></sub></td>
    <td align="center"><a href="https://github.com/Keshav-Pahwa"><img src="https://avatars.githubusercontent.com/u/83963387?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Keshav Pahwa</b></sub></a><br /><sub><i>Core Developer</i></sub></td>
    <td align="center"><a href="https://github.com/j0h4nn1410"><img src="https://avatars.githubusercontent.com/u/72455289?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johann Jose</b></sub></a><br /><sub><i>Core Developer</i></sub></td>
    <td align="center"><a href="https://github.com/Mohit161220"><img src="https://avatars.githubusercontent.com/u/83974093?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mohit Singh Rana</b></sub></a><br /><sub><i>Core Developer</i></sub></td>
    <td align="center"><a href="https://github.com/thegeek-dev"><img src="https://avatars.githubusercontent.com/u/70193222?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Neeraj Patel</b></sub></a><br /><sub><i>Moderator</i></sub></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->



## Inspiration

- Baileys Library

- Yusuf Usta 

- [X-tra-Telegram](https://github.com/Prince-Mendiratta/X-tra-Telegram)

## Copyright & License
- Copyright (C) 2021 - 2022 by [Prince-Mendiratta](https://github.com/Prince-Mendiratta)

- Licensed under the terms by [GNU GENERAL PUBLIC LICENSE](https://github.com/Prince-Mendiratta/BotsApp/blob/main/LICENSE)

## Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.