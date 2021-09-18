class BotsApp{
    constructor(mimeType, type, isReply, body, isCmd, commandName, from, fromMe, owner, logGroup, isGroup, isPm, sender, groupName, groupMembers, groupAdmins, groupId, isBotGroupAdmin, isSenderGroupAdmin){
        this.mimeType = mimeType;
        this.type = type;
        this.isReply = isReply;
        this.body = body;
        this.isCmd = isCmd;
        this.commandName = commandName;
        this.from = from; // Where from
        this.fromMe = fromMe;
        this.owner = owner;
        this.logGroup = logGroup;
        this.isGroup = isGroup;
        this.isPm = isPm;
        this.sender = sender; // Sender if group
        this.groupName = groupName;
        this.groupMembers = groupMembers;
        this.groupAdmins = groupAdmins;
        this.groupId = groupId;
        this.isBotGroupAdmin = isBotGroupAdmin;
        this.isSenderGroupAdmin = isSenderGroupAdmin;
    }
}

module.exports = BotsApp;