const conn = require('./core/sessionString')
const fs = require('fs')
const { join } = require('path')
const config = require('./config')
const banner = require('./lib/banner');
const chalk = require('chalk');
const wa = require('./core/helper');
const { MessageType } = require('@adiwajshing/baileys');

var client = conn.WhatsApp;

async function main() {
    
    client.logger.level = 'error'
    console.log(banner);
    var commandHandler = new Map();
    try{
        var session = conn.restoreSession(config.STRING_SESSION)
        client.loadAuthInfo(session)
    } catch(err) {
        if (err instanceof TypeError || err.message === "given authInfo is null" || err instanceof SyntaxError){
            console.log(
                chalk.redBright.bold("Incorrect Session String. Please authenticate again using command -> "),
                chalk.yellowBright.bold("npm start")
            );
            console.debug("[DEBUG] " + err);
            fs.writeFileSync('./config.env', `STRING_SESSION=""`);
            process.exit(0);
        }
        else {
            console.log(
                chalk.redBright.bold("SOMETHING WENT WRONG.\n"),
                chalk.redBright.bold("[DEBUG] " + err)
            );
            process.exit(0)
        }
    }

    client.on('connecting', async () => {
        console.log(chalk.yellowBright("[INFO] Connecting to WhatsApp..."));
    })

    client.on('open', async () => {
        console.log(chalk.greenBright.bold("[INFO] Connected! Welcome to BotsApp"));
        console.log(chalk.whiteBright.bold("[INFO] Installing Plugins... Please wait."));
        var moduleFiles = fs.readdirSync(join(__dirname, 'modules')).filter((file) => file.endsWith('.js'))
        for(var file of moduleFiles){
            const command = require(join(__dirname, 'modules', `${file}`));
            console.log(
                chalk.magentaBright("[INFO] Successfully imported module"),
                chalk.cyanBright.bold(`${file}`)
            )
            commandHandler.set(command.name, command);
        }
        console.log(chalk.green.bold("[INFO] Plugins Installed Successfully. The bot is ready to use."));
    })


    await client.connect();
    client.on('chat-update', async chat => {
        if (!chat.hasNewMessage) return
        if (!chat.messages) return
        console.log("-------------------------------------------")
        var sender = chat.messages.all()[0].key.remoteJid;
        const groupMetadata = sender.endsWith("@g.us") ? await client.groupMetadata(sender) : '';
        var BotsApp = wa.resolve(chat.messages.all()[0], client, groupMetadata);
        console.log(BotsApp);
        // if(BotsApp.from === "917838204238@s.whatsapp.net" && BotsApp.fromMe === false){ client.sendMessage(BotsApp.from, "xD", MessageType.text)}
        if(BotsApp.isCmd){
            const command = commandHandler.get(BotsApp.commandName);
            if(!command){
                client.sendMessage(BotsApp.from, "Woops, incorrect command! Use .help for command list.", MessageType.text);
                return;
            }
            var args = BotsApp.body.trim().split(/\s+/).slice(1);
            console.log("ARGS ->" + args);
            args.forEach(arg => console.log("arg -> " + arg  + "  type -> " + typeof(arg)));
            console.log("-------------------------------------------")
            try{
                command.handle(client, chat, BotsApp, args);
            }catch(err){
                console.log(chalk.red("[ERROR] ", err));
            }
        }
    })
}

main().catch(err => console.log('[ERROR] : %s', chalk.redBright.bold(err)));