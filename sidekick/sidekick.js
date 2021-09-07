class BotsApp{
    constructor(start, mimeType, type, body, isCmd, commandName, from, owner, logGroup, isGroup, isPm, sender, groupName, groupMembers, groupAdmins, groupId, isBotGroupAdmin, isSenderGroupAdmin){
        this.start = start;
        this.mimeType = mimeType;
        this.type = type;
        this.body = body;
        this.isCmd = isCmd;
        this.commandName = commandName;
        this.from = from;
        this.owner = owner;
        this.logGroup = logGroup;
        this.isGroup = isGroup;
        this.isPm = isPm;
        this.sender = sender;
        this.groupName = groupName;
        this.groupMembers = groupMembers;
        this.groupAdmins = groupAdmins;
        this.groupId = groupId;
        this.isBotGroupAdmin = isBotGroupAdmin;
        this.isSenderGroupAdmin = isSenderGroupAdmin;
    }

    set setStartTime(unixTime){
        var date = new Date(unixTime * 1000);
        this.start = date;
    }
}