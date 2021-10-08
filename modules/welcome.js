const { MessageType } = require('@adiwajshing/baileys');
const Strings = require('../lib/db');
const config = require('../config')
const sql = config.DATABASE;
const Greetings = require('../database/greeting')
const MUTE = Strings.mute;


module.exports = {
    name: 'welcome',
    description: MUTE.DESCRIPTION,
    extendedDescription: MUTE.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, MUTE.NOT_GROUP_CHAT, MessageType.text);
            return;
        }
        if(args.length == 0){
            client.sendMessage(BotsApp.chatId, "Enter text", MessageType.text);
        }else{
            text = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "")
            Greetings.Greeting.findOrCreate({
                where:{
                    chat: BotsApp.chatId
                },
                defaults:{
                    chat: BotsApp.chatId,
                    greetingType: "welcome",
                    welcome: text,
                    goodbye: null
                }
            })
        }
    }
}