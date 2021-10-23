const {
    MessageType
} = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "disappear",
    description: STRINGS.disappear.DESCRIPTION,
    extendedDescription:STRINGS.disappear.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ['.disappear', '.disappear off']},
    async handle(client, chat, BotsApp, args) {
        var time = 7 * 24 * 60 * 60;
        if (BotsApp.isPm){
            client.sendMessage(BotsApp.chatId, STRINGS.general.NOT_A_GROUP, MessageType.text);
            return;
        }
        if (BotsApp.isGroup) {
            if (chat.message.extendedTextMessage == null){
                try {
                    await client.toggleDisappearingMessages(
                        BotsApp.chatId,
                        time
                    )
                } catch (err) {
                    console.log(err);
                }
            }  
            else{
                try {
                    await client.toggleDisappearingMessages(
                        BotsApp.chatId,
                        0
                    )
                } catch (err) {
                    console.log(err);
                }
            } 
            return;
        }
        if (chat.message.extendedTextMessage.contextInfo.expiration == 0) {
            var time = 7 * 24 * 60 * 60;
        }
        else {
            var time = 0;
        }
        try {
            await client.toggleDisappearingMessages(
                BotsApp.chatId,
                time
            )
        } catch (err) {
            console.log(err);
        }
        return;
    }
}


