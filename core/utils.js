const { MessageType, Mimetype } = require('@adiwajshing/baileys')


class Handlers{

    constructor(client){
        this.sendMsessage = this.sendMsessage;
    }

    sendMsessage(id, content){
        this.sendMessage(id, content, MessageType.text);
    }
}

module.exports = Handlers;