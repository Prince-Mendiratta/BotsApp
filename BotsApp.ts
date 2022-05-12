import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket,  { AuthenticationCreds, AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
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

const sequelize = config.DATABASE;
const GENERAL = STRINGS.general;
const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }).child({ })
logger.level = 'error'

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ logger })
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('[INFO] Connection has been established successfully.');
    } catch (error) {
        console.error('[ERROR] Unable to connect to the database:', error);
    }
    await sequelize.sync();

	const { state , saveCreds } = await useRemoteFileAuthState(logger);

    const startSock = async() => {
        const sock = makeWASocket({
            logger,
            printQRInTerminal: true,
            auth: state,
            browser: ["BotsAppMD", "Chrome", "4.0.0"],
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
            // console.log(JSON.stringify(m, undefined, 2))
        })
    
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if(connection === 'close') {
                // reconnect if not logged out
                if((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                    startSock()
                    // process.exit(0)
                } else {
                    console.log('Connection closed. You are logged out.')
                }
            }
    
            console.log('connection update', update)
        })
        
        sock.ev.on('creds.update', (creds) => {
            saveCreds(creds)
        })
    
        return sock
    }

    startSock();
})();