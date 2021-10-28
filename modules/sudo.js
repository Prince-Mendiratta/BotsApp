const { MessageType } = require("@adiwajshing/baileys");
const config = require("../config");
const fs = require("fs");
const Strings = require("../lib/db");
const sudo = Strings.sudo;
const os = require("os");
const path = require("path");
const envFilePath = path.resolve("./config.env");

const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

module.exports = {
    name: "sudo",
    description: sudo.DESCRIPTION,
    extendedDescription: sudo.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        const setEnvValue = async (key, value) => {
            const envVars = readEnvVars();
            const targetLine = envVars.find(
                (line) => line.split("=")[0] === key
            );
            if (targetLine !== undefined) {
                // update existing line
                const targetLineIndex = envVars.indexOf(targetLine);
                // replace the key/value with the new value
                envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
            } else {
                // create new key value
                envVars.push(`${key}="${value}"`);
            }
            // write everything back to the file system
            await fs.writeFileSync(envFilePath, envVars.join(os.EOL));
            client.sendMessage(BotsApp.chatId, sudo.SUCCESS, MessageType.text);
        };
        var number;
        var SUDOString = config.SUDO;
        if (args.length === 2) {
            number = args[1];
        } else if (args.length === 1) {
            if (!(args[0] === "add" || args[0] === "remove")) {
                return client.sendMessage(
                    BotsApp.chatId,
                    sudo.ACTION_NOT_SPECIFIED,
                    MessageType.text
                );
            }
            if (BotsApp.isReply) {
                const JID =
                    chat.message.extendedTextMessage.contextInfo.participant;

                number = JID.substring(0, JID.indexOf("@"));
            } else {
                return client.sendMessage(
                    BotsApp.chatId,
                    sudo.NUMBER_NOT_FOUND,
                    MessageType.text
                );
            }
        } else {
            return client.sendMessage(
                BotsApp.chatId,
                sudo.ACTION_NOT_SPECIFIED,
                MessageType.text
            );
        }
        if (args[0] === "add") {
            if (config.SUDO.includes(number)) {
                return client.sendMessage(
                    BotsApp.chatId,
                    sudo.ADD_ERROR,
                    MessageType.text
                );
            }
            SUDOString = SUDOString.concat(number);
            setEnvValue("SUDO", SUDOString);
            config.SUDO = SUDOString;
            return;
        } else if (args[0] === "remove") {
            if (!config.SUDO.includes(number)) {
                return client.sendMessage(
                    BotsApp.chatId,
                    sudo.REMOVE_ERROR,
                    MessageType.text
                );
            }
            var re = new RegExp(number, "g");
            SUDOString = SUDOString.replace(re, "");
            setEnvValue("SUDO", SUDOString);
            config.SUDO = SUDOString;
            return;
        } else {
            console.log("Incorrect attribute");
            return client.sendMessage(
                BotsApp.chatId,
                "```Unrecognised action for .sudo command. Try add/remove.```",
                MessageType.text
            );
        }
    },
};
