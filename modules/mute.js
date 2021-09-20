const { GroupSettingChange, MessageType } = require('@adiwajshing/baileys');

module.exports = {
    name: 'mute',
    description: 'Mute',
    extendedDescription: "Mute non-admin members of the group.",
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*.mute*  ```command is only applicable in a group chat.```", MessageType.text);
            return;
        }
        if(!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.from, "```Sorry, dont have the permission to do so since I am not an admin.```", MessageType.text);
            return;
        }
        if(!args[0]) {
            client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, true);
            client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *admin only*.", MessageType.text);
            console.log("```Chat permissions changed to```  *admin only*.");
            return;
        } else if(isNaN(args[0])){
            client.sendMessage(BotsApp.from, "Please mention how long you want to mute the chat. For example,\n*.mute 10 s* to mute for 10 seconds.", MessageType.text);
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

        client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, true);
        client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *admin only*  ```for " + args[0] + " " + type + ".```", MessageType.text);
        setTimeout(() => {
            client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, false);
            client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *all group members*.", MessageType.text);
        }, duration);
    }
};
