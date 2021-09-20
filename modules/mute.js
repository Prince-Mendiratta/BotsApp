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
        if(isNaN(args[0])) {
            client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, true);
            client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *admin only*.", MessageType.text);
            console.log("```Chat permissions changed to```  *admin only*.");
            return;
        } 

        var duration;
        if(args[1] === 's') { 
            duration = args[0] * 1000;
        } else if(args[1] === 'm') {
            duration = args[0] * 60 * 1000;
        } else if(args[1] === 'h') {
            duration = args[0] * 60 * 60 * 1000;
        } else {
            duration = args[0] * 60 * 1000; // default to minutes
        }

        client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, true);
        client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *admin only*.", MessageType.text);
        setTimeout(() => {
            client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, false);
            client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *all group members*.", MessageType.text);
        }, duration);
    }
};
