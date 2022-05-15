import { AnyMessageContent, GroupMetadata, GroupParticipant, proto, WASocket } from "@adiwajshing/baileys";
import { MessageType } from "./message-type";
import BotsApp from "./sidekick";

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
            text: 'ok',
            buttons: [{
                buttonId: 'id',
                buttonText: {displayText: 'ok'},
                type: 1
            }]
        })
        await this.sock.sendMessage(jid, {
            delete: key
        });
    };

    async getGroupMetaData(jid: string, BotsApp: BotsApp){
        const groupMetadata: GroupMetadata = jid.endsWith("@g.us") ? await this.sock.groupMetadata(jid) : null;
        const getGroupAdmins = (participants: GroupParticipant[]): string[] => {
            var admins: string[] = [];
            for (var i in participants) {
                participants[i].admin ? admins.push(participants[i].id) : '';
            }
            // console.log("ADMINS -> " + admins);
            return admins;
        }
        BotsApp.groupName = BotsApp.isGroup ? groupMetadata.subject : null;
        BotsApp.groupMembers = BotsApp.isGroup ? groupMetadata.participants : null;
        BotsApp.groupAdmins = BotsApp.isGroup ? getGroupAdmins(BotsApp.groupMembers) : null;
        BotsApp.groupId = BotsApp.isGroup ? groupMetadata.id : null;
        BotsApp.isBotGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.owner)) : false;
        BotsApp.isSenderGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.sender)) : false;
    }
}

export = Client;