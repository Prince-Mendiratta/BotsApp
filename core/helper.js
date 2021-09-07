const fs = require('fs')
const config = require('../config')
require("../sidekick/sidekick")


exports.resolve = function(messageInstance, client, groupMetadata) {
    var BotsApp = new BotsApp();
    BotsApp.setStartTime(messageInstance.t);
    BotsApp.mimeType = Object.keys(messageInstance.message)[0];
    BotsApp.type = BotsApp.mimeType === 'imageMessage' ? 'image' : (BotsApp.mimeType === 'videoMessage') ? 'video' : (BotsApp.mimeType === 'conversation' || BotsApp.mimeType == 'extendedTextMessage') ? 'text' : (BotsApp.mimeType === 'audioMessage') ? 'audio' : (BotsApp.mimeType === 'stickerMessage') ? 'sticker' : '';
    BotsApp.body = BotsApp.mimeType === 'conversation' ? messageInstance.message.conversation : (BotsApp.mimeType == 'imageMessage') ? messageInstance.message.imageMessage.caption : (BotsApp.mimeType == 'videoMessage') ? messageInstance.message.videoMessage.caption : (BotsApp.mimeType == 'extendedTextMessage') ? messageInstance.message.extendedTextMessage.text : '';
    BotsApp.isCmd = BotsApp.body.test(Config.PREFIX);
    BotsApp.commandName = BotsApp.isCmd ? BotsApp.body.slice(1).trim().split(/ +/).shift().toLowerCase() : '';
    BotsApp.from = messageInstance.key.remoteJid;
    BotsApp.owner = client.user.jid;
    BotsApp.logGroup = client.user.jid;
    BotsApp.isGroup = BotsApp.from.endsWith('@g.us');
    BotsApp.isPm = !BotsApp.isGroup;
    BotsApp.sender =  BotsApp.isGroup ? messageInstance.message.contextInfo.participant : '';
    BotsApp.groupName = BotsApp.isGroup ? groupMetadata.subject : '';
    BotsApp.groupMembers = BotsApp.isGroup ? groupMetadata.participants : '';
    BotsApp.groupAdmins = BotsApp.isGroup ? getGroupAdmins(BotsApp.groupMembers) : '';
    BotsApp.groupId = BotsApp.isGroup ? groupMetadata.id : '';
    BotsApp.isBotGroupAdmins = BotsApp.groupAdmins.includes(BotsApp.owner) || false;
    BotsApp.isSenderGroupAdmin = BotsApp.groupAdmins.includes(BotsApp.sender) || false;

    return BotsApp;
}

function getGroupAdmins(participants){
    const admins = [];
    for (const i in participants) {
        i.isAdmin ? admins.push(i.jid) : '';
    }
    return admins;
}