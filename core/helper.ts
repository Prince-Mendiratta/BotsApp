import fs from 'fs'
import config from '../config'
import chalk from 'chalk'
import BotsAppClass from '../sidekick/sidekick'
import { Contact, GroupMetadata, GroupParticipant, proto, WASocket } from '@adiwajshing/baileys'


const resolve = async function (messageInstance: proto.IWebMessageInfo, client: WASocket) {
    var BotsApp: BotsAppClass = new BotsAppClass();
    var prefix: string = config.PREFIX + '\\w+'
    var prefixRegex: RegExp = new RegExp(prefix, 'g');
    var SUDOstring: string = config.SUDO;
    let sender: string = messageInstance.key.remoteJid;
    const groupMetadata: GroupMetadata = sender.endsWith("@g.us") ? await client.groupMetadata(sender) : null;
    try {
        var jsonMessage: string = JSON.stringify(messageInstance);
    } catch (err) {
        console.log(chalk.redBright("[ERROR] Something went wrong. ", err))
    }
    BotsApp.chatId = messageInstance.key.remoteJid;
    BotsApp.fromMe = messageInstance.key.fromMe;
    BotsApp.owner = client.user.id.replace(/:.*@/g, '@');
    BotsApp.mimeType = messageInstance.message ? (Object.keys(messageInstance.message)[0] === 'senderKeyDistributionMessage' ? Object.keys(messageInstance.message)[2] : Object.keys(messageInstance.message)[0]) : null;
    BotsApp.type = BotsApp.mimeType === 'imageMessage' ? 'image' : (BotsApp.mimeType === 'videoMessage') ? 'video' : (BotsApp.mimeType === 'conversation' || BotsApp.mimeType == 'extendedTextMessage') ? 'text' : (BotsApp.mimeType === 'audioMessage') ? 'audio' : (BotsApp.mimeType === 'stickerMessage') ? 'sticker' : (BotsApp.mimeType === 'senderKeyDistributionMessage' && messageInstance.message?.senderKeyDistributionMessage?.groupId === 'status@broadcast') ? 'status' : null;
    BotsApp.isTextReply = (BotsApp.mimeType === 'extendedTextMessage' && messageInstance.message?.extendedTextMessage?.contextInfo?.stanzaId) ? true : false;
    BotsApp.replyMessageId = messageInstance.message?.extendedTextMessage?.contextInfo?.stanzaId;
    BotsApp.replyParticipant = messageInstance.message?.extendedTextMessage?.contextInfo?.participant;
    BotsApp.replyMessage = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
    BotsApp.body = BotsApp.mimeType === 'conversation' ? messageInstance.message?.conversation : (BotsApp.mimeType == 'imageMessage') ? messageInstance.message?.imageMessage.caption : (BotsApp.mimeType == 'videoMessage') ? messageInstance.message?.videoMessage.caption : (BotsApp.mimeType == 'extendedTextMessage') ? messageInstance.message?.extendedTextMessage?.text : (BotsApp.mimeType == 'buttonsResponseMessage') ? messageInstance.message?.buttonsResponseMessage.selectedDisplayText : null;
    BotsApp.isCmd = prefixRegex.test(BotsApp.body);
    BotsApp.commandName = BotsApp.isCmd ? BotsApp.body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
    BotsApp.isImage = BotsApp.type === "image";
    BotsApp.isReplyImage = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ? true : false;
    BotsApp.imageCaption = BotsApp.isImage ? messageInstance.message?.imageMessage.caption : null;
    BotsApp.isGIF = (BotsApp.type === 'video' && messageInstance.message?.videoMessage?.gifPlayback);
    BotsApp.isReplyGIF = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.gifPlayback ? true : false;
    BotsApp.isSticker = BotsApp.type === 'sticker';
    BotsApp.isReplySticker = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ? true : false;
    BotsApp.isReplyAnimatedSticker = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage?.isAnimated;
    BotsApp.isVideo = (BotsApp.type === 'video' && !messageInstance.message?.videoMessage?.gifPlayback);
    BotsApp.isReplyVideo = BotsApp.isTextReply ? (jsonMessage.indexOf("videoMessage") !== -1 && !messageInstance.message?.extendedTextMessage?.contextInfo.quotedMessage.videoMessage.gifPlayback) : false;
    BotsApp.isAudio = BotsApp.type === 'audio';
    BotsApp.isReplyAudio = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage ? true : false;
    BotsApp.logGroup = client.user.id.replace(/:.*@/g, '@');;
    BotsApp.isGroup = BotsApp.chatId.endsWith('@g.us');
    BotsApp.isPm = !BotsApp.isGroup;
    BotsApp.sender = (BotsApp.isGroup && messageInstance.message && BotsApp.fromMe) ? BotsApp.owner : (BotsApp.isGroup && messageInstance.message) ? messageInstance.key.participant : (!BotsApp.isGroup) ? BotsApp.chatId : null;
    BotsApp.groupName = BotsApp.isGroup ? groupMetadata.subject : null;
    BotsApp.groupMembers = BotsApp.isGroup ? groupMetadata.participants : null;
    BotsApp.groupAdmins = BotsApp.isGroup ? getGroupAdmins(BotsApp.groupMembers) : null;
    BotsApp.groupId = BotsApp.isGroup ? groupMetadata.id : null;
    BotsApp.isSenderSUDO = SUDOstring.includes(BotsApp.sender?.substring(0, BotsApp.sender.indexOf("@")));
    BotsApp.isBotGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.owner)) : false;
    BotsApp.isSenderGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.sender)) : false;

    return BotsApp;
}

function getGroupAdmins(participants: GroupParticipant[]): string[] {
    var admins: string[] = [];
    for (var i in participants) {
        participants[i].admin ? admins.push(participants[i].id) : '';
    }
    // console.log("ADMINS -> " + admins);
    return admins;
}

export = resolve;