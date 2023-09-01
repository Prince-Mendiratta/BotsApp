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
            let isReplayAction = false;

            if (args.length === 1) {         // If the user only specifies the action, it will take the number from the reply
                if (args[0] === "list" || args[0] === "info") {
                    
                    let userCount: number = SUDOString.split(",").filter((item) => item !== "").length;     //filter empty strings
                    client.sendMessage(
                        BotsApp.chatId,
                        SUDOString === "" ?
                            sudo.NO_SUDO_USERS :
                            "```Sudo Users:\n" + SUDOString.split(",").join("\n") + "\n\nTotal: " + userCount + "```",
                        MessageType.text
                    );
                    return
                }

                //if replying to a message
                if (BotsApp.isTextReply) {
                    const JID = chat.message.extendedTextMessage.contextInfo.participant;
                    phone_number = JID.substring(0, JID.indexOf("@"));
                    isReplayAction = true;
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        sudo.ACTION_NOT_SPECIFIED,
                        MessageType.text
                    );
                    return
                }
            }

            if (args.length === 2 || isReplayAction) {       // If the user specifies the action and the number, it will take the number from the args
                phone_number = isReplayAction ? phone_number : args[1];
                let SUDOStringArray = SUDOString.split(",");

                if (args[0] === "add") {
                    // If the number is already in the SUDO list, it will send an error message
                    if (SUDOStringArray.includes(phone_number)) {
                        client.sendMessage(
                            BotsApp.chatId,
                            sudo.ADD_ERROR,
                            MessageType.text
                        );
                        return
                    }
                    //add to array
                    SUDOStringArray.push(phone_number);
                    SUDOString = SUDOStringArray.join(",");
                    // setEnvValue("SUDO", SUDOString);
                    config.SUDO = SUDOString;
                    return;

                } else if (args[0] === "remove") {
                    if (!SUDOStringArray.includes(phone_number)) {
                        client.sendMessage(
                            BotsApp.chatId,
                            sudo.REMOVE_ERROR,
                            MessageType.text
                        );
                        return
                    }
                    //remove from array
                    SUDOStringArray = SUDOStringArray.filter((item) => item !== phone_number);
                    SUDOString = SUDOStringArray.join(",");
                    // setEnvValue("SUDO", SUDOString);
                    config.SUDO = SUDOString;
                    return;

                }
            }
            // If the user does not specify the action, it will send an error message
            client.sendMessage(
                BotsApp.chatId,
                sudo.ACTION_NOT_SPECIFIED,
                MessageType.text
            );
            return
        } catch (error) {
            await inputSanitization.handleError(error, client, BotsApp);
        }
    },
};