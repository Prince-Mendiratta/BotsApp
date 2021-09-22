const { MessageType } = require('@adiwajshing/baileys');
const { handle } = require('./add');

module.exports = {
    name: 'admins',
    description: "Tag admins",
    extendedDescription: "Tag all the admins of the group.",
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*.admin*  ```command is only applicable for group chats.```", MessageType.text);
            return;
        }

        var message = '';
        for(let admin of BotsApp.groupAdmins) {
            let number = admin.split('@')[0];
            message += `@${number}` + ' ';
        }
        client.sendMessage(BotsApp.from, message, MessageType.text, {contextInfo: {mentionedJid: BotsApp.groupAdmins}});
    }
}