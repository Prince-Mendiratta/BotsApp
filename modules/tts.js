const { MessageType, Mimetype } = require("@adiwajshing/baileys")
const format = require('python-format-js');
const googleTTS = require('google-tts-api');
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "tts",
    description: STRINGS.tts.DESCRIPTION,
    extendedDescription: STRINGS.tts.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: '.tts Hi there... I am BotsApp. | en'},
    async handle(client, chat, BotsApp, args) {
        const proccessing = await client.sendMessage(BotsApp.chatId, STRINGS.tts.PROCESSING, MessageType.text);
        let text = '';
        let langCode = "en";
        if(!BotsApp.isReply){
            try{
                var body = BotsApp.body.split("|")
                text = body[0].replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                console.log(BotsApp.body[0])
                var i = 0;
                var lang = body[1].split(" ");
                console.log(lang[i].length)
                while(lang[i].length == 0){
                    console.log("bruh " + lang[i])
                    i++;
                }
                langCode = lang[i];
                console.log(langCode)
            }catch(err){
                if(err instanceof TypeError){
                    text = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                    langCode = 'English'
                }
                console.log(err)
            }
        }else if(BotsApp.replyMessage){
            if(args.length == 0){
                langCode = "en";
            }else{
                langCode = args[0];
            }
            text = BotsApp.replyMessage;
        }else{
            await client.sendMessage(BotsApp.chatId, STRINGS.tts.INVALID_REPLY, MessageType.text);
            return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
        }
        if(text.length > 200){
            await client.sendMessage(BotsApp.chatId, STRINGS.tts.TOO_LONG.format(text.length), MessageType.text);
        }else{
            try {
                const url = googleTTS.getAudioUrl(text, {
                    lang: langCode,
                    slow: false,
                    host: 'https://translate.google.com',
                });
                console.log(url);
                await client.sendMessage(BotsApp.chatId, { url: url }, MessageType.audio, { mimetype: Mimetype.mp4Audio });
            }
            catch (err) {
                console.log(err);
                await client.sendMessage(BotsApp.chatId, STRINGS.tts.INVALID_LANG_CODE, MessageType.text);
            }
        }
        return await client.deleteMessage (BotsApp.chatId, {id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true});
    }
}

