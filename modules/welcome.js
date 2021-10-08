const { MessageType } = require('@adiwajshing/baileys');
const Strings = require('../lib/db');
const config = require('../config')
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
const MUTE = Strings.mute;
const sql = require('../database/greetings');
const { Greetings, setWelcome } = require('../database/greetings');
// const { Greetings } = require('../database/greetings');
var sqlite = require('sqlite3').verbose()
var db = new sqlite.Database('BotsApp.db')

module.exports = {
    name: 'welcome',
    description: MUTE.DESCRIPTION,
    extendedDescription: MUTE.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, MUTE.NOT_GROUP_CHAT, MessageType.text);
            return;
        }
        if(args.length < 0){
            client.sendMessage(BotsApp.chatId, "Enter text", MessageType.text);
        }
        else{
            var text = "Hello there";
             await Greetings.sync()
             await Greetings.create({chat : 0 , welcome : "welcome", goodbye : "goodbye"})
             await setWelcome({ chat: BotsApp.groupId, welcome:text });

          
        }
    }
}