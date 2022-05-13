import config from '../config';
import fs, { PathLike } from "fs";
import chalk from "chalk";
import { JSDOM } from "jsdom";
import db from "../lib/db"
import format from 'string-format';
import { Transform } from "stream";
import { writeFile } from 'fs/promises';

const { window } = new JSDOM();
const ERROR_TEMPLATE = db.general.ERROR_TEMPLATE

// exports.getCleanedContact = async (args,client,BotsApp) => {
//     var jidNumber = '';
//     var countryCode = config.COUNTRY_CODE; 
//     if (isNaN(args[0]) || args[0][0] === "+") {
//         if (args[0][0] === "@" || args[0][0] === "+") {
//             jidNumber = args[0].substring(1, args[0].length + 1);


//         }
//         else {
//             client.sendMessage(BotsApp.chatId,"*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",MessageType.text);
//             return undefined;
//         }
//     } else {
//         jidNumber = args[0];       
//     }

//     if (jidNumber.length < 8 || jidNumber.length > 13) {
//         client.sendMessage(
//             BotsApp.chatId,
//             "*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",
//             MessageType.text
//         );
//         return undefined;
//     } 
//     else if (jidNumber.length === 10) { 
//         jidNumber = countryCode + jidNumber;
//     }
//     var isOnWhatsApp = await client.isOnWhatsApp(jidNumber);
//     if(isOnWhatsApp === undefined){
//         throw "NumberInvalid"; 
//     }

//     // isOnWhatsApp is not working
//     return jidNumber;
// }

const deleteFiles = async (...locations: PathLike[]) => {
    for (let location of locations) {
        fs.unlink(location, (err) => {
            if (err) console.log(err);
            else {
                // console.log("\nDeleted file at: " + location);
            }
        });
    }
};

const performanceTime = async (startTime) => {
    var endTime = window.performance.now();
    // console.log(
    //     `-----------\nExecution time: ${
    //         (endTime - startTime) / 1000
    //     } seconds\n----------`
    // );
}

// exports.isMember = async (chatId, groupMembers) => {
//         var isMember = false;
//         if(!(chatId === undefined)){
//             for (const index in groupMembers) {
//                 if (chatId == groupMembers[index].jid.split("@")[0]) {
//                     isMember = true;
//                 }
//             }
//             return isMember;
//         }
//         else{
//             return isMember;
//         }
// }

const handleError = async (err, client, BotsApp, customMessage = "```Something went wrong. The error has been logged in log chats```") => {
    console.log(chalk.redBright.bold("[ERROR] " + err));
    let data = {
        commandName: BotsApp.commandName,
        fromMe: BotsApp.fromMe,
        isReply: BotsApp.isReply,
        isGroup: BotsApp.isGroup,
        isPm: BotsApp.isPm,
        isImage: BotsApp.isImage,
        isBotGroupAdmin: BotsApp.isBotGroupAdmin,
        isSenderGroupAdmin: BotsApp.isSenderGroupAdmin,
        isSenderSudo: BotsApp.isSenderSUDO,
        err: err
    }
    client.sendMessage(BotsApp.chatId, { text: customMessage });
    client.sendMessage(BotsApp.logGroup, { text: format(ERROR_TEMPLATE, data) });
}

const saveBuffer = async (fileName: string, stream: Transform) => {
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    await writeFile(fileName, buffer);
}

const inputSanitization = {
    handleError: handleError,
    performanceTime: performanceTime,
    deleteFiles: deleteFiles,
    saveBuffer: saveBuffer
}

export default inputSanitization;

export const adminCommands = [
    "add",
    "demote",
    "invite",
    "mute",
    "promote",
    "remove",
    "unmute",
    "welcome",
    "disappear",
    "goodbye",
    "setdp",
    "tagall",
    "abl",
    "rbl"
];

export const sudoCommands = ["block", "unblock"];
