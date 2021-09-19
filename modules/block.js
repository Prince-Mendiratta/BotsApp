const { MessageType } = require("@adiwajshing/baileys");

module.exports = {
    name: "block",
    description: "block contact",
    extendedDescription: "Add number to the blocklist.",
    async handle(client, chat, BotsApp, args) {
        var JID = "";
        var jidNumber;
    
        if (args.length > 0) {
            if (isNaN(args[0]) || args[0][0] === "+") {
                if (args[0][0] === "@" || args[0][0] === "+") {
                    jidNumber = args[0].substring(1, args[0].length + 1);
                } else {
                    client.sendMessage(
                        BotsApp.from,
                        "Enter valid contact number",
                        MessageType.text
                    );
                    return;
                }
            } else {
                jidNumber = args[0];
            }
            if (jidNumber.length < 10 || jidNumber.length > 13) {
                client.sendMessage(
                    BotsApp.from,
                    "Enter valid contact number",
                    MessageType.text
                );
                return;
            } else if (jidNumber.length === 10) {
                jidNumber = "91" + jidNumber;
            }
            JID = jidNumber + "@s.whatsapp.net";
        } else if (!BotsApp.isGroup) {
            JID = BotsApp.from;
            jidNumber = JID.substring(0, JID.indexOf("@"));
        } else {
            if (BotsApp.isReply) {
                JID =
                    chat.messages.all()[0].message.extendedTextMessage
                    .contextInfo.participant;
    
                jidNumber = JID.substring(0, JID.indexOf("@"));
            } else {
                client.sendMessage(
                    BotsApp.from,
                    "Tag a message or enter number",
                    MessageType.text
                );
                return;
            }
        }
    
        client.blockUser(JID, "add");
        console.log(
            "Command to add " +
            " " +
            jidNumber +
            " to blockList successfully executed"
        );
        client.sendMessage(
            BotsApp.from,
            "*" + jidNumber + " blocked successfully.*",
            MessageType.text
        );
    },
};