import chalk from 'chalk';
import config from '../config';
import { adminCommands, sudoCommands } from "../sidekick/input-sanitization"
import STRINGS from "../lib/db";
import Users from '../database/user';
import format from 'string-format';
import BotsApp from '../sidekick/sidekick';
import { WASocket } from '@adiwajshing/baileys';
import Client from '../sidekick/client';
import { MessageType } from '../sidekick/message-type';

const GENERAL = STRINGS.general;

const clearance = async (BotsApp: BotsApp, client: Client, isBlacklist: boolean): Promise<boolean> => {
    if (isBlacklist) {
        if (BotsApp.isGroup) {
            await client.getGroupMetaData(BotsApp.chatId, BotsApp);
            if ((!BotsApp.fromMe && !BotsApp.isSenderSUDO && !BotsApp.isSenderGroupAdmin)) {
                return false;
            }
        } else if ((!BotsApp.fromMe && !BotsApp.isSenderSUDO)) {
            console.log(chalk.blueBright.bold(`[INFO] Blacklisted Chat or User.`));
            return false;
        }
    }
    else if ((BotsApp.chatId === "917838204238-1634977991@g.us" || BotsApp.chatId === "120363020858647962@g.us" || BotsApp.chatId === "120363023294554225@g.us")) {
        console.log(chalk.blueBright.bold(`[INFO] Bot disabled in Support Groups.`));
        return false;
    }
    if (BotsApp.isCmd && (!BotsApp.fromMe && !BotsApp.isSenderSUDO)) {
        if (config.WORK_TYPE.toLowerCase() === "public") {
            if (BotsApp.isGroup) {
                await client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (adminCommands.indexOf(BotsApp.commandName) >= 0 && !BotsApp.isSenderGroupAdmin) {
                    console.log(
                        chalk.redBright.bold(`[INFO] admin commmand `),
                        chalk.greenBright.bold(`${BotsApp.commandName}`),
                        chalk.redBright.bold(
                            `not executed in public Work Type.`
                        )
                    );
                    await client.sendMessage(
                        BotsApp.chatId,
                        GENERAL.ADMIN_PERMISSION,
                        MessageType.text
                    );
                    return false;
                } else if (sudoCommands.indexOf(BotsApp.commandName) >= 0 && !BotsApp.isSenderSUDO) {
                    console.log(
                        chalk.redBright.bold(`[INFO] sudo commmand `),
                        chalk.greenBright.bold(`${BotsApp.commandName}`),
                        chalk.redBright.bold(
                            `not executed in public Work Type.`
                        )
                    );
                    let messageSent: boolean = await Users.getUser(BotsApp.chatId);
                    if (messageSent) {
                        console.log(chalk.blueBright.bold("[INFO] Promo message had already been sent to " + BotsApp.chatId))
                        return false;
                    }
                    else {
                        await client.sendMessage(
                            BotsApp.chatId,
                            format(GENERAL.SUDO_PERMISSION, { worktype: "public", groupName: BotsApp.groupName ? BotsApp.groupName : "private chat", commandName: BotsApp.commandName }),
                            MessageType.text
                        );
                        await Users.addUser(BotsApp.chatId);
                        return false;
                    }
                } else {
                    return true;
                }
            }else if(BotsApp.isPm){
                return true;
            }
        } else if (config.WORK_TYPE.toLowerCase() != "public" && !BotsApp.isSenderSUDO) {
            console.log(
                chalk.redBright.bold(`[INFO] commmand `),
                chalk.greenBright.bold(`${BotsApp.commandName}`),
                chalk.redBright.bold(
                    `not executed in private Work Type.`
                )
            );
            //             let messageSent = await Users.getUser(BotsApp.chatId);
            //             if(messageSent){
            //                 console.log(chalk.blueBright.bold("[INFO] Promo message had already been sent to " + BotsApp.chatId))
            //                 return false;
            //             }
            //             else{
            //                 await client.sendMessage(
            //                     BotsApp.chatId,
            //                     GENERAL.SUDO_PERMISSION.format({ worktype: "private", groupName: BotsApp.groupName ? BotsApp.groupName : "private chat", commandName: BotsApp.commandName }),
            //                     MessageType.text,
            //                     {
            //                         contextInfo: {
            //                             stanzaId: BotsApp.chatId,
            //                             participant: BotsApp.sender,
            //                             quotedMessage: {
            //                                 conversation: BotsApp.body,
            //                             },
            //                         },
            //                     }
            //                 );
            //                 await Users.addUser(BotsApp.chatId)
            //                 return false;
            //             }
        }
    } else {
        return true;
    }
}

export = clearance;