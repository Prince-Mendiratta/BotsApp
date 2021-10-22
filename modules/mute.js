const { GroupSettingChange, MessageType } = require('@adiwajshing/baileys');
const Strings = require('../lib/db');
const MUTE = Strings.mute;

module.exports = {
    name: 'mute',
    description: MUTE.DESCRIPTION,
    extendedDescription: MUTE.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: '.mute 10 s'},
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, MUTE.NOT_GROUP_CHAT, MessageType.text);
            return;
        }
        if(!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, MUTE.NOT_ADMIN, MessageType.text);
            return;
        }
        if(!args[0]) {
            client.groupSettingChange(BotsApp.chatId, GroupSettingChange.messageSend, true);
            client.sendMessage(BotsApp.chatId, MUTE.CHAT_ADMIN_ONLY, MessageType.text);
            console.log(MUTE.CHAT_ADMIN_ONLY);
            return;
        } else if(isNaN(args[0])){
            client.sendMessage(BotsApp.chatId, MUTE.MENTION_DURATION, MessageType.text);
            return;
        }

        var duration;
        var type = "minutes";
        if(args[1] === 's') { 
            duration = args[0] * 1000;
            type = "seconds";
        } else if(args[1] === 'm') {
            duration = args[0] * 60 * 1000;
            type = "seconds";
        } else if(args[1] === 'h') {
            duration = args[0] * 60 * 60 * 1000;
            type = "seconds";
        } else {
            duration = args[0] * 60 * 1000; // default to minutes
        }

        client.groupSettingChange(BotsApp.chatId, GroupSettingChange.messageSend, true);
        client.sendMessage(BotsApp.chatId, "```Chat permissions changed to```  *admin only*  ```for " + args[0] + " " + type + ".```", MessageType.text);
        setTimeout(() => {
            client.groupSettingChange(BotsApp.chatId, GroupSettingChange.messageSend, false);
            client.sendMessage(BotsApp.chatId, MUTE.CHAT_ALL_MEMBERS, MessageType.text);
        }, duration);
    }
};
