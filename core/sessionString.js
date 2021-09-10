const {WAConnection, Browsers} = require ('@adiwajshing/baileys')
const fs = require('fs')
const chalk = require('chalk')
const config = require('../config');

const conn = new WAConnection();

exports.WhatsApp = conn;

exports.saveSession = async () => {
    
    if (!fs.existsSync('./config.env') || config.STRING_SESSION == "") {
        conn.browserDescription = Browsers.macOS('Chrome')

        conn.on('qr', async (qr) => {
            console.log(chalk.blueBright.bold("Scan the QR code above.\n"));
        })
        await conn.connect();

        var sass = JSON.stringify(conn.base64EncodedAuthInfo());
        var stringSession = Buffer.from(sass).toString('base64');
        console.log(chalk.greenBright.bold("Your string session ->"), stringSession)
        if(config.HEROKU === false){
            fs.writeFileSync('./config.env', `STRING_SESSION="${stringSession}"`);
        }
        process.exit(0);
    }
}

exports.restoreSession = function(sessionString) {
    var dec = JSON.parse(Buffer.from(sessionString, 'base64').toString('utf-8'));
    return dec;
}