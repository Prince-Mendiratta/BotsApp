export
const googleTTS = require('google-tts-api');
const STRINGS = require("../lib/db");
require('python-format-js');
const TRANSMIT = require('../core/transmission')
module.exports = {
    name: "tts",
    description: STRINGS.tts.DESCRIPTION,
    extendedDescription: STRINGS.tts.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ['.tts やめてください', '.tts やめてください | ja']},
    async handle(client, chat, BotsApp, args) {


        let text = '';
        let langCode = "en";
        for (let i = 0; i < args.length; i++) {
            if (args[i] == '|') {
                langCode = args[i + 1];
                break;
            }
            text += args[i] + " ";
        }
        text = text.replace(/[`*_~]/g,"")
        if(text === "" && (!BotsApp.isReply)){
           return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tts.NO_INPUT})
        }

        if(BotsApp.isReply) text = BotsApp.replyMessage.replace(/[`*_~]/g,"")

        if(text.length > 200){
            return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tts.TOO_LONG.format(text.length)})
        }else{
             await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tts.PROCESSING})
            try {
                const url = googleTTS.getAudioUrl(text, {
                    lang: langCode,
                    slow: false,
                    host: 'https://translate.google.com',
                });
                // console.log(url);
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {audio:{url:url},mimetype: 'audio/mpeg'}).catch(err => inputSanitization.handleError(err, client, BotsApp));

            }
            catch (err) {
                 console.log(err);
            }
        }
    }
}