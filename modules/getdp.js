const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const chalk = require('chalk');
const Strings = require('../lib/db');
const GETDP = Strings.getdp;

module.exports = {
    name: 'getdp',
    description: GETDP.DESCRIPTION,
    extendedDescription: GETDP.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            let url = await client.getProfilePicture();
            client.sendMessage(
                BotsApp.chatId, 
                {url: url}, 
                MessageType.image, 
                { mimetype: Mimetype.image, caption: GETDP.BOT_IMAGE_CAPTION}
            );
        }

        let url = await client.getProfilePicture(BotsApp.chatId);
        try {
            client.sendMessage(
                BotsApp.chatId, 
                {url: url}, 
                MessageType.image, 
                { mimetype: Mimetype.image, caption: GETDP.GROUP_IMAGE_CAPTION}
            );
        } catch(err) {
            console.log(chalk.red('[ERROR]', err));
        }
        
    }
};


// downloadAndSaveMediaMessage
// downloadAndSaveMediaMessage(message: WebMessageInfo, filename: string, attachExtension?: boolean): Promise<string>
// Inherited from Base.downloadAndSaveMediaMessage

// Defined in src/WAConnection/6.MessagesSend.ts:442
// Securely downloads the media from the message
// ---------------------------------------------
// getProfilePicture
// getProfilePicture(jid: string): Promise<string>
// Inherited from Base.getProfilePicture

// Defined in src/WAConnection/4.Events.ts:415
// Get the URL to download the profile picture of a person/group

// Parameters
// jid: string
// Returns Promise<string>