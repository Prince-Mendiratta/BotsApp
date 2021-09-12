const { MessageType, Mimetype } = require('@adiwajshing/baileys')


class ClientWithHandlers{
    constructor(client){
        this.client = client;
    }

    sendMessage(id, content){
        return this.client.sendMessage(id, content, MessageType.text);
    }
}

module.exports = ClientWithHandlers;