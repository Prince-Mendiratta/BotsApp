const { GroupSettingChange, MessageType } = require('@adiwajshing/baileys');

module.exports = {
    name: 'unmute',
    description: 'Unmute',
    extendedDescription: 'Unmute non-admin members of the group.',
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, "*.unmute*  ```command is only applicable for a group chat.```", MessageType.text);
            return;
        }
        if(!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, "```Sorry, dont have the permissions to do so since I am not an admin.```", MessageType.text);
            return;
        }
        client.groupSettingChange(BotsApp.chatId, GroupSettingChange.messageSend, false);
        client.sendMessage(BotsApp.chatId, "```Chat permissions changed to```  *all group members*.", MessageType.text);
    }
};
