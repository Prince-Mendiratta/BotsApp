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

1. Clone/Fork and download the codes to your PC or server
2. Open the folder in your terminal and run the following commands -
```bash 
npm install
```
3. Create the `config.env` file in the root directory and add the following fields -
```bash
BING_COOKIE="<Your bing cookie>"
```
3. Run ```npm start``` to start the app.
4. Scan the QR code shown using your WhatsApp account (3 dots on top right corner -> Linked devices -> LINK A DEVICE). Click on the 'Continue'      button once done.
4. Once the bot is linked to your account, you will come across a form which can be used to manage settings/permissions of BotsApp. If required,    change the form fields. Then, click on the submit button.
5. Try using the '.alive' command in any of your chats to verify whether    your bot has been deployed succesfully.

Voila! You have deployed your bot in 5 easy steps. Once the bot has started successfully, you'll see a integration message on your whatsapp account.

### How to get the bing cookie
You can only get the bing cookie if you have a Microsoft account and you have been selected to access the new bing.
1. Open the Microsoft Edge browser
2. Go to [Bing Chat](https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx). Make sure you are signed in to your Microft Account
3. Open the developer tools (F12)
4. Go to the Application tab
5. Go to the Storage tab
6. Go to the Cookies tab
7. Copy the value of the cookie named `_U` and paste it in the `BING_COOKIE` field in the `config.env` file.



### Credits

This project was made possible by the following projects:
1. [Bing Chat](https://github.com/transitive-bullshit/bing-chat)
2. [BotsApp](https://github.com/Prince-Mendiratta/BotsApp)


## Scan QR Code again
If you're having issues when running locally it is recommended to scan the code again. To get the QR code again, follow these commands -
```
rm -rf BotsApp.db session.data.json
npm start
```

## Copyright & License
- Copyright (C) 2021 - 2022 by [Prince-Mendiratta](https://github.com/Prince-Mendiratta)

- Licensed under the terms by [GNU GENERAL PUBLIC LICENSE](https://github.com/Prince-Mendiratta/BotsApp/blob/main/LICENSE)

## Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp or Bing or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.