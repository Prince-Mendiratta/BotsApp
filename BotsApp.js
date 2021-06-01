const conn = require('./core/sessionString')
const fs = require('fs')
const config = require('./config')
const banner = require('./lib/banner');
const chalk = require('chalk');

const client = conn.WhatsApp;

async function BotsApp() {
    
    client.logger.level = 'debug'
    console.log(banner);
    var session = conn.restoreSession(config.STRING_SESSION)
    try{
        client.loadAuthInfo(session)
    } catch(err) {
        if (err instanceof TypeError || err.message === "given authInfo is null"){
            if(config.STRING_SESSION === ''){
                console.log(
                    chalk.redBright.bold("Please create a String Session first using command -> " + chalk.yellowBright.bold("node qr.js")));
            }
        }
        else {
            console.log(chalk.redBright.bold(err))
        }
    }
    await client.connect()
    client.on('chat-update', async (upd) => {
        console.log(upd)
    })
}

console.log(config.STRING_SESSION);
BotsApp();