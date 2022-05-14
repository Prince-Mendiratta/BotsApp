import { Boom } from '@hapi/boom'
import P, { Logger } from 'pino'
import makeWASocket, { AuthenticationCreds, AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState, WASocket, GroupMetadata, proto } from '@adiwajshing/baileys'
import useRemoteFileAuthState from './core/dbAuth'
import fs from 'fs'
import { join } from 'path'
import config from './config'
import { banner } from './lib/banner'
import chalk from 'chalk'
import Greetings from './database/greeting'
import STRINGS from "./lib/db"
import Blacklist from './database/blacklist'
import clearance from './core/clearance'
import { start } from 'repl'
import format from 'string-format';
import resolve from './core/helper'
import { Sequelize } from 'sequelize/types'
import Command from './sidekick/command'
import BotsApp from './sidekick/sidekick'
import Client from './sidekick/client'
import { MessageType } from './sidekick/message-type'

const sequelize: Sequelize = config.DATABASE;
const GENERAL: any = STRINGS.general;
const logger: Logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }).child({})
logger.level = 'error'

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ logger })
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
    store?.writeToFile('./baileys_store_multi.json')
}, 10_000);

(async () : Promise<void> => {
    console.log(banner);

    let commandHandler: Map<string, Command> = new Map();

    console.log(chalk.yellowBright.bold("[INFO] Installing Plugins... Please wait."));
    let moduleFiles: string[] = fs.readdirSync(join(__dirname, 'modules')).filter((file) => file.endsWith('.js'))
    for (let file of moduleFiles) {
        try {
            const command: Command = require(join(__dirname, 'modules', `${file}`));
            console.log(
                chalk.magentaBright("[INFO] Successfully imported module"),
                chalk.cyanBright.bold(`${file}`)
            )
            commandHandler.set(command.name, command);
        } catch (error) {
            console.log(
                chalk.blueBright.bold("[INFO] Could not import module"),
                chalk.redBright.bold(`${file}`)
            )
            console.log(`[ERROR] `, error);
            continue;
        }
    }
    console.log(chalk.green.bold("[INFO] Plugins Installed Successfully. The bot is ready to use."));
    console.log(chalk.yellowBright.bold("[INFO] Connecting to Database."));
    try {
        await sequelize.authenticate();
        console.log(chalk.greenBright.bold('[INFO] Connection has been established successfully.'));
    } catch (error) {
        console.error('[ERROR] Unable to connect to the database:', error);
    }
    console.log(chalk.yellowBright.bold("[INFO] Syncing Database..."));
    await sequelize.sync();
    console.log(chalk.greenBright.bold("[INFO] All models were synchronized successfully."));

    let firstInit: boolean = true;

    const { state, saveCreds } = await useRemoteFileAuthState(logger);

    const startSock = async () => {
        const sock: WASocket = makeWASocket({
            logger,
            printQRInTerminal: true,
            auth: state,
            browser: ["BotsApp", "Chrome", "4.0.0"],
            version: [2, 2204, 13],
            // implement to handle retries
            getMessage: async key => {
                return {
                    conversation: 'hello'
                }
            }
        });

        store?.bind(sock.ev);

        sock.ev.on('messages.upsert', async m => {
            console.log(JSON.stringify(m, undefined, 2))
            // if(m.type === 'append' && !config.OFFLINE_RESPONSE){
            //     return;
            // }
            if(m.type !== 'notify'){
                // console.log(chalk.redBright(JSON.stringify(m, undefined, 2)));
                return;
            }
            
            let chat: proto.IWebMessageInfo = m.messages[0];
            let BotsApp: BotsApp = await resolve(chat, sock);
            console.log(BotsApp);
            let client : Client = new Client(sock);
            if(BotsApp.isCmd){
                let isBlacklist: boolean = await Blacklist.getBlacklistUser(BotsApp.sender, BotsApp.chatId);
                const cleared: boolean = await clearance(BotsApp, sock, isBlacklist);
                if (!cleared) {
                    return;
                }
                console.log(chalk.redBright.bold(`[INFO] ${BotsApp.commandName} command executed.`));
                const command = commandHandler.get(BotsApp.commandName);
                var args = BotsApp.body.trim().split(/\s+/).slice(1);
                if (!command) {
                    client.sendMessage(BotsApp.chatId, "```Woops, invalid command! Use```  *.help*  ```to display the command list.```", MessageType.text);
                    return;
                } else if (command && BotsApp.commandName == "help") {
                    try {
                        command.handle(client, chat, BotsApp, args, commandHandler);
                        return;
                    } catch (err) {
                        console.log(chalk.red("[ERROR] ", err));
                        return;
                    }
                }
                try {
                    await command.handle(client, chat, BotsApp, args).catch(err => console.log("[ERROR] " + err));
                } catch (err) {
                    console.log(chalk.red("[ERROR] ", err));
                }
            }
        })

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                // reconnect if not logged out
                if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                    startSock()
                    // process.exit(0)
                } else {
                    console.log('Connection closed. You are logged out.')
                }
            } else if (connection === 'connecting') {
                console.log(chalk.yellowBright("[INFO] Connecting to WhatsApp..."));
            } else if (connection === 'open') {
                console.log(chalk.greenBright.bold("[INFO] Connected! Welcome to BotsApp"));
                if (firstInit) {
                    firstInit = false;
                    // sock.sendMessage(
                    //     sock.user.id,
                    //     {
                    //         text: format(GENERAL.SUCCESSFUL_CONNECTION, {
                    //             worktype: config.WORK_TYPE,
                    //         })
                    //     }
                    // );
                }
            } else {
                console.log('connection update', update)
            }
        })

        sock.ev.on('creds.update', (creds) => {
            saveCreds(creds)
        })

        return sock
    }

    startSock();
})().catch(err => console.log('[MAINERROR] : %s', chalk.redBright.bold(err)));;