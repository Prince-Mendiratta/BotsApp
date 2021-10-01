const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const chalk = require('chalk');
const Strings = require('../lib/db');
const GETDP = Strings.getdp;

module.exports = {
    name: 'getdp',
    description: GETDP.DESCRIPTION,
    extendedDescription: GETDP.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        const processing = await client.sendMessage(BotsApp.chatId, "```Getting display picture...```", MessageType.text);
        try {
            let url = await client.getProfilePicture(BotsApp.chatId);
            await client.sendMessage(
                BotsApp.chatId, 
                {url: url}, 
                MessageType.image, 
                {mimetype: Mimetype.jpeg, caption: GETDP.IMAGE_CAPTION}
            );
            return client.deleteMessage(BotsApp.chatId, {id: processing.key.id, remoteJid: BotsApp.chatId, fromMe: true});
        } catch(err) {
            console.log(chalk.red('[ERROR]', err));
            if(err.status == 404) {
                await client.sendMessage(BotsApp.chatId, "```Display picture not found. Upload an image and try again.```", MessageType.text)
            }
            return client.deleteMessage(BotsApp.chatId, {id: processing.key.id, remoteJid: BotsApp.chatId, fromMe: true});
        }
    }
};
