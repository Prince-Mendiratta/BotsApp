const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const inputSanitization = require("../sidekick/input-sanitization");
const strings = require("../lib/db")
const CREATE = strings.CREATE;

module.exports = {
    name: "create",
    description: CREATE.DESCRIPTION,
    extendedDescription: CREATE.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        if(args.length === 0) {
            client.sendMessage(BotsApp.chatId, "```Enter the name of the grp```", MessageType.text);
            return;
        }
        let nameOfTheGrp = 
        BotsApp.body.replace(
            BotsApp.body[0] + BotsApp.commandName + " ",
            ""
        );

        if(BotsApp.isPm) {
            const group = await client.groupCreate (nameOfTheGrp, [BotsApp.owner, BotsApp.sender]);
            return;
        }
        else {
            if(BotsApp.isReply){
                    const group = await client.groupCreate (nameOfTheGrp, [BotsApp.sender, BotsApp.replyParticipant]);
                    return;
            }
            else {
                client.sendMessage(BotsApp.chatId, "```Tag a person that should be included in group```", MessageType.text);
                return;
            }
        }
    }
}