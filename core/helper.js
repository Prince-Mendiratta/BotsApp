const fs = require('fs')
const config = require('../config')
const chalk = require('chalk')

var BotsAppClass = require("../sidekick/sidekick")


exports.resolve = function(messageInstance, client, groupMetadata) {
    var BotsApp = new BotsAppClass();
    var prefix = config.PREFIX + '\\w+'
    var prefixRegex = new RegExp(prefix, 'g');
    var SUDOstring = config.SUDO;
    try{
        var jsonMessage = JSON.stringify(messageInstance)
    }catch(err){
        console.log(chalk.redBright("[ERROR] Something went wrong. ", err))
    }
    // console.log(messageInstance);
    // console.log(jsonMessage);
    BotsApp.chatId = messageInstance.key.remoteJid || '';
    BotsApp.fromMe = messageInstance.key.fromMe;
    BotsApp.owner = client.user.jid || '';
    BotsApp.mimeType = messageInstance.message ? Object.keys(messageInstance.message)[0] : null;
    BotsApp.type = BotsApp.mimeType === 'imageMessage' ? 'image' : (BotsApp.mimeType === 'videoMessage') ? 'video' : (BotsApp.mimeType === 'conversation' || BotsApp.mimeType == 'extendedTextMessage') ? 'text' : (BotsApp.mimeType === 'audioMessage') ? 'audio' : (BotsApp.mimeType === 'stickerMessage') ? 'sticker' : '';
    BotsApp.isReply = (BotsApp.mimeType === 'extendedTextMessage' && messageInstance.message.extendedTextMessage.hasOwnProperty('contextInfo') && messageInstance.message.extendedTextMessage.contextInfo.hasOwnProperty('stanzaId'));
    BotsApp.replyMessageId = (BotsApp.isReply && messageInstance.message.extendedTextMessage.contextInfo) ? messageInstance.message.extendedTextMessage.contextInfo.stanzaId : '';
    BotsApp.replyMessage = (BotsApp.isReply && messageInstance.message.extendedTextMessage.contextInfo) ? messageInstance.message.extendedTextMessage.contextInfo.quotedMessage.conversation : '';
    BotsApp.replyParticipant = (BotsApp.isReply && messageInstance.message.extendedTextMessage.contextInfo) ? messageInstance.message.extendedTextMessage.contextInfo.participant : '';
    BotsApp.body = BotsApp.mimeType === 'conversation' ? messageInstance.message.conversation : (BotsApp.mimeType == 'imageMessage') ? messageInstance.message.imageMessage.caption : (BotsApp.mimeType == 'videoMessage') ? messageInstance.message.videoMessage.caption : (BotsApp.mimeType == 'extendedTextMessage') ? messageInstance.message.extendedTextMessage.text : (BotsApp.mimeType == 'buttonsResponseMessage') ? messageInstance.message.buttonsResponseMessage.selectedDisplayText :'';
    BotsApp.isCmd = prefixRegex.test(BotsApp.body);
    BotsApp.commandName = BotsApp.isCmd ? BotsApp.body.slice(1).trim().split(/ +/).shift().toLowerCase() : '';
    BotsApp.isImage = BotsApp.type === "image";
    BotsApp.isReplyImage = BotsApp.isReply ? jsonMessage.indexOf("imageMessage") !== -1 : false;
    BotsApp.imageCaption = BotsApp.isImage ? messageInstance.message.imageMessage.caption : '';
    BotsApp.isGIF = (BotsApp.type === 'video' && messageInstance.message.videoMessage.gifPlayback);
    BotsApp.isReplyGIF = BotsApp.isReply ? (jsonMessage.indexOf("videoMessage") !== -1 && messageInstance.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.gifPlayback) : false;
    BotsApp.isSticker = BotsApp.type === 'sticker';
    BotsApp.isReplySticker = BotsApp.isReply ? jsonMessage.indexOf("stickerMessage") !== -1 : false;
    BotsApp.isReplyAnimatedSticker = BotsApp.isReplySticker ? messageInstance.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated :false;
    BotsApp.isVideo = (BotsApp.type === 'video' && !messageInstance.message.videoMessage.gifPlayback);
    BotsApp.isReplyVideo = BotsApp.isReply ? (jsonMessage.indexOf("videoMessage") !== -1 && !messageInstance.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.gifPlayback) : false;
    BotsApp.isAudio = BotsApp.type === 'audio';
    BotsApp.isReplyAudio = BotsApp.isReply ? jsonMessage.indexOf("audioMessage") !== -1 : false;
    BotsApp.logGroup = client.user.jid || '';
    BotsApp.isGroup = BotsApp.chatId.endsWith('@g.us');
    BotsApp.isPm = !BotsApp.isGroup;
    BotsApp.sender =  (BotsApp.isGroup && messageInstance.message && BotsApp.fromMe) ? BotsApp.owner : (BotsApp.isGroup && messageInstance.message) ? messageInstance.participant : (!BotsApp.isGroup) ? BotsApp.chatId: '';
    BotsApp.groupName = BotsApp.isGroup ? groupMetadata.subject : '';
    BotsApp.groupMembers = BotsApp.isGroup ? groupMetadata.participants : '';
    BotsApp.groupAdmins = BotsApp.isGroup ? getGroupAdmins(BotsApp.groupMembers) : '';
    BotsApp.groupId = BotsApp.isGroup ? groupMetadata.id : '';
    BotsApp.isSenderSUDO = SUDOstring.includes(BotsApp.sender.substring(0,BotsApp.sender.indexOf("@")));
    BotsApp.isBotGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.owner)) : false;
    BotsApp.isSenderGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.sender)) : false;

    return BotsApp;
}

function getGroupAdmins(participants){
    var admins = [];
    for (var i in participants) {
        participants[i].isAdmin ? admins.push(participants[i].jid) : '';
    }
    // console.log("ADMINS -> " + admins);
    return admins;
}