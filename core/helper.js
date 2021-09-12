const fs = require('fs')
const config = require('../config')
var BotsAppClass = require("../sidekick/sidekick")


exports.resolve = function(messageInstance, client, groupMetadata) {
    var BotsApp = new BotsAppClass();
    console.log(messageInstance);
    console.log(JSON.stringify(messageInstance));
    BotsApp.mimeType = messageInstance.message ? Object.keys(messageInstance.message)[0] : null;
    BotsApp.type = BotsApp.mimeType === 'imageMessage' ? 'image' : (BotsApp.mimeType === 'videoMessage') ? 'video' : (BotsApp.mimeType === 'conversation' || BotsApp.mimeType == 'extendedTextMessage') ? 'text' : (BotsApp.mimeType === 'audioMessage') ? 'audio' : (BotsApp.mimeType === 'stickerMessage') ? 'sticker' : '';
    BotsApp.isReply = BotsApp.mimeType === 'extendedTextMessage';
    BotsApp.body = BotsApp.mimeType === 'conversation' ? messageInstance.message.conversation : (BotsApp.mimeType == 'imageMessage') ? messageInstance.message.imageMessage.caption : (BotsApp.mimeType == 'videoMessage') ? messageInstance.message.videoMessage.caption : (BotsApp.mimeType == 'extendedTextMessage') ? messageInstance.message.extendedTextMessage.text : '';
    BotsApp.isCmd = config.PREFIX.test(BotsApp.body);
    BotsApp.commandName = BotsApp.isCmd ? BotsApp.body.slice(1).trim().split(/ +/).shift().toLowerCase() : '';
    BotsApp.from = messageInstance.key.remoteJid || '';
    BotsApp.fromMe = messageInstance.key.fromMe;
    BotsApp.owner = client.user.jid || '';
    BotsApp.logGroup = client.user.jid || '';
    BotsApp.isGroup = BotsApp.from.endsWith('@g.us');
    BotsApp.isPm = !BotsApp.isGroup;
    BotsApp.sender =  (BotsApp.isGroup && messageInstance.message) ? messageInstance.participant : '';
    BotsApp.groupName = BotsApp.isGroup ? groupMetadata.subject : '';
    BotsApp.groupMembers = BotsApp.isGroup ? groupMetadata.participants : '';
    BotsApp.groupAdmins = BotsApp.isGroup ? getGroupAdmins(BotsApp.groupMembers) : '';
    BotsApp.groupId = BotsApp.isGroup ? groupMetadata.id : '';
    BotsApp.isBotGroupAdmin = BotsApp.isGroup ? BotsApp.groupAdmins.includes(BotsApp.owner) || false : '';
    BotsApp.isSenderGroupAdmin = BotsApp.isGroup ? BotsApp.groupAdmins.includes(BotsApp.sender) || false : '';

    return BotsApp;
}

function getGroupAdmins(participants){
    var admins = [];
    for (var i in participants) {
        participants[i].isAdmin ? admins.push(participants[i].jid) : '';
    }
    console.log("ADMINS -> " + admins);
    return admins;
}