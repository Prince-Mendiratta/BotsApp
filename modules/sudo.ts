import config from "../config";
// const fs = require("fs");
// const os = require("os");
// const path = require("path");
// const envFilePath = path.resolve("./config.env");
// const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

import Strings from "../lib/db";
import { MessageType } from "../sidekick/message-type";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import inputSanitization from "../sidekick/input-sanitization";
const sudo = Strings.sudo;

module.exports = {
    name: "sudo",
    description: sudo.DESCRIPTION,
    extendedDescription: sudo.EXTENDED_DESCRIPTION,
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            // const setEnvValue = async (key, value) => {
            //     const envVars = readEnvVars();
            //     const targetLine = envVars.find(
            //         (line) => line.split("=")[0] === key
            //     );
            //     if (targetLine !== undefined) {
            //         // update existing line
            //         const targetLineIndex = envVars.indexOf(targetLine);
            //         // replace the key/value with the new value
            //         envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
            //     } else {
            //         // create new key value
            //         envVars.push(`${key}="${value}"`);
            //     }
            //     // write everything back to the file system
            //     await fs.writeFileSync(envFilePath, envVars.join(os.EOL));
            //     client.sendMessage(BotsApp.chatId, sudo.SUCCESS, MessageType.text);
            // };
            var phone_number: string;
            var SUDOString: string = config.SUDO;

            if (args.length === 1) {         // If the user only specifies the action, it will take the number from the reply
                console.log("args[0]", SUDOString)
                console.log("BotsApp.isTextReply", BotsApp.isTextReply);

                if (args[0] === "list" || args[0] === "info") {
                    client.sendMessage(
                        BotsApp.chatId,
                        "```Sudo Users:\n" + SUDOString.split(",").join("\n") + "\n\nTotal: " + SUDOString.split(",").length + "```",
                        MessageType.text
                    );
                    return
                }

                //if replying to a message
                if (BotsApp.isTextReply) {
                    const JID = chat.message.extendedTextMessage.contextInfo.participant;
                    phone_number = JID.substring(0, JID.indexOf("@"));
                    console.log("JID", JID)
                    console.log("phone_number", phone_number)
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        sudo.ACTION_NOT_SPECIFIED,
                        MessageType.text
                    );
                    return
                }
            }
            
            else if (args[0] === "add" && args.length === 2) {        // If the user specifies the action as add, it will add the number to the SUDO list
                phone_number = args[1];

                if (SUDOString.includes(phone_number)) {        // If the number is already in the SUDO list, it will send an error message
                    client.sendMessage(
                        BotsApp.chatId,
                        sudo.ADD_ERROR,
                        MessageType.text
                    );
                    return
                }
                //SUDOString -> 5491134017315,5491136666828
                SUDOString = SUDOString + "," + phone_number;
                // setEnvValue("SUDO", SUDOString);
                config.SUDO = SUDOString;
                return;
            // } else if (args[0] === "remove") {
            //     if (!config.SUDO.includes(number)) {
            //         client.sendMessage(
            //             BotsApp.chatId,
            //             sudo.REMOVE_ERROR,
            //             MessageType.text
            //         );
            //         return
            //     }
            //     var re = new RegExp(number, "g");
            //     SUDOString = SUDOString.replace(re, "");
            //     // setEnvValue("SUDO", SUDOString);
            //     config.SUDO = SUDOString;
            //     return;
            // } else {
            //     console.log("Incorrect attribute");
            //     client.sendMessage(
            //         BotsApp.chatId,
            //         "```Unrecognised action for .sudo command. Try add/remove.```",
            //         MessageType.text
            //     );
            //     return
            }
            else {        // If the user doesn't specify the action, it will send an error message
                client.sendMessage(
                    BotsApp.chatId,
                    sudo.ACTION_NOT_SPECIFIED,
                    MessageType.text
                );
                return
            }
        } catch (error) {
            await inputSanitization.handleError(error, client, BotsApp);
        }
    },
};