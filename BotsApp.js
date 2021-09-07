const conn = require('./core/sessionString')
const fs = require('fs')
const config = require('./config')
const banner = require('./lib/banner');
const chalk = require('chalk');
const wa = require('./core/helper')

const client = conn.WhatsApp;

async function main() {
    
    client.logger.level = 'debug'
    console.log(banner);
    var session = conn.restoreSession(config.STRING_SESSION)
    try{
        client.loadAuthInfo(session)
    } catch(err) {
        if (err instanceof TypeError || err.message === "given authInfo is null"){
            if(config.STRING_SESSION === ''){
                console.log(
                    chalk.redBright.bold("Please create a String Session first using command -> " + chalk.yellowBright.bold("node qr.js"))
                    );
            }
        }
        else {
            console.log(chalk.redBright.bold(err))
        }
    }
    await client.connect()
    client.on('chat-update', async chat => {
        if (!chat.hasNewMessage) return
        if (!chat.messages) return
        var sender = chat.messages.all()[0].key.remoteJid;
        const groupMetadata = sender.endsWith("@g.us") ? await client.groupMetadata(sender) : '';
        var BotsApp = wa.resolve(chat.messages.all()[0], client, groupMetadata);
        console.log(BotsApp);
        console.log(JSON.stringify(BotsApp));
    })
}

console.log(config.STRING_SESSION);
main();