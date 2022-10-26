import { Boom } from '@hapi/boom'
import P, { Logger } from 'pino'
import makeWASocket, { MessageRetryMap, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, WASocket, proto, Contact } from '@adiwajshing/baileys'
// @ts-ignore
import { useRemoteFileAuthState } from './core/dbAuth.js'
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
const msgRetryCounterMap: MessageRetryMap = {};
const logger: Logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }).child({})
logger.level = 'fatal'

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ logger })
store?.readFromFile('./session.data.json')
// save every 10s
setInterval(() => {
    store?.writeToFile('./session.data.json')
}, 10_000);

(async (): Promise<void> => {
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

    const startSock = async () => {
        // @ts-ignore
        const { state, saveCreds } = await useRemoteFileAuthState();
        const { version, isLatest } = await fetchLatestBaileysVersion();
        const sock: WASocket = makeWASocket({
            version,
            logger,
            printQRInTerminal: true,
            auth: state,
            browser: ["BotsApp", "Chrome", "4.0.0"],
            msgRetryCounterMap,
            // implement to handle retries
            getMessage: async key => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid!, key.id!, undefined)
                    return msg?.message || undefined
                }

                return {
                    conversation: '-pls ignore-'
                }
            }
        });

        store?.bind(sock.ev);

        let client: Client = new Client(sock, store);

        sock.ev.process(
            async (events) => {
                if (events['connection.update']) {
                    const update = events['connection.update'];
                    const { connection, lastDisconnect } = update;
                    if (connection === 'close') {
                        if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                            startSock()
                        } else {
                            console.log(chalk.redBright('Connection closed. You are logged out. Delete the BotsApp.db and session.data.json files to rescan the code.'));
                            process.exit(0);
                        }
                    } else if (connection === 'connecting') {
                        console.log(chalk.yellowBright("[INFO] Connecting to WhatsApp..."));
                    } else if (connection === 'open') {
                        console.log(chalk.greenBright.bold("[INFO] Connected! Welcome to BotsApp"));
                    }
                }

                if (events['creds.update']) {
                    await saveCreds()
                }

                if (events['contacts.upsert']) {
                    const contacts: Contact[] = events['contacts.upsert'];
                    const contactsUpdate = (newContacts: Contact[]) => {
                        for (const contact of newContacts) {
                            if (store.contacts[contact.id]) {
                                Object.assign(store.contacts[contact.id], contact);
                            } else {
                                store.contacts[contact.id] = contact;
                            }
                        }
                        return;
                    };

                    contactsUpdate(contacts);
                }

                if (events['contacts.update']) {
                    const contacts: Partial<Contact>[] = events['contacts.update'];
                    const contactsUpdate = (newContacts) => {
                        for (const contact of newContacts) {
                            if (store.contacts[contact.id]) {
                                Object.assign(store.contacts[contact.id], contact);
                            } else {
                                store.contacts[contact.id] = contact;
                            }
                        }
                        return;
                    };
                    contactsUpdate(contacts);
                }

                if (events['messages.upsert']) {
                    const upsert = events['messages.upsert'];
                    // console.log(JSON.stringify(upsert, undefined, 2))
                    if (upsert.type !== 'notify') {
                        return;
                    }
                    for(const msg of upsert.messages){
                        let chat: proto.IWebMessageInfo = msg;
                        let BotsApp: BotsApp = await resolve(chat, sock);
                        // console.log(BotsApp);
                        if (BotsApp.isCmd) {
                            let isBlacklist: boolean = await Blacklist.getBlacklistUser(BotsApp.sender, BotsApp.chatId);
                            const cleared: boolean = await clearance(BotsApp, client, isBlacklist);
                            if (!cleared) {
                                return;
                            }
                            const reactionMessage = {
                                react: {
                                    text: "🪄",
                                    key: chat.key,
                                }
                            }
                            await sock.sendMessage(chat.key.remoteJid, reactionMessage);
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
                    }
                }
            }
        );

        return sock;
    }

    startSock();
})().catch(err => console.log('[MAINERROR] : %s', chalk.redBright.bold(err)));;