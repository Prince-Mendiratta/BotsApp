const {WAConnection, Browsers} = require ('@adiwajshing/baileys')
const fs = require('fs')
const chalk = require('chalk')

const conn = new WAConnection;

exports.saveSession = async () => {

    conn.browserDescription = Browsers.macOS('Chrome')

    conn.on('qr', async (qr) => {
        console.log(chalk.blueBright.bold("Scan the QR code above.\n"));
    })
    await conn.connect();

    var sass = JSON.stringify(conn.base64EncodedAuthInfo());
    var stringSession = Buffer.from(sass).toString('base64');
    console.log(chalk.green.bold("Your string session ->"), stringSession)
    process.exit(1);
}