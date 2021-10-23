const { MessageType } = require("@adiwajshing/baileys")
const Strings = require("../lib/db")
const format = require('python-format-js');
const alive = Strings.alive

module.exports = {
    name: 'alive',
    description: alive.DESCRIPTION,
    extendedDescription: alive.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: '.alive'},
    async handle(client, chat, BotsApp, args){
        return await client.sendMessage(BotsApp.chatId, alive.ALIVE_MSG, MessageType.text);
    }
}