const { MessageType } = require("@adiwajshing/baileys");

module.exports = {
    name: "block",
    description: "block contact",
    extendedDescription:
        "Send '.block' in a group chat as a reply or in personal chat to block that particular contact.",
    async handle(client, chat, BotsApp, args) {
        var JID = "";
        var numberOfArguments = args.length;
        var blockType = "add";

        // Defining blocktype
        if (numberOfArguments >= 1) {
            if (args[0] === "add" || args[0] === "remove") {
                blockType = args[0];
            } else {
                client.sendMessage(
                    BotsApp.from,
                    "oops - Invalid First attribute - \nTry : *add/remove* :(",
                    MessageType.text
                );
                return;
            }
        }

        // Defining JID
        if (numberOfArguments >= 2) {
            if (args[1].match(/^\d{12}$/)) {
                JID = args[1] + "@s.whatsapp.net";
            } else {
                client.sendMessage(
                    BotsApp.from,
                    "oops - Invalid Contact number - \nValid format: *XXYYYYYYYYYY* {XX - country code , YYYYYYYYYY - Phone number} :(",
                    MessageType.text
                );
                return;
            }
        } else {
            if (BotsApp.isGroup) {
                if (BotsApp.isReply) {
                    JID =
                        chat.messages.all()[0].message.extendedTextMessage
                            .contextInfo.participant;
                } else {
                    client.sendMessage(
                        BotsApp.from,
                        "oops - Invalid usecase - \n*Tag a message to proceed or Add number as second attribute* :(",
                        MessageType.text
                    );
                    return;
                }
            } else {
                JID = BotsApp.from;
            }
        }

        client.blockUser(JID, blockType);
        console.log(
            "Command to " +
                blockType +
                " " +
                JID.slice(2, 12) +
                " to/from blockList successfully executed"
        );
    },
};
