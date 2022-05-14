import { AnyMessageContent, proto, WASocket } from "@adiwajshing/baileys";
import { MessageType } from "./message-type";

class Client {
    sock: WASocket;

    constructor(sock: WASocket) {
        this.sock = sock;
    }

    async sendMessage(jid: string, content: any, type: string, options?: any) {
        let res: proto.WebMessageInfo;
        let ops: AnyMessageContent;
        if (type === MessageType.text) {
            ops = {
                text: content
            }
            if(options?.contextInfo?.mentionedJid){
                ops.mentions = options.contextInfo.mentionedJid
            }
            res = await this.sock.sendMessage(jid, ops);
        }else if(type === MessageType.sticker){
            res = await this.sock.sendMessage(jid, {
                sticker: new Buffer(content)
            })
        }else if(type === MessageType.audio){
            res = await this.sock.sendMessage(jid, {
                audio: content,
                mimetype: 'audio/mp4'
            })
        }else if(type === MessageType.image){
            ops = {
                image: content,
            }
            if(options?.caption){
                ops.caption = options.caption;
            }
            res = await this.sock.sendMessage(jid, ops);
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