import { proto, WASocket } from "@adiwajshing/baileys";
import { MessageType } from "./message-type";

class Client {
    sock: WASocket;

    constructor(sock: WASocket) {
        this.sock = sock;
    }

    async sendMessage(jid: string, content: any, type: string, options?: object) {
        let res: proto.WebMessageInfo;
        if (type === MessageType.text) {
            res = await this.sock.sendMessage(jid, { 
                text: content
            });
        }else if(type === MessageType.sticker){
            res = await this.sock.sendMessage(jid, {
                sticker: new Buffer(content)
            })
        }else if(type === MessageType.audio){
            res = await this.sock.sendMessage(jid, {
                audio: content,
                mimetype: 'audio/mp4'
            })
        }
        return res;
    };

    async deleteMessage(jid: string, key: any) {
        await this.sock.sendMessage(jid, {
            delete: key
        });
    };
}

export = Client;