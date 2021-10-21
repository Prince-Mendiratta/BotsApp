const { MessageType, Mimetype } = require("@adiwajshing/baileys")
const format = require('python-format-js');
const googleTTS = require('google-tts-api');
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "tts",
    description: STRINGS.tts.DESCRIPTION,
    extendedDescription: STRINGS.tts.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ['.tts やめてください', '.tts やめてください | ja']},
    async handle(client, chat, BotsApp, args) {
        const proccessing = await client.sendMessage(BotsApp.chatId, STRINGS.tts.PROCESSING, MessageType.text);
        let text = '';
        let langCode = "en";
        if(!BotsApp.isReply){
            try{
                var body = BotsApp.body.split("|")
                text = body[0].replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                console.log(text)
                if(text === ""){
                    await client.sendMessage(BotsApp.chatId, "Enter text", MessageType.text);
                    return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
                }
                var i = 0;
                var lang = body[1].split(" ");
                console.log(lang[i].length)
                while(lang[i].length == 0){
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
            text += args[i] + " ";
        }
        if(text === ""){
            await client.sendMessage(BotsApp.chatId, STRINGS.tts.NO_INPUT, MessageType.text);
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
            }
        }
        return await client.deleteMessage (BotsApp.chatId, {id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true});
    }
}
