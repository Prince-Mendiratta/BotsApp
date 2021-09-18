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

        if (numberOfArguments > 2) {
            client.sendMessage(
                BotsApp.from,
                "*oops - Number of Arguments exceeded - Try Again :(*",
                MessageType.text
            );
            return;
        }

        if (numberOfArguments >= 1) {
            if (args[0] === "add" || args[0] === "remove") {
                blockType = args[0];
            } else {
                client.sendMessage(
                    BotsApp.from,
                    "*oops - Invalid attribute - Try again :(*",
                    MessageType.text
                );
                return;
            }
        }

        // Case 1- 2 arguments
        if (numberOfArguments === 2) {
            if (args[1].match(/^\d{12}$/)) {
                var jidNumber = args[1];
            } else {
                client.sendMessage(
                    BotsApp.from,
                    "*oops - Invalid Contact number - Try Again :(*",
                    MessageType.text
                );
                return;
            }
        }
        // Case 2- less than two argument
        else {
            if (BotsApp.isGroup) {
                if (BotsApp.isReply) {
                    JID =
                        chat.messages.all()[0].message.extendedTextMessage
                            .contextInfo.participant;
                } else {
                    client.sendMessage(
                        BotsApp.from,
                        "*oops - Invalid usecase - Try again :(*",
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
